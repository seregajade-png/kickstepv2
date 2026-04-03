import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, X } from 'lucide-react'
import { api } from '../lib/api'
import { mapApiProduct } from '../lib/mappers'
import ProductCard from '../components/ProductCard'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const queryFromUrl = searchParams.get('q') || ''
  const [query, setQuery] = useState(queryFromUrl)
  const [results, setResults] = useState<ReturnType<typeof mapApiProduct>[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (query.length < 2) { setResults([]); setTotal(0); return }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.search(query)
        setResults((data.products || []).map(mapApiProduct))
        setTotal(data.total || 0)
      } catch { setResults([]); setTotal(0) }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <>
      <Helmet><title>Поиск — KICKSTEP</title></Helmet>
      <div className="px-4 max-w-[1440px] mx-auto pt-4 pb-8">
        {/* Search input */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск..."
            autoFocus
            className="w-full pl-11 pr-10 py-3 rounded-[24px] border border-gray-300 text-base outline-none focus:border-black transition"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <p className="text-center text-gray-600 py-8">Ничего не найдено по запросу «{query}»</p>
        )}

        {results.length > 0 && (
          <>
            <p className="text-sm text-gray-400 mb-3">Найдено {total} товаров</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
