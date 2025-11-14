import { useState, useEffect } from 'react';
import { Transaction } from '../utils/storage';
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  monthlyLimit: number;
}

export function Dashboard({ transactions, monthlyLimit }: DashboardProps) {
  const [currentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Calculate totals
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;
  const remaining = monthlyLimit - totalExpenses;
  const spendingPercentage = (totalExpenses / monthlyLimit) * 100;
  const isOverBudget = totalExpenses > monthlyLimit;

  // Donut chart data
  const donutData = [
    { name: 'Income', value: totalIncome, color: '#10b981' },
    { name: 'Expenses', value: totalExpenses, color: '#ef4444' },
  ];

  // Weekly spending data
  const getWeeklySpending = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const weeklyData = weeks.map((week, index) => {
      const weekExpenses = currentMonthTransactions
        .filter((t) => {
          const date = new Date(t.date);
          const day = date.getDate();
          return (
            t.type === 'expense' &&
            day > index * 7 &&
            day <= (index + 1) * 7
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return { name: week, amount: weekExpenses };
    });

    return weeklyData;
  };

  const weeklyData = getWeeklySpending();

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-1">Finance Tracker</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-3 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-white/80" />
            <p className="text-white/90 text-sm">Total Income</p>
          </div>
          <p className="text-white text-3xl">₹{totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-white/80" />
            <p className="text-white/90 text-sm">Total Expenses</p>
          </div>
          <p className="text-white text-3xl">₹{totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-white/80" />
            <p className="text-white/90 text-sm">Current Savings</p>
          </div>
          <p className="text-white text-3xl">₹{savings.toLocaleString()}</p>
        </div>
      </div>

      {/* Spending Limit Progress */}
      <div className={`rounded-2xl p-5 shadow-md mb-6 ${isOverBudget ? 'bg-red-50 border-2 border-red-200' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-3">
          <p className={isOverBudget ? 'text-red-900' : 'text-gray-900'}>Monthly Spending Limit</p>
          {isOverBudget && <AlertCircle className="w-5 h-5 text-red-600" />}
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <p className={`text-2xl ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            ₹{totalExpenses.toLocaleString()}
          </p>
          <p className="text-gray-500">of ₹{monthlyLimit.toLocaleString()}</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all ${
              isOverBudget ? 'bg-red-600' : spendingPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
          />
        </div>

        <p className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
          {isOverBudget
            ? `Over budget by ₹${Math.abs(remaining).toLocaleString()}`
            : `₹${remaining.toLocaleString()} remaining`}
        </p>
      </div>

      {/* Charts */}
      <div className="space-y-4">
        {/* Income vs Expenses Donut */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h3 className="text-gray-900 mb-4">Income vs Expenses</h3>
          {totalIncome > 0 || totalExpenses > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <p className="text-gray-400">No data yet</p>
            </div>
          )}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Weekly Spending Bar Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-md">
          <h3 className="text-gray-900 mb-4">Weekly Spending</h3>
          {weeklyData.some(d => d.amount > 0) ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <p className="text-gray-400">No spending data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
