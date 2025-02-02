import { create } from 'zustand'
import { supabase } from './supabase/client'
import type { Database } from './supabase/schema'
import { toast } from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']

type CartProduct = Product & {
  quantity: number;
};

interface AppState {
  buyCart: CartProduct[];
  donateCart: CartProduct[];
  addToBuyCart: (product: Product) => void
  addToDonateCart: (product: Product) => void
  removeFromBuyCart: (productId: string) => void
  removeFromDonateCart: (productId: string) => void
  clearBuyCart: () => void
  clearDonateCart: () => void
  updateBuyCartQuantity: (productId: string, quantity: number) => void;
  updateDonateCartQuantity: (productId: string, quantity: number) => void;
  submitBuyRequest: (data: {
    name: string
    email: string
    phone: string
  }) => Promise<{ id: string }>
  submitDonateRequest: (data: {
    name: string
    email: string
    phone: string
  }) => Promise<{ id: string }>
}

export const useStore = create<AppState>((set, get) => ({
  buyCart: [],
  donateCart: [],
  
  addToBuyCart: (product) => {
    set((state) => {
      const existingItem = state.buyCart.find(item => item.id === product.id);
      if (existingItem) {
        return {
          buyCart: state.buyCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        };
      }
      return {
        buyCart: [...state.buyCart, { ...product, quantity: 1 }]
      };
    });
  },
  
  addToDonateCart: (product) => {
    set((state) => {
      const existingItem = state.donateCart.find(item => item.id === product.id);
      if (existingItem) {
        return {
          donateCart: state.donateCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        };
      }
      return {
        donateCart: [...state.donateCart, { ...product, quantity: 1 }]
      };
    });
  },

  updateBuyCartQuantity: (productId, quantity) => {
    set((state) => ({
      buyCart: state.buyCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    }));
  },

  updateDonateCartQuantity: (productId, quantity) => {
    set((state) => ({
      donateCart: state.donateCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    }));
  },
  
  removeFromBuyCart: (productId) => {
    set((state) => ({
      buyCart: state.buyCart.filter(p => p.id !== productId)
    }))
  },
  
  removeFromDonateCart: (productId) => {
    set((state) => ({
      donateCart: state.donateCart.filter(p => p.id !== productId)
    }))
  },
  
  clearBuyCart: () => {
    set({ buyCart: [] })
  },
  
  clearDonateCart: () => {
    set({ donateCart: [] })
  },
  
  submitBuyRequest: async (data) => {
    const { buyCart } = get()
    
    try {
      // Create the request first
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_name: data.name,
          user_email: data.email,
          user_phone: data.phone,
          type: 'buy',
          status: 'pending'
        })
        .select()
        .single()
      
      if (requestError) throw requestError
      
      // Then create the request-product relationships
      const requestProducts = buyCart.map(product => ({
        request_id: request.id,
        product_id: product.id,
        quantity: product.quantity
      }))
      
      const { error: productsError } = await supabase
        .from('request_products')
        .insert(requestProducts)
      
      if (productsError) {
        // If adding products fails, delete the request
        await supabase
          .from('requests')
          .delete()
          .eq('id', request.id)
        throw productsError
      }
      
      get().clearBuyCart()
      return { id: request.id }
    } catch (error) {
      console.error('Failed to submit buy request:', error)
      throw error
    }
  },
  
  submitDonateRequest: async (data) => {
    const { donateCart } = get()
    
    try {
      // Create the request first
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_name: data.name,
          user_email: data.email,
          user_phone: data.phone,
          type: 'donate',
          status: 'pending'
        })
        .select()
        .single()
      
      if (requestError) throw requestError
      
      // Then create the request-product relationships
      const requestProducts = donateCart.map(product => ({
        request_id: request.id,
        product_id: product.id,
        quantity: product.quantity
      }))
      
      const { error: productsError } = await supabase
        .from('request_products')
        .insert(requestProducts)
      
      if (productsError) {
        // If adding products fails, delete the request
        await supabase
          .from('requests')
          .delete()
          .eq('id', request.id)
        throw productsError
      }
      
      get().clearDonateCart()
      return { id: request.id }
    } catch (error) {
      console.error('Failed to submit donate request:', error)
      throw error
    }
  }
}))