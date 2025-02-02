import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  // Show max 5 page numbers, with ellipsis if needed
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages
    
    if (currentPage <= 3) return [...pages.slice(0, 5), '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', ...pages.slice(totalPages - 5)]
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ]
  }

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed text-accent-soft"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {getVisiblePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-accent-muted">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                'px-3 py-2 rounded-md font-medium transition-colors',
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'text-accent-soft hover:bg-secondary-200'
              )}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed text-accent-soft"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

interface PaginationInfoProps {
  currentPage: number
  pageSize: number
  totalItems: number
  className?: string
}

export function PaginationInfo({ currentPage, pageSize, totalItems, className }: PaginationInfoProps) {
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)
  
  return (
    <div className={cn('text-sm text-accent-muted', className)}>
      Showing {start} to {end} of {totalItems} results
    </div>
  )
}