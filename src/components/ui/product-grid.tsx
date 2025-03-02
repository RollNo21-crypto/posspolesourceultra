// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useStore } from '@/lib/store'
// import { supabase } from '@/lib/supabase/client'
// import type { Database } from '@/lib/supabase/schema'
// import { formatPrice } from '@/lib/utils'
// import { CategoryFilter } from './category-filter'
// import { Plus, Minus } from 'lucide-react'
// import { Pagination, PaginationInfo } from './pagination'

// type Product = Database['public']['Tables']['products']['Row']

// interface ProductGridProps {
//   type: 'buy' | 'donate'
//   limit?: number
// }

// export function ProductGrid({ type, limit }: ProductGridProps) {
//   const [products, setProducts] = React.useState<Product[]>([])
//   const [totalCount, setTotalCount] = React.useState(0)
//   const [categories, setCategories] = React.useState<string[]>([])
//   const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
//   const [isLoading, setIsLoading] = React.useState(true)
//   const [currentPage, setCurrentPage] = React.useState(1)
//   const pageSize = 12

//   const { 
//     buyCart, 
//     donateCart, 
//     addToBuyCart, 
//     addToDonateCart, 
//     removeFromBuyCart, 
//     removeFromDonateCart,
//     updateBuyCartQuantity,
//     updateDonateCartQuantity
//   } = useStore()
  
//   React.useEffect(() => {
//     async function loadProducts() {
//       setIsLoading(true)
//       try {
//         let query = supabase
//           .from('products')
//           .select('*', { count: 'exact' })
//           .eq('type', type)
//           .eq('status', 'active')
//           .order('created_at', { ascending: false })
        
//         if (selectedCategory) {
//           query = query.eq('category', selectedCategory)
//         }
        
//         if (limit) {
//           query = query.limit(limit)
//         } else {
//           query = query.range((currentPage - 1) * pageSize, currentPage * pageSize - 1)
//         }
        
//         const { data, error, count } = await query
//         if (!error && data) {
//           setProducts(data)
//           setTotalCount(count || 0)
          
//           // Extract unique categories
//           const uniqueCategories = Array.from(
//             new Set(data.map((product) => product.category))
//           ).sort()
//           setCategories(uniqueCategories)
//         }
//       } finally {
//         setIsLoading(false)
//       }
//     }
    
//     loadProducts()
//   }, [type, limit, selectedCategory, currentPage, pageSize])
  
//   const getCartItem = (product: Product) => {
//     const cart = type === 'buy' ? buyCart : donateCart
//     return cart.find(item => item.id === product.id)
//   }

//   const handleQuantityChange = (product: Product, delta: number) => {
//     const cartItem = getCartItem(product)
//     const currentQuantity = cartItem?.quantity || 0
//     const newQuantity = Math.max(0, currentQuantity + delta)

//     if (newQuantity === 0) {
//       if (type === 'buy') {
//         removeFromBuyCart(product.id)
//       } else {
//         removeFromDonateCart(product.id)
//       }
//     } else if (cartItem) {
//       if (type === 'buy') {
//         updateBuyCartQuantity(product.id, newQuantity)
//       } else {
//         updateDonateCartQuantity(product.id, newQuantity)
//       }
//     } else if (newQuantity > 0) {
//       if (type === 'buy') {
//         addToBuyCart(product)
//       } else {
//         addToDonateCart(product)
//       }
//     }
//   }
  
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[...Array(8)].map((_, i) => (
//           <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
//             <div className="h-48 bg-secondary-200" />
//             <div className="p-4 space-y-4">
//               <div className="h-4 bg-secondary-200 rounded w-3/4" />
//               <div className="h-4 bg-secondary-200 rounded w-1/2" />
//               <div className="h-8 bg-secondary-200 rounded" />
//             </div>
//           </div>
//         ))}
//       </div>
//     )
//   }
  
//   return (
//     <div>
//       <CategoryFilter
//         categories={categories}
//         selectedCategory={selectedCategory}
//         onSelectCategory={setSelectedCategory}
//       />
      
//       {products.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-accent-muted text-lg">
//             No products found{selectedCategory ? ` in ${selectedCategory}` : ''}.
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {products.map((product) => {
//               const cartItem = getCartItem(product)
//               const quantity = cartItem?.quantity || 0

//               return (
//                 <div
//                   key={product.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <Link to={`/product/${product.id}`}>
//                     <div className="aspect-w-4 aspect-h-3">
//                       <img
//                         src={product.image_url}
//                         alt={product.title}
//                         className="w-full h-48 object-cover"
//                       />
//                     </div>
//                   </Link>
                  
//                   <div className="p-4">
//                     <div className="mb-2">
//                       <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
//                         type === 'buy' 
//                           ? 'bg-primary-50 text-primary'
//                           : 'bg-secondary-200 text-accent-soft'
//                       }`}>
//                         {product.category}
//                       </span>
//                     </div>
                    
//                     <Link to={`/product/${product.id}`}>
//                       <h3 className="text-lg font-semibold text-accent hover:text-primary transition-colors">
//                         {product.title}
//                       </h3>
//                     </Link>
                    
//                     <p className="text-accent-muted text-sm mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
                    
//                     <div className="flex items-center justify-between">
//                       {type === 'buy' && (
//                         <span className="text-lg font-bold text-accent">
//                           {formatPrice(product.price)}
//                         </span>
//                       )}
//                       <div className="flex items-center space-x-2">
//                         {quantity > 0 ? (
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => handleQuantityChange(product, -1)}
//                               className="p-1 rounded-full text-accent-muted hover:text-accent hover:bg-secondary-200 transition-colors"
//                             >
//                               <Minus className="h-4 w-4" />
//                             </button>
//                             <span className="text-accent min-w-[20px] text-center">
//                               {quantity}
//                             </span>
//                             <button
//                               onClick={() => handleQuantityChange(product, 1)}
//                               className="p-1 rounded-full text-accent-muted hover:text-accent hover:bg-secondary-200 transition-colors"
//                             >
//                               <Plus className="h-4 w-4" />
//                             </button>
//                           </div>
//                         ) : (
//                           <button
//                             onClick={() => handleQuantityChange(product, 1)}
//                             className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
//                               type === 'buy'
//                                 ? 'bg-primary text-white hover:bg-primary-600'
//                                 : 'bg-secondary-400 text-accent hover:bg-secondary-500'
//                             }`}
//                           >
//                             Add
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           {!limit && totalCount > pageSize && (
//             <div className="mt-8 flex flex-col items-center gap-4">
//               <PaginationInfo
//                 currentPage={currentPage}
//                 pageSize={pageSize}
//                 totalItems={totalCount}
//               />
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={Math.ceil(totalCount / pageSize)}
//                 onPageChange={setCurrentPage}
//               />
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/lib/store'
import { useProducts } from '@/lib/hooks/use-products'
import type { Database } from '@/lib/supabase/schema'
import { formatPrice } from '@/lib/utils'
import { CategoryFilter } from './category-filter'
import { Plus, Minus } from 'lucide-react'
import { Pagination, PaginationInfo } from './pagination'

type Product = Database['public']['Tables']['products']['Row']

interface ProductGridProps {
  type: 'buy' | 'donate'
  limit?: number
}

export function ProductGrid({ type, limit }: ProductGridProps) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [totalCount, setTotalCount] = React.useState(0)
  const [categories, setCategories] = React.useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const pageSize = 12

  const { 
    buyCart, 
    donateCart, 
    addToBuyCart, 
    addToDonateCart, 
    removeFromBuyCart, 
    removeFromDonateCart,
    updateBuyCartQuantity,
    updateDonateCartQuantity
  } = useStore()

  const {
    products: fetchedProducts,
    totalCount: fetchedTotalCount,
    isLoading: productsLoading,
    error: productsError
  } = useProducts({
    type,
    status: 'active',
    category: selectedCategory || undefined,
    limit,
    page: currentPage,
    pageSize
  })

  // Update local state when products are fetched
  React.useEffect(() => {
    if (fetchedProducts) {
      setProducts(fetchedProducts)
      setTotalCount(fetchedTotalCount)
      
      // Only extract categories for buy products
      // For donate products, we use predefined categories
      if (type === 'buy') {
        const uniqueCategories = Array.from(
          new Set(fetchedProducts.map(product => product.category))
        ).sort()
        setCategories(uniqueCategories)
      }
    }
    setIsLoading(productsLoading)
  }, [fetchedProducts, fetchedTotalCount, productsLoading, type])
  
  const getCartItem = (product: Product) => {
    const cart = type === 'buy' ? buyCart : donateCart
    return cart.find(item => item.id === product.id)
  }

  const handleQuantityChange = (product: Product, delta: number) => {
    const cartItem = getCartItem(product)
    const currentQuantity = cartItem?.quantity || 0
    const newQuantity = Math.max(0, currentQuantity + delta)

    if (newQuantity === 0) {
      if (type === 'buy') {
        removeFromBuyCart(product.id)
      } else {
        removeFromDonateCart(product.id)
      }
    } else if (cartItem) {
      if (type === 'buy') {
        updateBuyCartQuantity(product.id, newQuantity)
      } else {
        updateDonateCartQuantity(product.id, newQuantity)
      }
    } else if (newQuantity > 0) {
      if (type === 'buy') {
        addToBuyCart(product)
      } else {
        addToDonateCart(product)
      }
    }
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-secondary-200" />
            <div className="p-4 space-y-4">
              <div className="h-4 bg-secondary-200 rounded w-3/4" />
              <div className="h-4 bg-secondary-200 rounded w-1/2" />
              <div className="h-8 bg-secondary-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load products. Please try again later.</p>
      </div>
    )
  }
  
  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        type={type}
      />
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-accent-muted text-lg">
            No products found{selectedCategory ? ` in ${selectedCategory}` : ''}.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const cartItem = getCartItem(product)
              const quantity = cartItem?.quantity || 0

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-w-4 aspect-h-3">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        type === 'buy' 
                          ? 'bg-primary-50 text-primary'
                          : 'bg-secondary-200 text-accent-soft'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                    
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold text-accent hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <p className="text-accent-muted text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {type === 'buy' && (
                        <span className="text-lg font-bold text-accent">
                          {/* {formatPrice(product.price)} */}
                        </span>
                      )}
                      <div className="flex items-center space-x-2">
                        {quantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(product, -1)}
                              className="p-1 rounded-full text-accent-muted hover:text-accent hover:bg-secondary-200 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-accent min-w-[20px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(product, 1)}
                              className="p-1 rounded-full text-accent-muted hover:text-accent hover:bg-secondary-200 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleQuantityChange(product, 1)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              type === 'buy'
                                ? 'bg-primary text-white hover:bg-primary-600'
                                : 'bg-secondary-400 text-accent hover:bg-secondary-500'
                            }`}
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {!limit && totalCount > pageSize && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <PaginationInfo
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalCount}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / pageSize)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}