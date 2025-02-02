import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Gift, Store } from 'lucide-react'
import { cn } from '@/lib/utils'

const cards = [
  {
    title: 'Buy',
    description: 'Browse and request quotes for products',
    icon: ShoppingBag,
    to: '/buy',
  },
  {
    title: 'Sell',
    description: 'Register as a seller and list your products',
    icon: Store,
    to: '/sell',
  },
  {
    title: 'Donate',
    description: 'Give back to the community',
    icon: Gift,
    to: '/donate',
  },
]

export function ActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-12 max-w-7xl mx-auto">
      {cards.map((card) => (
        <Link
          key={card.title}
          to={card.to}
          className={cn(
            'relative group overflow-hidden rounded-lg p-8',
            'bg-[rgba(0,0,0,0.7)] hover:bg-primary transition-colors duration-300',
            'transform hover:scale-105 transition-transform duration-300'
          )}
        >
          <card.icon className="h-12 w-12 text-white mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
          <p className="text-white/90">{card.description}</p>
        </Link>
      ))}
    </div>
  )
}