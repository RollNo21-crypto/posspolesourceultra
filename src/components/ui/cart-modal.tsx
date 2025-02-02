import React from 'react';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface CartModalProps {
  type: 'buy' | 'donate';
  onClose: () => void;
  onSubmitSuccess: (data: any) => void;
}

export function CartModal({ type, onClose, onSubmitSuccess }: CartModalProps) {
  const [step, setStep] = React.useState<'cart' | 'form'>('cart');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    buyCart,
    donateCart,
    removeFromBuyCart,
    removeFromDonateCart,
    updateBuyCartQuantity,
    updateDonateCartQuantity,
    submitBuyRequest,
    submitDonateRequest,
  } = useStore();

  const cart = type === 'buy' ? buyCart : donateCart;
  const removeFromCart = type === 'buy' ? removeFromBuyCart : removeFromDonateCart;
  const updateQuantity = type === 'buy' ? updateBuyCartQuantity : updateDonateCartQuantity;

  const totalAmount = type === 'buy'
    ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setIsSubmitting(true);
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
      };

      if (type === 'buy') {
        const response = await submitBuyRequest(data);
        onSubmitSuccess({
          ...response,
          ...data,
          type: 'buy',
          items: buyCart.map(item => ({
            title: item.title,
            category: item.category,
            price: item.price,
            quantity: item.quantity
          }))
        });
      } else {
        const response = await submitDonateRequest(data);
        onSubmitSuccess({
          ...response,
          ...data,
          type: 'donate',
          items: donateCart.map(item => ({
            title: item.title,
            category: item.category,
            quantity: item.quantity
          }))
        });
      }
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {type === 'buy' ? 'Your Cart' : 'Donation Items'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {step === 'cart' ? (
          <>
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">
                    {type === 'buy' 
                      ? 'Your cart is empty'
                      : 'No items selected for donation'
                    }
                  </p>
                  <button
                    onClick={onClose}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        {type === 'buy' && (
                          <p className="text-sm font-medium text-primary-600 mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-gray-700 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6">
                {type === 'buy' && (
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setStep('form')}
                  className={cn(
                    'w-full flex items-center justify-center px-6 py-3 rounded-lg',
                    'text-white font-medium',
                    type === 'buy'
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-secondary-600 hover:bg-secondary-700'
                  )}
                >
                  <span>
                    {type === 'buy' ? 'Proceed to Quote Request' : 'Proceed to Donation'}
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md',
                    type === 'buy'
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-secondary-600 hover:bg-secondary-700',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}