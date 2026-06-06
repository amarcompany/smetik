import React from 'react';
import { Product } from '../types';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface WishlistTabProps {
  wishlist: Product[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const WishlistTab: React.FC<WishlistTabProps> = ({
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const formatPrice = (p: number) => {
    return p.toLocaleString() + ' TZS';
  };

  const handleSupportWhatsApp = () => {
    const textBody = 'Hello SMETIK, I am looking for personalized beauty assistance or general recommendations.';
    window.open(`https://wa.me/255714300535?text=${encodeURIComponent(textBody)}`, '_blank');
  };

  if (wishlist.length === 0) {
    return (
      <div id="wishlist-empty-view" className="flex flex-col items-center justify-center py-24 px-6 text-center h-full bg-white animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-secondary-surface flex items-center justify-center text-primary mb-4 p-4">
          <Heart size={24} />
        </div>
        <p className="text-xs text-gray-500 font-semibold max-w-xs leading-relaxed">
          Your wishlist is empty. Discover items you'll love.
        </p>
      </div>
    );
  }

  return (
    <div id="wishlist-list-view" className="p-4 flex flex-col gap-4 pb-20 h-full overflow-y-auto">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        Wishlisted Items ({wishlist.length})
      </span>

      <div className="grid grid-cols-2 gap-3 pb-8">
        {wishlist.map((product) => (
          <div
            key={product.id}
            id={`wishlist-item-${product.id}`}
            onClick={() => onSelectProduct(product.id)}
            className="group relative bg-white border border-gray-50 rounded-3xl overflow-hidden p-3 flex flex-col gap-2.5 cursor-pointer transition-all duration-300 shadow-soft hover:shadow-md hover:border-gray-100"
          >
            {/* Image Box */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary-surface">
              <img
                src={product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <button
                id={`btn-wishlist-toggle-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center text-primary shadow-sm"
                title="Remove from favorites"
              >
                <Heart size={14} className="fill-current text-primary" />
              </button>
            </div>

            {/* Content text */}
            <div className="flex flex-col gap-0.5 flex-1 justify-between">
              <div>
                <span className="text-[8px] font-bold tracking-wider text-primary uppercase leading-none">
                  {product.brand}
                </span>
                <h4 className="text-[11px] font-semibold text-gray-800 line-clamp-1 leading-snug mt-0.5">
                  {product.name}
                </h4>
                <div className="text-[11px] font-bold text-dark-accent tracking-tight mt-1">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-1.5 mt-2 pt-1 border-t border-gray-50">
                <button
                  id={`btn-wishlist-cart-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product.id);
                  }}
                  className="flex-1 h-7 rounded-xl bg-primary hover:bg-dark-accent text-white flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors shadow-sm shadow-primary/15"
                >
                  <ShoppingBag size={11} />
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
