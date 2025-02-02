import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/schema'

type Product = Database['public']['Tables']['products']['Row']

interface UseProductsOptions {
  type?: 'buy' | 'donate'
  status?: 'active' | 'inactive' | 'pending'
  category?: string
  sellerId?: string
  page?: number
  pageSize?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const {
    type,
    status,
    category,
    sellerId,
    page = 1,
    pageSize = 10
  } = options

  useEffect(() => {
    let query = supabase
      .from('products')
      .select(`
        *,
        seller:sellers (
          id,
          company_name,
          contact_name,
          email,
          phone,
          status
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (type) {
      query = query.eq('type', type)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (sellerId) {
      query = query.eq('seller_id', sellerId)
    }

    const subscription = supabase
      .channel('products-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, () => {
        fetchProducts()
      })
      .subscribe()

    async function fetchProducts() {
      try {
        const { data, error: fetchError, count } = await query
        if (fetchError) throw fetchError
        setProducts(data || [])
        setTotalCount(count || 0)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()

    return () => {
      subscription.unsubscribe()
    }
  }, [type, status, category, sellerId, page, pageSize])

  async function updateProductStatus(id: string, newStatus: Product['status']) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setProducts(prev => 
        prev.map(product => 
          product.id === id 
            ? { ...product, status: newStatus }
            : product
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update product'))
      throw err
    }
  }

  async function deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      
      setProducts(prev => prev.filter(product => product.id !== id))
      setTotalCount(prev => prev - 1)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete product'))
      throw err
    }
  }

  return { 
    products, 
    totalCount,
    isLoading, 
    error, 
    updateProductStatus, 
    deleteProduct 
  }
}