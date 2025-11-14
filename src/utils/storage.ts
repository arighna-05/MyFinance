import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  paymentMode: 'online' | 'cash';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDate: number; // day of month
  cycle: 'monthly' | 'yearly';
  isActive: boolean;
}

export interface Settings {
  monthlyLimit: number;
}

// Helper function to make requests to KV store
async function kvRequest(method: string, key: string, value?: any) {
  const url = `https://${projectId}.supabase.co/functions/v1/make-server-a89f97b9/kv/${key}`;
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
    },
  };

  if (value !== undefined) {
    options.body = JSON.stringify({ value });
  }

  const response = await fetch(url, options);
  if (!response.ok && response.status !== 404) {
    throw new Error(`KV request failed: ${response.statusText}`);
  }
  
  if (response.status === 404) {
    return null;
  }

  return response.json();
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await kvRequest('GET', 'transactions');
    return data?.value || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  try {
    await kvRequest('POST', 'transactions', transactions);
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
}

// Goals
export async function getGoals(): Promise<Goal[]> {
  try {
    const data = await kvRequest('GET', 'goals');
    return data?.value || [];
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  try {
    await kvRequest('POST', 'goals', goals);
  } catch (error) {
    console.error('Error saving goals:', error);
  }
}

// Subscriptions
export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const data = await kvRequest('GET', 'subscriptions');
    return data?.value || [];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}

export async function saveSubscriptions(subscriptions: Subscription[]): Promise<void> {
  try {
    await kvRequest('POST', 'subscriptions', subscriptions);
  } catch (error) {
    console.error('Error saving subscriptions:', error);
  }
}

// Settings
export async function getSettings(): Promise<Settings> {
  try {
    const data = await kvRequest('GET', 'settings');
    return data?.value || { monthlyLimit: 50000 };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { monthlyLimit: 50000 };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await kvRequest('POST', 'settings', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
