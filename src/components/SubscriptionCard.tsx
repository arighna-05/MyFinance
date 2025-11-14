import { Subscription } from '../utils/storage';
import { Calendar, ToggleLeft, ToggleRight, Edit2 } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
}

export function SubscriptionCard({ subscription, onToggle, onEdit }: SubscriptionCardProps) {
  const today = new Date().getDate();
  const daysUntilBilling = subscription.billingDate - today;
  const isUpcoming = daysUntilBilling >= 0 && daysUntilBilling <= 7;

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-md border transition-all ${
        subscription.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
      } ${isUpcoming && subscription.isActive ? 'ring-2 ring-orange-200' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{subscription.name}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {subscription.cycle} subscription
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(subscription.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onToggle(subscription.id)}
            className="flex items-center gap-2 text-sm"
          >
            {subscription.isActive ? (
              <ToggleRight className="w-10 h-10 text-green-600" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <p className="text-sm">
            {subscription.billingDate}{' '}
            {new Date().toLocaleDateString('en-US', { month: 'short' })}
          </p>
        </div>
        <p className="text-blue-600">₹{subscription.amount.toLocaleString()}</p>
      </div>

      {isUpcoming && subscription.isActive && (
        <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
          <p className="text-xs text-orange-700">
            Renewing in {daysUntilBilling} {daysUntilBilling === 1 ? 'day' : 'days'}
          </p>
        </div>
      )}
    </div>
  );
}