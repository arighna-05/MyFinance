import { useState } from 'react';
import { Subscription } from '../utils/storage';
import { SubscriptionCard } from './SubscriptionCard';
import { Plus } from 'lucide-react';
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

interface SubscriptionsProps {
  subscriptions: Subscription[];
  onAddSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  onToggleSubscription: (id: string) => void;
  onEditSubscription: (id: string, subscription: Omit<Subscription, 'id'>) => void;
}

export function Subscriptions({
  subscriptions,
  onAddSubscription,
  onToggleSubscription,
  onEditSubscription,
}: SubscriptionsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<string | null>(
    null
  );

  const handleSubmit = () => {
    if (!name || !amount || !billingDate) return;

    onAddSubscription({
      name,
      amount: parseFloat(amount),
      billingDate: parseInt(billingDate),
      cycle,
      isActive: true,
    });

    setName('');
    setAmount('');
    setBillingDate('');
    setCycle('monthly');
    setShowAddDialog(false);
  };

  const handleEdit = (id: string) => {
    const subscription = subscriptions.find((s) => s.id === id);
    if (subscription) {
      setName(subscription.name);
      setAmount(subscription.amount.toString());
      setBillingDate(subscription.billingDate.toString());
      setCycle(subscription.cycle);
      setEditingSubscriptionId(id);
      setShowEditDialog(true);
    }
  };

  const handleEditSubmit = () => {
    if (!name || !amount || !billingDate || !editingSubscriptionId) return;

    const subscription = subscriptions.find((s) => s.id === editingSubscriptionId);
    onEditSubscription(editingSubscriptionId, {
      name,
      amount: parseFloat(amount),
      billingDate: parseInt(billingDate),
      cycle,
      isActive: subscription?.isActive ?? true,
    });

    setName('');
    setAmount('');
    setBillingDate('');
    setCycle('monthly');
    setEditingSubscriptionId(null);
    setShowEditDialog(false);
  };

  const handleCancelEdit = () => {
    setName('');
    setAmount('');
    setBillingDate('');
    setCycle('monthly');
    setEditingSubscriptionId(null);
    setShowEditDialog(false);
  };

  const activeSubscriptions = subscriptions.filter((s) => s.isActive);
  const totalMonthly = activeSubscriptions
    .filter((s) => s.cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);
  const totalYearly = activeSubscriptions
    .filter((s) => s.cycle === 'yearly')
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gray-900">Subscriptions</h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Summary */}
      {activeSubscriptions.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-md mb-6">
          <p className="text-white/90 text-sm mb-2">Total Active Subscriptions</p>
          <div className="flex items-baseline gap-3">
            <p className="text-white text-2xl">₹{totalMonthly.toLocaleString()}</p>
            <p className="text-white/80 text-sm">/month</p>
          </div>
          {totalYearly > 0 && (
            <p className="text-white/80 text-sm mt-1">
              + ₹{totalYearly.toLocaleString()} /year
            </p>
          )}
        </div>
      )}

      {/* Subscriptions List */}
      <div className="space-y-4">
        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-gray-400">No subscriptions yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Track your recurring payments
            </p>
          </div>
        ) : (
          subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onToggle={onToggleSubscription}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Add Subscription Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Subscription</DialogTitle>
            <DialogDescription>
              Add a recurring payment or subscription to track
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Netflix, Vi recharge"
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
              <Label htmlFor="billingDate">Billing Day of Month</Label>
              <Input
                id="billingDate"
                type="number"
                min="1"
                max="31"
                value={billingDate}
                onChange={(e) => setBillingDate(e.target.value)}
                placeholder="e.g., 15"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cycle">Billing Cycle</Label>
              <Select value={cycle} onValueChange={(v: any) => setCycle(v)}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
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
                className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-xl"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Subscription Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the details of your subscription
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Netflix, Vi recharge"
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
              <Label htmlFor="edit-billingDate">Billing Day of Month</Label>
              <Input
                id="edit-billingDate"
                type="number"
                min="1"
                max="31"
                value={billingDate}
                onChange={(e) => setBillingDate(e.target.value)}
                placeholder="e.g., 15"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-cycle">Billing Cycle</Label>
              <Select value={cycle} onValueChange={(v: any) => setCycle(v)}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
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
                className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-xl"
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