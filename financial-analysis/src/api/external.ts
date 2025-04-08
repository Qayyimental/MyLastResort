import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult, body } from 'express-validator';
import { FinancialError } from '../utils/error-handling';
import { validateInput } from '../utils/validators';
import { encrypt } from '../utils/encryption';
import { createLogger } from '../utils/logger';

// Add specific response types
interface MarketData {
    symbol: string;
    price: number;
    volume: number;
    timestamp: number;
}

interface ExchangeRate {
    baseCurrency: string;
    rates: Record<string, number>;
    timestamp: number;
}

interface NewsItem {
    id: string;
    title: string;
    content: string;
    category: string;
    publishedAt: string;
}

interface APIConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
    maxRequestsPerSecond?: number;
    circuitBreakerTimeout?: number;
    cacheDuration?: number;
}

export class ExternalAPIService {
    private config: APIConfig;
    private rateLimiter: Map<string, number[]> = new Map();
    private cleanupInterval: ReturnType<typeof setInterval>;
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private failureCount: Map<string, number> = new Map();
    private circuitState: Map<string, 'closed' | 'open'> = new Map();
    private readonly logger = createLogger('external-api');

    constructor(config: APIConfig) {
        this.config = {
            timeout: 30000,
            maxRetries: 3,
            retryDelay: 1000,
            maxRequestsPerSecond: 5,
            circuitBreakerTimeout: 60000, // 1 minute
            cacheDuration: 300000, // 5 minutes
            ...config
        };
        // Cleanup old rate limit entries every 5 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanupRateLimiter();
            this.cleanupCache();
        }, 300000);
    }

    async fetchMarketData(symbol: string): Promise<MarketData> {
        if (!symbol || typeof symbol !== 'string') {
            throw new FinancialError(
                'Invalid symbol parameter',
                'VALIDATION_ERROR',
                { symbol }
            );
        }
        return this.makeRequest<MarketData>(`/market/${encodeURIComponent(symbol)}`);
    }

    async fetchExchangeRates(baseCurrency: string): Promise<ExchangeRate> {
        if (!baseCurrency || typeof baseCurrency !== 'string' || baseCurrency.length !== 3) {
            throw new FinancialError(
                'Invalid currency code',
                'VALIDATION_ERROR',
                { baseCurrency }
            );
        }
        return this.makeRequest<ExchangeRate>(`/forex/${encodeURIComponent(baseCurrency.toUpperCase())}`);
    }

    async fetchFinancialNews(category: string): Promise<NewsItem[]> {
        if (!category || typeof category !== 'string') {
            throw new FinancialError(
                'Invalid news category',
                'VALIDATION_ERROR',
                { category }
            );
        }
        return this.makeRequest<NewsItem[]>(`/news/${encodeURIComponent(category)}`);
    }

    private async makeRequest<T>(endpoint: string, retryCount = 0): Promise<T> {
        const cacheKey = `${endpoint}`;
        const cached = this.checkCache<T>(cacheKey);
        if (cached) return cached;

        if (this.isCircuitOpen(endpoint)) {
            throw new FinancialError('Circuit breaker is open', 'CIRCUIT_OPEN');
        }

        // Input validation
        validateInput({ endpoint }, ['endpoint']);
        
        this.checkRateLimit(endpoint);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            try {
                const encryptedApiKey = encrypt(this.config.apiKey);
                const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                    headers: {
                        'Authorization': `Bearer ${encryptedApiKey}`,
                        'Content-Type': 'application/json',
                        'X-Request-ID': crypto.randomUUID(),
                        'X-Client-Version': process.env.npm_package_version || '1.0.0'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    this.handleFailure(endpoint);
                    // Retry on 5xx errors
                    if (response.status >= 500 && retryCount < this.config.maxRetries!) {
                        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                        return this.makeRequest(endpoint, retryCount + 1);
                    }
                    throw new FinancialError(
                        `API request failed: ${response.statusText}`,
                        'API_ERROR',
                        { endpoint, status: response.status }
                    );
                }

                const data = await response.json() as T;
                this.updateCache<T>(cacheKey, data);
                this.resetFailureCount(endpoint);
                return data;
            } finally {
                clearTimeout(timeoutId);
            }
        } catch (error) {
            this.logger.error('API request failed', { endpoint, error, retryCount });
            this.handleFailure(endpoint);
            // Retry on network errors
            if (error instanceof Error && error.name === 'NetworkError' && retryCount < this.config.maxRetries!) {
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                return this.makeRequest(endpoint, retryCount + 1);
            }
            throw new FinancialError(
                'External API request failed',
                'API_ERROR',
                { retryCount }
            );
        }
    }

    private checkCache<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.config.cacheDuration!) {
            return cached.data;
        }
        return null;
    }

    private updateCache<T>(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    private cleanupCache(): void {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.config.cacheDuration!) {
                this.cache.delete(key);
            }
        }
    }

    private handleFailure(endpoint: string): void {
        const failures = (this.failureCount.get(endpoint) || 0) + 1;
        this.failureCount.set(endpoint, failures);

        if (failures >= 5) { // Open circuit after 5 failures
            this.circuitState.set(endpoint, 'open');
            setTimeout(() => this.circuitState.delete(endpoint), this.config.circuitBreakerTimeout);
        }
    }

    private isCircuitOpen(endpoint: string): boolean {
        return this.circuitState.get(endpoint) === 'open';
    }

    private resetFailureCount(endpoint: string): void {
        this.failureCount.delete(endpoint);
        this.circuitState.delete(endpoint);
    }

    private checkRateLimit(endpoint: string): void {
        const now = Date.now();
        const calls = this.rateLimiter.get(endpoint) || [];
        const recentCalls = calls.filter(time => now - time < 1000);

        if (recentCalls.length >= this.config.maxRequestsPerSecond!) {
            throw new FinancialError(
                'Rate limit exceeded',
                'RATE_LIMIT',
                { endpoint, maxRequests: this.config.maxRequestsPerSecond }
            );
        }

        recentCalls.push(now);
        this.rateLimiter.set(endpoint, recentCalls);
    }

    private cleanupRateLimiter(): void {
        const now = Date.now();
        for (const [endpoint, timestamps] of this.rateLimiter.entries()) {
            const validTimestamps = timestamps.filter(ts => now - ts <= 3600000);
            if (validTimestamps.length === 0) {
                this.rateLimiter.delete(endpoint);
            } else {
                this.rateLimiter.set(endpoint, validTimestamps);
            }
        }
    }

    // Cleanup on service destruction
    public destroy(): void {
        clearInterval(this.cleanupInterval);
    }
}

// Add validation middleware
export const validateEndpoint = [
    body('endpoint')
        .isString()
        .notEmpty()
        .custom((value: string) => {
            return Object.values(supportedEndpoints).includes(value as SupportedEndpoint);
        })
        .withMessage('Invalid endpoint'),
    body('data').optional().isObject(),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new FinancialError('Invalid input', 'VALIDATION_ERROR', errors.array());
        }
        next();
    }
];

export const supportedEndpoints = {
    MARKET_DATA: '/market',
    EXCHANGE_RATES: '/forex',
    FINANCIAL_NEWS: '/news'
} as const;

export type SupportedEndpoint = typeof supportedEndpoints[keyof typeof supportedEndpoints];