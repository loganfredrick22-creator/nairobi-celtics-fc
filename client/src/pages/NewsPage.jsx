import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, AlertCircle } from 'lucide-react';
import { newsService } from '../services/newsService';
import { timeAgo } from '../utils/formatDate';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const categories = ['All', 'Match Report', 'Transfer News', 'Club News', 'Academy', 'Community'];

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const category = searchParams.get('category') || 'All';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = { page, limit: 12 };
    if (category !== 'All') params.category = category;
    newsService.getNews(params)
      .then(({ data }) => {
        setArticles(data.data.articles || []);
        setPagination(data.pagination);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load news'))
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div className="pt-20">
      <section className="py-12 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-5xl font-display text-white mb-2">
            News <span className="text-green">Hub</span>
          </motion.h1>
          <p className="text-gray-400 font-body text-sm">Stay updated with everything Nairobi Celtics FC.</p>
        </div>
      </section>

      <section className="py-8 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all ${category === cat ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
              >{cat}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <Spinner className="py-20" /> : error ? (
            <div className="flex flex-col items-center py-20 text-center">
              <AlertCircle size={48} className="text-red-400 mb-4" />
              <p className="text-red-400 text-sm">{error}</p>
              <Button variant="ghost" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Newspaper size={48} className="text-gray-600 mb-4" />
              <p className="text-gray-500">No articles found.</p>
              <p className="text-gray-600 text-sm mt-1">Try a different category.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, i) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/news/${article.slug}`} className="block group h-full">
                      <div className="bg-card rounded-xl overflow-hidden h-full border border-white/5 card-hover">
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <ImageWithFallback src={article.thumbnail} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute top-2 left-2"><Badge>{article.category}</Badge></div>
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-gray-500 mb-2">{timeAgo(article.publishedAt)}</p>
                          <h3 className="font-body font-semibold text-white line-clamp-2 group-hover:text-green transition-colors">{article.title}</h3>
                          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{article.excerpt}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">{article.author}</span>
                            <span className="text-xs text-green group-hover:underline">Read More →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setSearchParams({ ...(category !== 'All' && { category }), page: p })}
                      className={`w-10 h-10 rounded-lg text-sm font-body transition-colors ${page === p ? 'bg-green text-black font-semibold' : 'bg-card text-gray-400 hover:text-white'}`}
                    >{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
