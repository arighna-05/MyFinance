import { useState } from 'react';
import { Goal } from '../utils/storage';
import { GoalCard } from './GoalCard';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onAddProgress: (goalId: string, amount: number) => void;
}

export function Goals({ goals, onAddGoal, onAddProgress }: GoalsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = () => {
    if (!goalName || !targetAmount) return;

    onAddGoal({
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      createdAt: new Date().toISOString(),
    });

    setGoalName('');
    setTargetAmount('');
    setShowAddDialog(false);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gray-900">Savings Goals</h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Goal
        </Button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-400">No savings goals yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first goal to start saving</p>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onAddProgress={onAddProgress} />
          ))
        )}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Create Savings Goal</DialogTitle>
            <DialogDescription>
              Set a target amount for your savings goal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Buy a bag"
                className="rounded-xl mt-1"
              />
            </div>

            <div>
              <Label htmlFor="targetAmount">Target Amount (₹)</Label>
              <Input
                id="targetAmount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="1000"
                className="rounded-xl mt-1"
              />
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}