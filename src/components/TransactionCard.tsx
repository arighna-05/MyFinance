import { Transaction } from '../utils/storage';
import { Trash2, Edit2 } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onDelete, onEdit }: TransactionCardProps) {
  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900">{transaction.title}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {transaction.paymentMode}
            </span>
          </div>
          <p className="text-sm text-gray-500">{transaction.category}</p>
          <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p
              className={`${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}₹
              {transaction.amount.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}