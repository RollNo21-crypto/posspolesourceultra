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

// import { useState, useEffect } from 'react'
// import { supabase } from '../supabase/client'
// import type { Database } from '../supabase/schema'

// type Product = Database['public']['Tables']['products']['Row']

// interface UseProductsOptions {
//   type?: 'buy' | 'donate'
//   status?: 'active' | 'inactive' | 'pending'
//   category?: string
//   sellerId?: string
//   page?: number
//   pageSize?: number
//   limit?: number
// }

// export function useProducts(options: UseProductsOptions = {}) {
//   const [products, setProducts] = useState<Product[]>([])
//   const [totalCount, setTotalCount] = useState(0)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<Error | null>(null)

//   const {
//     type,
//     status,
//     category,
//     sellerId,
//     page = 1,
//     pageSize = 10,
//     limit
//   } = options

//   useEffect(() => {
//     async function loadProducts() {
//       setIsLoading(true)
//       try {
//         // First, let's check all products to debug
//         const { data: allProducts, error: countError } = await supabase
//           .from('products')
//           .select('*')
        
//         console.log('All products in database:', allProducts?.length)
//         console.log('Products by type:', {
//           buy: allProducts?.filter(p => p.type === 'buy').length,
//           donate: allProducts?.filter(p => p.type === 'donate').length
//         })
//         console.log('Products by status:', {
//           active: allProducts?.filter(p => p.status === 'active').length,
//           inactive: allProducts?.filter(p => p.status === 'inactive').length,
//           pending: allProducts?.filter(p => p.status === 'pending').length
//         })

//         // Now build our filtered query
//         let query = supabase
//           .from('products')
//           .select('*', { count: 'exact' })
//           .is('deleted_at', null)

//         // Add type filter if specified
//         if (type) {
//           query = query.eq('type', type)
//           console.log('Filtering by type:', type)
//         }

//         // For frontend views, only show active products
//         if (status) {
//           query = query.eq('status', status)
//           console.log('Filtering by status:', status)
//         } else {
//           query = query.eq('status', 'active')
//           console.log('Filtering by default status: active')
//         }

//         // Add category filter if specified
//         if (category) {
//           query = query.eq('category', category)
//           console.log('Filtering by category:', category)
//         }

//         // Add seller filter if specified
//         if (sellerId) {
//           query = query.eq('seller_id', sellerId)
//           console.log('Filtering by seller:', sellerId)
//         }

//         // Order by created date, newest first
//         query = query.order('created_at', { ascending: false })

//         // Apply limit if specified, otherwise use pagination
//         if (limit) {
//           query = query.limit(limit)
//           console.log('Applying limit:', limit)
//         } else {
//           const start = (page - 1) * pageSize
//           const end = page * pageSize - 1
//           query = query.range(start, end)
//           console.log('Applying pagination:', { start, end })
//         }

//         // Execute the query
//         const { data, error: fetchError, count } = await query

//         if (fetchError) {
//           console.error('Error fetching products:', fetchError)
//           throw fetchError
//         }

//         console.log('Query results:', {
//           total: count,
//           returned: data?.length,
//           type,
//           status: status || 'active',
//           data
//         })
        
//         setProducts(data || [])
//         setTotalCount(count || 0)
//       } catch (err) {
//         console.error('Error loading products:', err)
//         setError(err instanceof Error ? err : new Error('Failed to fetch products'))
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadProducts()

//     // Subscribe to real-time changes
//     const subscription = supabase
//       .channel('products-changes')
//       .on('postgres_changes', {
//         event: '*',
//         schema: 'public',
//         table: 'products',
//         filter: type ? `type=eq.${type}` : undefined
//       }, () => {
//         loadProducts()
//       })
//       .subscribe()

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [type, status, category, sellerId, page, pageSize, limit])

//   async function updateProductStatus(id: string, newStatus: Product['status']) {
//     try {
//       const { error } = await supabase
//         .from('products')
//         .update({ status: newStatus })
//         .eq('id', id)

//       if (error) throw error
      
//       setProducts(prev => 
//         prev.map(product => 
//           product.id === id 
//             ? { ...product, status: newStatus }
//             : product
//         )
//       )
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('Failed to update product'))
//       throw err
//     }
//   }

//   async function deleteProduct(id: string) {
//     try {
//       const { error } = await supabase
//         .from('products')
//         .update({ deleted_at: new Date().toISOString() })
//         .eq('id', id)

//       if (error) throw error
      
//       setProducts(prev => prev.filter(product => product.id !== id))
//       setTotalCount(prev => prev - 1)
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('Failed to delete product'))
//       throw err
//     }
//   }

//   return { 
//     products, 
//     totalCount,
//     isLoading, 
//     error, 
//     updateProductStatus, 
//     deleteProduct 
//   }
// }