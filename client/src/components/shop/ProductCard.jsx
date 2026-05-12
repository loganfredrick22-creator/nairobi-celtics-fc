import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatCurrency';
import ImageWithFallback from '../ui/ImageWithFallback';
import Badge from '../ui/Badge';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.size || '');
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, selectedSize, 1);
    toast.success(`${product.name} added to cart`);
    openDrawer();
  };

  const price = product.onSale && product.salePrice ? product.salePrice : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Link to={`/shop/${product._id}`} className="block group">
        <div className="bg-card rounded-xl overflow-hidden border border-white/5 card-hover">
          <div className="aspect-square relative overflow-hidden">
            <ImageWithFallback src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackText={product.name} />
            <div className="absolute top-2 left-2 flex gap-1">
              {product.isNew && <Badge variant="default">New</Badge>}
              {product.onSale && <Badge variant="gold">Sale</Badge>}
            </div>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
            <h3 className="font-body font-semibold text-sm text-white mt-0.5 line-clamp-1 group-hover:text-green transition-colors">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {product.onSale && product.salePrice ? (
                <>
                  <span className="text-green font-display text-lg">{formatCurrency(product.salePrice)}</span>
                  <span className="text-gray-600 line-through text-sm">{formatCurrency(product.price)}</span>
                </>
              ) : (
                <span className="text-green font-display text-lg">{formatCurrency(product.price)}</span>
              )}
            </div>
            {product.sizes?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2" onClick={(e) => e.preventDefault()}>
                {product.sizes.filter((s) => s.stock > 0).slice(0, 5).map((s) => (
                  <button key={s.size}
                    onClick={(e) => { e.preventDefault(); setSelectedSize(s.size); }}
                    className={`px-2 py-0.5 text-[10px] rounded border transition-all ${selectedSize === s.size ? 'border-green bg-green/10 text-green' : 'border-white/10 text-gray-400 hover:border-green/50'}`}
                  >{s.size}</button>
                ))}
              </div>
            )}
            <button onClick={handleAdd}
              className="mt-3 w-full py-2 bg-green text-black text-xs font-semibold rounded-lg hover:bg-green/90 transition-colors flex items-center justify-center gap-1.5"
            ><ShoppingBag size={14} /> Add to Cart</button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
