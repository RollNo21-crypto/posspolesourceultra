import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { Database } from '../supabase/schema'

type Request = Database['public']['Tables']['requests']['Row']

interface UseRequestsOptions {
  type: 'buy' | 'donate'
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  pageSize?: number
}

export function useRequests({ type, status, page = 1, pageSize = 10 }: UseRequestsOptions) {
  const [requests, setRequests] = useState<Request[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let query = supabase
      .from('requests')
      .select(`
        *,
        products:request_products (
          product:products (
            id,
            title,
            description,
            price,
            category,
            image_url,
            type,
            status
          )
        )
      `, { count: 'exact' })
      .eq('type', type)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const subscription = supabase
      .channel('requests-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'requests',
        filter: `type=eq.${type}`
      }, () => {
        fetchRequests()
      })
      .subscribe()

    async function fetchRequests() {
      try {
        const { data, error: fetchError, count } = await query
        if (fetchError) throw fetchError
        setRequests(data || [])
        setTotalCount(count || 0)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch requests'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()

    return () => {
      subscription.unsubscribe()
    }
  }, [type, status, page, pageSize])

  async function updateRequestStatus(id: string, newStatus: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { ...request, status: newStatus }
            : request
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update request'))
      throw err
    }
  }

  return { 
    requests, 
    totalCount,
    isLoading, 
    error, 
    updateRequestStatus 
  }
}