import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Ruler } from 'lucide-react';
import { shopService } from '../services/shopService';
import useCartStore from '../store/cartStore';
import { formatCurrency } from '../utils/formatCurrency';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import ProductCard from '../components/shop/ProductCard';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    setLoading(true);
    shopService.getProduct(id)
      .then(({ data }) => {
        setProduct(data.data.product);
        setRelated(data.data.related || []);
        setSelectedSize(data.data.product.sizes?.[0]?.size || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><Spinner className="py-20" /></div>;
  if (!product) return <div className="pt-20 text-center py-20 text-gray-500">Product not found.</div>;

  const price = product.onSale && product.salePrice ? product.salePrice : product.price;

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-green text-sm transition-colors"><ArrowLeft size={16} /> Back to Shop</Link>
      </div>

      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <ImageWithFallback src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" fallbackText={product.name} />
            <div className="absolute top-3 left-3 flex gap-1">
              {product.isNew && <Badge>New</Badge>}
              {product.onSale && <Badge variant="gold">Sale</Badge>}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
            <h1 className="text-3xl lg:text-4xl font-display text-white">{product.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              {product.onSale && product.salePrice ? (
                <><span className="text-3xl font-display text-green">{formatCurrency(product.salePrice)}</span><span className="text-gray-600 line-through text-lg">{formatCurrency(product.price)}</span></>
              ) : (
                <span className="text-3xl font-display text-green">{formatCurrency(product.price)}</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">{product.description}</p>

            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Size: <span className="text-white font-medium">{selectedSize}</span></span>
                  <button onClick={() => setSizeGuideOpen(true)} className="text-xs text-green flex items-center gap-1 hover:underline"><Ruler size={12} /> Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button key={s.size} onClick={() => setSelectedSize(s.size)} disabled={s.stock === 0}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${selectedSize === s.size ? 'border-green bg-green/10 text-green' : s.stock === 0 ? 'border-white/5 text-gray-600 cursor-not-allowed' : 'border-white/10 text-gray-300 hover:border-green/50'}`}
                    >{s.size} {s.stock === 0 && '(Sold Out)'}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center bg-card rounded-lg border border-white/10">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-400 hover:text-white">-</button>
                <span className="px-4 py-2 text-white text-sm min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-400 hover:text-white">+</button>
              </div>
              <Button size="lg" onClick={() => { addItem(product, selectedSize, quantity); toast.success('Added to cart!'); openDrawer(); }} className="flex-1">
                <ShoppingBag size={18} className="mr-2" /> Add to Cart
              </Button>
              <button className="p-3 text-gray-400 hover:text-green border border-white/10 rounded-lg hover:border-green/30 transition-all"><Heart size={20} /></button>
            </div>
          </div>
        </div>
      </motion.section>

      {related.length > 0 && (
        <section className="py-12 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-display text-white mb-6">You Might <span className="text-green">Also Like</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (<ProductCard key={p._id} product={p} />))}
            </div>
          </div>
        </section>
      )}

      <Modal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} title="Size Guide">
        <table className="w-full text-sm">
          <thead><tr className="text-gray-400 border-b border-white/5"><th className="p-2 text-left">Size</th><th className="p-2">Chest (cm)</th><th className="p-2">Waist (cm)</th><th className="p-2">Length (cm)</th></tr></thead>
          <tbody>
            {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => (
              <tr key={s} className="border-b border-white/5"><td className="p-2 text-white font-medium">{s}</td><td className="p-2 text-center text-gray-400">{80 + ['XS','S','M','L','XL','2XL','3XL'].indexOf(s) * 5}</td><td className="p-2 text-center text-gray-400">{65 + ['XS','S','M','L','XL','2XL','3XL'].indexOf(s) * 4}</td><td className="p-2 text-center text-gray-400">{60 + ['XS','S','M','L','XL','2XL','3XL'].indexOf(s) * 3}</td></tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
