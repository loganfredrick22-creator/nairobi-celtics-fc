import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { newsService } from '../../services/newsService';
import { timeAgo } from '../../utils/formatDate';
import ImageWithFallback from '../ui/ImageWithFallback';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';

export default function NewsGrid() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService.getNews({ limit: 6 })
      .then(({ data }) => setArticles(data.data.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-12"><Spinner /></div>;
  if (!articles.length) return null;

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <section className="py-16 lg:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl lg:text-4xl font-display text-white">Latest <span className="text-green">News</span></h2>
          <Link to="/news" className="text-green text-sm font-body flex items-center gap-1 hover:underline">View All <ArrowRight size={14} /></Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          >
            <Link to={`/news/${featured.slug}`} className="block group">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
                <ImageWithFallback src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge variant="default" className="mb-2">{featured.category}</Badge>
                  <h3 className="text-xl lg:text-2xl font-display text-white leading-tight">{featured.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{featured.excerpt}</p>
                  <span className="text-xs text-gray-500 mt-2 block">{timeAgo(featured.publishedAt)}</span>
                </div>
              </div>
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {rest.map((article, i) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/news/${article.slug}`} className="block group h-full">
                  <div className="bg-card rounded-xl overflow-hidden h-full border border-white/5 card-hover">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <ImageWithFallback src={article.thumbnail} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div className="absolute top-2 left-2"><Badge>{article.category}</Badge></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-body font-semibold text-sm text-white line-clamp-2 group-hover:text-green transition-colors">{article.title}</h3>
                      <span className="text-xs text-gray-500 mt-2 block">{timeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
