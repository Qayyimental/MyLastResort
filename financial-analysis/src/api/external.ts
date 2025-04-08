import { FinancialError } from '../utils/error-handling';

interface APIConfig {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
}

export class ExternalAPIService {
    private config: APIConfig;
    private rateLimiter: Map<string, number> = new Map();

    constructor(config: APIConfig) {
        this.config = {
            timeout: 30000,
            ...config
        };
    }

    async fetchMarketData(symbol: string): Promise<any> {
        return this.makeRequest(`/market/${symbol}`);
    }

    async fetchExchangeRates(baseCurrency: string): Promise<any> {
        return this.makeRequest(`/forex/${baseCurrency}`);
    }

    async fetchFinancialNews(category: string): Promise<any> {
        return this.makeRequest(`/news/${category}`);
    }

    private async makeRequest(endpoint: string): Promise<any> {
        this.checkRateLimit(endpoint);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new FinancialError(
                    `API request failed: ${response.statusText}`,
                    'API_ERROR',
                    { endpoint, status: response.status }
                );
            }

            return await response.json();
        } catch (error) {
            throw new FinancialError(
                'External API request failed',
                'API_ERROR',
                error
            );
        }
    }

    private checkRateLimit(endpoint: string): void {
        const now = Date.now();
        const lastCall = this.rateLimiter.get(endpoint) || 0;

        if (now - lastCall < 1000) { // 1 request per second
            throw new FinancialError(
                'Rate limit exceeded',
                'RATE_LIMIT',
                { endpoint, waitTime: 1000 - (now - lastCall) }
            );
        }

        this.rateLimiter.set(endpoint, now);
    }
}

export const supportedEndpoints = {
    MARKET_DATA: '/market',
    EXCHANGE_RATES: '/forex',
    FINANCIAL_NEWS: '/news'
} as const;