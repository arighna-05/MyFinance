import { Goal } from '../utils/storage';
import { Target, Plus } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onAddProgress: (goalId: string, amount: number) => void;
}

export function GoalCard({ goal, onAddProgress }: GoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const handleAddProgress = () => {
    const amount = prompt('How much would you like to add?');
    if (amount && !isNaN(parseFloat(amount))) {
      onAddProgress(goal.id, parseFloat(amount));
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">{goal.name}</h3>
          </div>
          <p className="text-sm text-gray-500">
            ₹{goal.currentAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{progress.toFixed(0)}% complete</span>
          <span className="text-gray-600">₹{remaining.toLocaleString()} left</span>
        </div>
      </div>

      {/* Add Progress Button */}
      <button
        onClick={handleAddProgress}
        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Progress
      </button>
    </div>
  );
}
