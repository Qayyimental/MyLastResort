import { aiConfig } from '../../config/ai-config';

export class MistralService {
    private apiKey: string;
    private endpoint: string;

    constructor() {
        this.apiKey = aiConfig.mistral.apiKey;
        this.endpoint = aiConfig.mistral.endpoint;
    }

    async analyzeFinancialText(text: string): Promise<any> {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: aiConfig.mistral.model,
                    prompt: text,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze text');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Mistral API error: ${error.message}`);
        }
    }

    async extractFinancialMetrics(text: string): Promise<any> {
        const analysis = await this.analyzeFinancialText(text);
        return this.parseFinancialMetrics(analysis);
    }

    private parseFinancialMetrics(analysis: any): any {
        // Implement parsing logic based on Mistral's response format
        return {
            sentiment: analysis.sentiment,
            metrics: analysis.metrics,
            recommendations: analysis.recommendations
        };
    }
}