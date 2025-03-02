import React from 'react';
import { Package, ArrowRight, ShoppingCart, Gift } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CheckoutPreviewProps {
  type: 'buy' | 'donate';
  items: Array<{
    id: string;
    title: string;
    category: string;
    price?: number;
    quantity: number;
    image_url: string;
  }>;
  onProceed: () => void;
  onClose: () => void;
}

export function CheckoutPreview({ type, items, onProceed, onClose }: CheckoutPreviewProps) {
  const totalAmount = type === 'buy' 
    ? items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
    : 0;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {type === 'buy' ? (
                <ShoppingCart className="h-6 w-6 text-primary-600" />
              ) : (
                <Gift className="h-6 w-6 text-secondary-600" />
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {type === 'buy' ? 'Review Your Quote Request' : 'Review Your Donation'}
              </h2>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-6">
            <div className="text-sm text-gray-500">
              {totalItems} item{totalItems !== 1 ? 's' : ''} selected
            </div>
            
            <div className="max-h-[40vh] overflow-y-auto space-y-3">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                      {type === 'buy' && item.price && (
                        <>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-900">
                            {/* {formatPrice(item.price * item.quantity)} */}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {type === 'buy' && (
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  {/* {formatPrice(totalAmount)} */}
                </span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Fill in your contact details</li>
              <li>Review your {type === 'buy' ? 'quote request' : 'donation'}</li>
              <li>Submit and receive confirmation</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className={cn(
                'flex items-center px-6 py-2 text-white rounded-lg',
                type === 'buy'
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-secondary-600 hover:bg-secondary-700'
              )}
            >
              <span>Proceed</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}