// src/config/ai-config.ts

export const aiConfig = {
    mistral: {
        apiKey: process.env.MISTRAL_API_KEY || '',
        endpoint: 'https://api.ollama.com/mistral',
        model: 'latest',
    },
    tensorflow: {
        modelPath: 'models/tensorflow_model',
        version: 'latest',
    },
    anomalyDetection: {
        threshold: 0.05,
        algorithms: ['Isolation Forest', 'One-Class SVM'],
    },
};