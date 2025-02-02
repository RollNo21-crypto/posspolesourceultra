import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: string;
  title?: string;
  name?: string;
  email?: string;
  status: string;
  created_at: string;
}

export function SearchBar() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchItems = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Search products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, title, status, created_at')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(3);

      if (productsError) throw productsError;

      // Search sellers
      const { data: sellers, error: sellersError } = await supabase
        .from('sellers')
        .select('id, company_name, email, status, created_at')
        .or(`company_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(3);

      if (sellersError) throw sellersError;

      // Search requests
      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('id, user_name, user_email, type, status, created_at')
        .or(`user_name.ilike.%${searchQuery}%,user_email.ilike.%${searchQuery}%`)
        .limit(3);

      if (requestsError) throw requestsError;

      const formattedResults = [
        ...products.map(p => ({
          id: p.id,
          type: 'product',
          title: p.title,
          status: p.status,
          created_at: p.created_at
        })),
        ...sellers.map(s => ({
          id: s.id,
          type: 'seller',
          name: s.company_name,
          email: s.email,
          status: s.status,
          created_at: s.created_at
        })),
        ...requests.map(r => ({
          id: r.id,
          type: r.type === 'buy' ? 'buy-request' : 'donate-request',
          name: r.user_name,
          email: r.user_email,
          status: r.status,
          created_at: r.created_at
        }))
      ];

      setResults(formattedResults);
      setIsOpen(formattedResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchItems(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchItems]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'product':
        navigate('/admin/products');
        break;
      case 'seller':
        navigate('/admin/sellers');
        break;
      case 'buy-request':
        navigate('/admin/buy-requests');
        break;
      case 'donate-request':
        navigate('/admin/donate-requests');
        break;
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, sellers, requests..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {result.title || result.name || result.id}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    result.status === 'active' && 'bg-green-100 text-green-800',
                    result.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                    result.status === 'inactive' && 'bg-gray-100 text-gray-800'
                  )}>
                    {result.status}
                  </span>
                </div>
                {result.email && (
                  <p className="text-sm text-gray-500">{result.email}</p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(result.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-gray-500 capitalize ml-4">
                {result.type.replace('-', ' ')}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}