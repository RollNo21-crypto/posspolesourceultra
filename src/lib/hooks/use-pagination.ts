import { useState, useEffect } from 'react'

interface UsePaginationProps {
  totalItems: number
  pageSize?: number
  initialPage?: number
}

export function usePagination({ totalItems, pageSize = 10, initialPage = 1 }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const totalPages = Math.ceil(totalItems / pageSize)

  // Reset to first page if total items changes
  useEffect(() => {
    setCurrentPage(1)
  }, [totalItems])

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [currentPage, totalPages])

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  return {
    currentPage,
    totalPages,
    pageSize,
    goToPage,
    offset: (currentPage - 1) * pageSize
  }
}