import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Calendar, Clock, User } from 'lucide-react';
import { newsService } from '../services/newsService';
import { formatDateLong } from '../utils/formatDate';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function NewsArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    newsService.getArticle(slug)
      .then(({ data }) => {
        setArticle(data.data.article);
        setRelated(data.data.related || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) return <div className="pt-20"><Spinner className="py-20" /></div>;
  if (!article) return <div className="pt-20 text-center py-20 text-gray-500">Article not found.</div>;

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-gray-400 hover:text-green text-sm transition-colors mb-6">
          <ArrowLeft size={16} /> Back to News
        </Link>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <Badge className="mb-3">{article.category}</Badge>
          <h1 className="text-3xl lg:text-5xl font-display text-white leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><User size={14} />{article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} />{formatDateLong(article.publishedAt)}</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-8">
          <ImageWithFallback src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-lg text-gray-300 leading-relaxed mb-6">{article.excerpt}</p>
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-300 leading-relaxed mb-4">{paragraph}</p>
          ))}
        </div>

        <div className="flex items-center gap-4 py-6 border-t border-white/5 mb-12">
          <button onClick={handleShare} className="flex items-center gap-2 text-sm text-gray-400 hover:text-green transition-colors">
            <Share2 size={16} /> Share Article
          </button>
        </div>
      </motion.article>

      {related.length > 0 && (
        <section className="py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display text-white mb-6">Related <span className="text-green">Articles</span></h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r._id} to={`/news/${r.slug}`} className="block group">
                  <div className="bg-card rounded-xl overflow-hidden border border-white/5 card-hover">
                    <div className="aspect-[16/10] overflow-hidden">
                      <ImageWithFallback src={r.thumbnail} alt={r.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <Badge>{r.category}</Badge>
                      <h3 className="text-sm font-body font-semibold text-white mt-2 line-clamp-2 group-hover:text-green transition-colors">{r.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
