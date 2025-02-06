// import React from 'react'
// import { cn } from '@/lib/utils'

// interface CategoryFilterProps {
//   categories: string[]
//   selectedCategory: string | null
//   onSelectCategory: (category: string | null) => void
// }

// export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
//   return (
//     <div className="mb-8">
//       <h2 className="text-lg font-semibold text-accent mb-4">Categories</h2>
//       <div className="flex flex-wrap gap-2">
//         <button
//           onClick={() => onSelectCategory(null)}
//           className={cn(
//             'px-4 py-2 rounded-full text-sm font-medium transition-colors',
//             selectedCategory === null
//               ? 'bg-primary text-white'
//               : 'bg-secondary-200 text-accent-soft hover:bg-secondary-300'
//           )}
//         >
//           All
//         </button>
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => onSelectCategory(category)}
//             className={cn(
//               'px-4 py-2 rounded-full text-sm font-medium transition-colors',
//               selectedCategory === category
//                 ? 'bg-primary text-white'
//                 : 'bg-secondary-200 text-accent-soft hover:bg-secondary-300'
//             )}
//           >
//             {category}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// import React from 'react'
// import { cn } from '@/lib/utils'

// const DONATE_CATEGORIES = [
//   'Analytical Instruments',
//   'Balances and Measuring Equipment',
//   'Centrifuges and Spinning Equipment',
//   'Electrochemistry and Blood Analyzer',
//   'Fermentation and Cell Culture',
//   'General Laboratory Equipment',
//   'Laboratory Incubators',
//   'Liquid Handling and Processing',
//   'Medical and Clinical Devices',
//   'Mixing and Shaking Equipment',
//   'Molecular Biology Equipment',
//   'Refrigeration and Cooling System',
//   'Specialized Systems',
//   'Sterilization Equipment',
//   'Tissue Processing and Histology'
// ];

// interface CategoryFilterProps {
//   categories: string[]
//   selectedCategory: string | null
//   onSelectCategory: (category: string | null) => void
//   type?: 'buy' | 'donate'
// }

// export function CategoryFilter({ categories, selectedCategory, onSelectCategory, type }: CategoryFilterProps) {
//   // If it's the donate section, use predefined categories
//   const displayCategories = type === 'donate' ? DONATE_CATEGORIES : categories;

//   return (
//     <div className="mb-8">
//       <h2 className="text-lg font-semibold text-accent mb-4">Categories</h2>
//       <div className="flex flex-wrap gap-2">
//         <button
//           onClick={() => onSelectCategory(null)}
//           className={cn(
//             'px-4 py-2 rounded-full text-sm font-medium transition-colors',
//             selectedCategory === null
//               ? 'bg-primary text-white'
//               : 'bg-secondary-200 text-accent-soft hover:bg-secondary-300'
//           )}
//         >
//           All
//         </button>
//         {displayCategories.map((category) => (
//           <button
//             key={category}
//             onClick={() => onSelectCategory(category)}
//             className={cn(
//               'px-4 py-2 rounded-full text-sm font-medium transition-colors',
//               selectedCategory === category
//                 ? 'bg-primary text-white'
//                 : 'bg-secondary-200 text-accent-soft hover:bg-secondary-300'
//             )}
//           >
//             {category}
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

import React from 'react'
import { cn } from '@/lib/utils'

const DONATE_CATEGORIES = [
  'Analytical Instruments',
  'Balances and Measuring Equipment',
  'Centrifuges and Spinning Equipment',
  'Electrochemistry and Blood Analyzer',
  'Fermentation and Cell Culture',
  'General Laboratory Equipment',
  'Laboratory Incubators',
  'Liquid Handling and Processing',
  'Medical and Clinical Devices',
  'Mixing and Shaking Equipment',
  'Molecular Biology Equipment',
  'Refrigeration and Cooling System',
  'Specialized Systems',
  'Sterilization Equipment',
  'Tissue Processing and Histology'
];

const BUY_CATEGORIES = [
  'Hygiene',
  'Miscellaneous',
  'Research and Development',
  'Packaging',
  'Pharmaceuticals'
];

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  type?: 'buy' | 'donate'
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory, type }: CategoryFilterProps) {
  // Use predefined categories based on type
  const displayCategories = type === 'donate' 
    ? DONATE_CATEGORIES 
    : type === 'buy' 
      ? BUY_CATEGORIES 
      : categories;

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
        {displayCategories.map((category) => (
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