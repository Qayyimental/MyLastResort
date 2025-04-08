import fetch from 'node-fetch';
import { Request, Response } from 'express';
import { ApiResponse, FinancialMetrics, FinancialForecast } from '../types/api';
import { Transaction } from '../models/transaction';
import { handleApiError } from '../utils/error-handling';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000/api';

export interface TransactionResponse {
  id: string;
  success: boolean;
  transaction: Transaction;
}

export interface AnalyticsResponse {
  metrics: FinancialMetrics;
  forecast: FinancialForecast;
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json() as ApiResponse<T>;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function fetchFinancialData() {
  const response = await fetch('/api/financial/overview');
  if (!response.ok) throw new Error('Failed to fetch financial data');
  return response.json();
}

export async function saveTransaction(transaction: Partial<Transaction>): Promise<TransactionResponse> {
  const response = await fetchWithAuth<TransactionResponse>('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction)
  });
  return response.data;
}

export async function fetchAnalytics() {
  const response = await fetch('/api/analytics/overview');
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
}

export async function getFinancialMetrics(): Promise<FinancialMetrics> {
  const response = await fetchWithAuth<FinancialMetrics>('/financial/metrics');
  return response.data;
}

export async function getForecast(): Promise<FinancialForecast> {
  const response = await fetchWithAuth<FinancialForecast>('/analytics/forecast');
  return response.data;
}
