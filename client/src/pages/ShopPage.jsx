import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { shopService } from '../services/shopService';
import ProductCard from '../components/shop/ProductCard';
import Spinner from '../components/ui/Spinner';

const categories = ['All', 'kit', 'training', 'accessory', 'premium'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'featured';

  useEffect(() => {
    setLoading(true);
    const params = { sort, limit: 20 };
    if (category !== 'All') params.category = category;
    if (searchTerm) params.search = searchTerm;
    shopService.getProducts(params)
      .then(({ data }) => setProducts(data.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, sort, searchTerm]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'All' || !value) params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white mb-2">
            Official <span className="text-green">Shop</span>
          </motion.h1>
          <p className="text-gray-400 text-sm">Gear up like the Green Machine.</p>
        </div>
      </section>

      <section className="py-6 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => updateParams('category', c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-body capitalize transition-all ${category === c ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
                >{c}</button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="pl-8 py-1.5 text-sm w-40" />
              </div>
              <select value={sort} onChange={(e) => updateParams('sort', e.target.value)} className="py-1.5 text-sm">
                {sortOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <Spinner className="py-20" /> : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((p) => (<ProductCard key={p._id} product={p} />))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
