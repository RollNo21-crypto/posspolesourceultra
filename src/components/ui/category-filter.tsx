import React from 'react'
import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-accent mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-secondary-200 text-accent-soft hover:bg-secondary-300'
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-secondary-200 text-accent-soft hover:bg-secondary-300'
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}