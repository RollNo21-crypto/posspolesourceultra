import React from 'react'
import { useStore } from '@/lib/store'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { CheckoutPreview } from './checkout-preview'

interface RequestFormProps {
  type: 'buy' | 'donate'
  onClose: () => void
  onSuccess: (data: any) => void
}

export function RequestForm({ type, onClose, onSuccess }: RequestFormProps) {
  const [step, setStep] = React.useState<'preview' | 'form'>('preview')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { 
    submitBuyRequest, 
    submitDonateRequest, 
    buyCart, 
    donateCart 
  } = useStore()
  
  const items = type === 'buy' ? buyCart : donateCart
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      setIsSubmitting(true)
      const requestData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
      }

      if (type === 'buy') {
        const { id, reference_number } = await submitBuyRequest(requestData)
        onSuccess({
          ...requestData,
          id,
          reference_number,
          type: 'buy',
          items: buyCart.map(item => ({
            title: item.title,
            category: item.category,
            price: item.price,
            quantity: item.quantity
          }))
        })
      } else {
        const { id, reference_number } = await submitDonateRequest(requestData)
        onSuccess({
          ...requestData,
          id,
          reference_number,
          type: 'donate',
          items: donateCart.map(item => ({
            title: item.title,
            category: item.category,
            quantity: item.quantity
          }))
        })
      }
      
      toast.success(type === 'buy' ? 'Quote request submitted successfully' : 'Donation request submitted successfully')
    } catch (error) {
      toast.error('Failed to submit request')
      console.error('Failed to submit request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 'preview') {
    return (
      <CheckoutPreview
        type={type}
        items={items}
        onProceed={() => setStep('form')}
        onClose={onClose}
      />
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setStep('preview')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            type === 'buy'
              ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              : 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  )
}