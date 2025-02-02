import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/schema'

type Seller = Database['public']['Tables']['sellers']['Row']

interface UseSellersOptions {
  status?: 'pending' | 'active' | 'suspended' | 'banned'
  page?: number
  pageSize?: number
}

export function useSellers({ status, page = 1, pageSize = 10 }: UseSellersOptions = {}) {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        let query = supabase
          .from('sellers')
          .select(`
            *,
            products (
              id,
              title,
              status
            )
          `, { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)

        if (status) {
          query = query.eq('status', status)
        }

        const { data, error: fetchError, count } = await query
        if (fetchError) throw fetchError
        setSellers(data || [])
        setTotalCount(count || 0)
      } catch (err) {
        console.error('Error fetching sellers:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch sellers'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSellers()

    const subscription = supabase
      .channel('sellers-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sellers'
      }, () => {
        fetchSellers()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [status, page, pageSize])

  const updateSellerStatus = async (id: string, newStatus: Seller['status']) => {
    try {
      const { error } = await supabase
        .from('sellers')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setSellers(prev => 
        prev.map(seller => 
          seller.id === id 
            ? { ...seller, status: newStatus }
            : seller
        )
      )
    } catch (err) {
      console.error('Error updating seller status:', err)
      throw err
    }
  }

  return { 
    sellers, 
    totalCount,
    isLoading, 
    error, 
    updateSellerStatus 
  }
}