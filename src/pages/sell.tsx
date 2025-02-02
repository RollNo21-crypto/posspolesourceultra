import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'
import { ConfirmationCard } from '@/components/ui/confirmation-card'
import { Store, ArrowRight } from 'lucide-react'

export function Sell() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationData, setConfirmationData] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      setIsSubmitting(true)

      const { data, error } = await supabase
        .from('seller_requests')
        .insert({
          company_name: formData.get('company_name'),
          contact_name: formData.get('contact_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          business_description: formData.get('business_description'),
          product_categories: formData.get('product_categories'),
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setConfirmationData({
        name: formData.get('contact_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        companyName: formData.get('company_name'),
        categories: formData.get('product_categories'),
        requestId: data.id
      })

      form.reset()
    } catch (error) {
      console.error('Error submitting seller request:', error)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-12 bg-background-alt">
      {/* Seller Banner */}
      <div className="bg-[rgba(0,0,0,0.7)] text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Store className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">
            Start Selling With Us Today
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our marketplace and reach thousands of potential customers. 
            We make it easy to list your products and manage your inventory.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="#seller-form" className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-600 transition-colors">
              Register Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div id="seller-form" className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-accent mb-6">
            Seller Registration Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-accent-soft">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                required
                className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-accent-soft">
                Contact Name *
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                required
                className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-accent-soft">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-accent-soft">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="business_description" className="block text-sm font-medium text-accent-soft">
                Business Description *
              </label>
              <textarea
                id="business_description"
                name="business_description"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Tell us about your business, products, and experience..."
              />
            </div>

            <div>
              <label htmlFor="product_categories" className="block text-sm font-medium text-accent-soft">
                Product Categories *
              </label>
              <textarea
                id="product_categories"
                name="product_categories"
                rows={2}
                required
                className="mt-1 block w-full rounded-md border-secondary-400 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="List the categories of products you want to sell..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>

            <p className="text-sm text-accent-muted text-center mt-4">
              By submitting this form, you agree to our terms and conditions. 
              We will review your application and contact you within 2-3 business days.
            </p>
          </form>
        </div>
      </div>

      {confirmationData && (
        <ConfirmationCard
          type="seller"
          data={confirmationData}
          onClose={() => setConfirmationData(null)}
        />
      )}
    </div>
  )
}