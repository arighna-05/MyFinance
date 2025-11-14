import { useState } from 'react';
import { Transaction } from '../utils/storage';
import { TransactionCard } from './TransactionCard';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
}

export function Transactions({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction,
}: TransactionsProps) {
  const [activeTab, setActiveTab] = useState<'online' | 'cash' | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    if (!title || !amount || !category) return;

    const newTransaction: Omit<Transaction, 'id'> = {
      title,
      amount: parseFloat(amount),
      category,
      date: date || new Date().toISOString().split('T')[0],
      type: transactionType,
      paymentMode: activeTab === 'all' ? 'online' : activeTab,
    };

    onAddTransaction(newTransaction);

    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
    setShowAddDialog(false);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setTitle(transaction.title);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setDate(transaction.date);
    setTransactionType(transaction.type);
    setShowEditDialog(true);
  };

  const handleEditSubmit = () => {
    if (!title || !amount || !category || !editingId) return;

    const editedTransaction: Omit<Transaction, 'id'> = {
      title,
      amount: parseFloat(amount),
      category,
      date: date || new Date().toISOString().split('T')[0],
      type: transactionType,
      paymentMode: activeTab === 'all' ? 'online' : activeTab,
    };

    onEditTransaction(editingId, editedTransaction);

    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
    setEditingId(null);
    setShowEditDialog(false);
  };

  const handleCancelEdit = () => {
    setTitle('');
    setAmount('');
    setCategory('');
    setDate('');
    setEditingId(null);
    setShowEditDialog(false);
  };

  const filteredTransactions = transactions.filter(
    (t) => activeTab === 'all' || t.paymentMode === activeTab
  );

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const expenseCategories = [
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Housing',
    'Health',
    'Coffee',
    'Other',
  ];

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <h1 className="text-gray-900 mb-6">Transactions</h1>

      {/* Tab Switcher */}
      <div className="bg-gray-100 rounded-2xl p-1 mb-6 flex">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 rounded-xl transition-all text-center ${
            activeTab === 'all'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`flex-1 py-3 rounded-xl transition-all text-center ${
            activeTab === 'online'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Online
        </button>
        <button
          onClick={() => setActiveTab('cash')}
          className={`flex-1 py-3 rounded-xl transition-all text-center ${
            activeTab === 'cash'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600'
          }`}
        >
          Cash
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <p className="text-xs text-green-600 mb-1">Income</p>
          <p className="text-green-700">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <p className="text-xs text-red-600 mb-1">Expenses</p>
          <p className="text-red-700">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${savings >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
          <p className={`text-xs mb-1 ${savings >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Balance</p>
          <p className={savings >= 0 ? 'text-blue-700' : 'text-orange-700'}>₹{savings.toLocaleString()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => {
            setTransactionType('income');
            setShowAddDialog(true);
          }}
          className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl py-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Income
        </Button>
        <Button
          onClick={() => {
            setTransactionType('expense');
            setShowAddDialog(true);
          }}
          className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl py-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Payment Mode Label - shown when filtering */}
      {activeTab !== 'all' && filteredTransactions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 text-center">
            Showing {activeTab} transactions
          </p>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first transaction above</p>
          </div>
        ) : (
          filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onDelete={onDeleteTransaction}
                onEdit={handleEdit}
              />
            ))
        )}
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              Add {transactionType === 'income' ? 'Income' : 'Expense'}
            </DialogTitle>
            <DialogDescription>
              Enter the details of your {transactionType === 'income' ? 'income' : 'expense'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Grocery shopping"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(transactionType === 'income'
                    ? incomeCategories
                    : expenseCategories
                  ).map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className={`flex-1 rounded-xl ${
                  transactionType === 'income'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the details of your transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={transactionType}
                onValueChange={(v: any) => setTransactionType(v)}
              >
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Grocery shopping"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-amount">Amount (₹)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {transactionType === 'expense' ? (
                    <>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Bills">Bills</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Gift">Gift</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}