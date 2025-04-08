import { config } from 'dotenv';
import { FinancialError } from './error-handling';
import { existsSync } from 'fs';

config();

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'SESSION_SECRET',
  'ENCRYPTION_KEY_V1',
  'API_BASE_URL',
  'MISTRAL_API_KEY'
];

export function validateEnv(): void {
  // Check if .env exists
  if (!existsSync('.env')) {
    throw new FinancialError(
      'Missing .env file. Run setup script first.',
      'ENV_ERROR'
    );
  }

  const missing = requiredEnvVars.filter(env => !process.env[env]);
  if (missing.length > 0) {
    throw new FinancialError(
      `Missing required environment variables: ${missing.join(', ')}`,
      'ENV_ERROR'
    );
  }

  // Validate specific values
  if (process.env.ENCRYPTION_KEY_V1!.length < 32) {
    throw new FinancialError(
      'ENCRYPTION_KEY_V1 must be at least 32 bytes long',
      'ENV_ERROR'
    );
  }

  if (!['development', 'production', 'test'].includes(process.env.NODE_ENV!)) {
    throw new FinancialError(
      'Invalid NODE_ENV value',
      'ENV_ERROR'
    );
  }
}

export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new FinancialError(
      `Environment variable ${key} is not set`,
      'ENV_ERROR'
    );
  }
  return value;
}
