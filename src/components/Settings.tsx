import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  monthlyLimit: number;
  onUpdateLimit: (limit: number) => void;
}

export function Settings({
  monthlyLimit,
  onUpdateLimit,
}: SettingsProps) {
  const [limit, setLimit] = useState(monthlyLimit.toString());

  useEffect(() => {
    setLimit(monthlyLimit.toString());
  }, [monthlyLimit]);

  const handleSave = () => {
    const newLimit = parseFloat(limit);
    if (!isNaN(newLimit) && newLimit > 0) {
      onUpdateLimit(newLimit);
      toast.success('Monthly spending limit updated!');
    } else {
      toast.error('Please enter a valid amount');
    }
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <h1 className="text-gray-900 mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Monthly Spending Limit */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900">Monthly Spending Limit</h3>
              <p className="text-sm text-gray-500">Set your budget cap</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="limit">Limit Amount (₹)</Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="50000"
                className="rounded-xl mt-1"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Save Limit
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h3 className="text-gray-900 mb-3">About</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Personal Finance Tracker</p>
            <p>Version 1.0.0</p>
            <p className="text-xs text-gray-500 mt-3">
              All data is securely stored in the cloud and persists across sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}