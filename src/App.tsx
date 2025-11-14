import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Goals } from './components/Goals';
import { Subscriptions } from './components/Subscriptions';
import { Settings } from './components/Settings';
import { Toaster, toast } from "sonner";
import { supabase } from './utils/storage';
import {
  Transaction,
  Goal,
  Subscription,
  Settings as SettingsType,
} from "./utils/types";

import {
  getTransactions,
  saveTransactions,
  getGoals,
  saveGoals,
  getSubscriptions,
  saveSubscriptions,
  getSettings,
  saveSettings,
} from "./utils/storage";
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [settings, setSettings] = useState<SettingsType>({
    monthlyLimit: 50000,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Anonymous login for automatic per-user isolation
  useEffect(() => {
    supabase.auth.signInAnonymously();
  }, []);

  // 🔹 Load data from cloud storage after login
  useEffect(() => {
    const loadData = async () => {
      try {
        const [txns, gls, subs, sets] = await Promise.all([
          getTransactions(),
          getGoals(),
          getSubscriptions(),
          getSettings(),
        ]);

        setTransactions(txns);
        setGoals(gls);
        setSubscriptions(subs);
        setSettings(sets);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data from cloud');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Transaction handlers
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const updated = [...transactions, newTransaction];
    setTransactions(updated);
    await saveTransactions(updated);
    toast.success(`${transaction.type === 'income' ? 'Income' : 'Expense'} added!`);
  };

  const handleDeleteTransaction = async (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    await saveTransactions(updated);
    toast.success('Transaction deleted');
  };

  const handleEditTransaction = async (id: string, transaction: Omit<Transaction, 'id'>) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, ...transaction } : t
    );
    setTransactions(updated);
    await saveTransactions(updated);
    toast.success('Transaction updated successfully!');
  };
  
  // Goal handlers
  const handleAddGoal = async (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    await saveGoals(updated);
    toast.success('Goal created!');
  };

  const handleAddProgress = async (goalId: string, amount: number) => {
    const updated = goals.map((g) =>
      g.id === goalId
        ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
        : g
    );
    setGoals(updated);
    await saveGoals(updated);
    toast.success(`Added ₹${amount} to goal`);
  };

  // Subscription handlers
  const handleAddSubscription = async (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription = {
      ...subscription,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const updated = [...subscriptions, newSubscription];
    setSubscriptions(updated);
    await saveSubscriptions(updated);
    toast.success('Subscription added!');
  };

  const handleToggleSubscription = async (id: string) => {
    const updated = subscriptions.map((s) =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    setSubscriptions(updated);
    await saveSubscriptions(updated);
    toast.success('Subscription updated');
  };

  const handleEditSubscription = async (id: string, subscription: Omit<Subscription, 'id'>) => {
    const updated = subscriptions.map((s) =>
      s.id === id ? { ...s, ...subscription } : s
    );
    setSubscriptions(updated);
    await saveSubscriptions(updated);
    toast.success('Subscription updated successfully!');
  };
  
  // Settings handlers
  const handleUpdateLimit = async (limit: number) => {
    const updated = { ...settings, monthlyLimit: limit };
    setSettings(updated);
    await saveSettings(updated);
  };

  // FAB handler - navigate to transactions and open add expense
  const handleFABClick = () => {
    setActiveTab('transactions');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-center" />
      
      {/* Main Content */}
      <main className="min-h-screen">
        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            monthlyLimit={settings.monthlyLimit}
          />
        )}
        {activeTab === 'transactions' && (
          <Transactions
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
          />
        )}
        {activeTab === 'goals' && (
          <Goals
            goals={goals}
            onAddGoal={handleAddGoal}
            onAddProgress={handleAddProgress}
          />
        )}
        {activeTab === 'subscriptions' && (
          <Subscriptions
            subscriptions={subscriptions}
            onAddSubscription={handleAddSubscription}
            onToggleSubscription={handleToggleSubscription}
            onEditSubscription={handleEditSubscription}
          />
        )}
        {activeTab === 'settings' && (
          <Settings
            monthlyLimit={settings.monthlyLimit}
            onUpdateLimit={handleUpdateLimit}
          />
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab !== 'transactions' && (
        <FloatingActionButton onClick={handleFABClick} />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}