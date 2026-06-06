import React from 'react';
import { Product } from '../types';
import { Heart, Plus, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onSelectProduct: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const formatPrice = (p: number) => {
    return p.toLocaleString() + ' TZS';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const absolute = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={10}
          className={`${
            i <= absolute ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
          }`}
        />
      );
    }
    return <div className="flex gap-0.5 items-center">{stars}</div>;
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={onSelectProduct}
      className="cursor-pointer group relative bg-white border border-gray-50 rounded-3xl overflow-hidden p-3 flex flex-col gap-2.5 transition-all duration-300 shadow-soft hover:shadow-md hover:border-gray-100"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-secondary-surface">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Wishlist Button Overlay */}
        <button
          id={`btn-wish-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 flex items-center justify-center text-gray-500 shadow-sm transition-transform duration-300 hover:scale-110 active:scale-95"
          aria-label="Toggle Wishlist"
        >
          <Heart
            size={16}
            className={`transition-colors duration-300 ${
              isWishlisted ? 'text-primary fill-primary' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Badge */}
        {(() => {
          if (product.newArrival) {
            return (
              <span className="absolute top-2 left-2 text-[8px] font-bold tracking-wider uppercase bg-[#F3C5FF] text-[#845EC2] py-0.5 px-2 rounded-full shadow-sm">
                New
              </span>
            );
          } else if (product.bestSeller || product.featured) {
            return (
              <span className="absolute top-2 left-2 text-[8px] font-bold tracking-wider uppercase bg-amber-50 text-amber-600 py-0.5 px-2 rounded-full shadow-sm">
                Hot
              </span>
            );
          }
          return null;
        })()}
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-1 gap-1">
        <span className="text-[9px] font-bold tracking-wide text-primary uppercase">
          {product.brand}
        </span>
        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors max-h-8">
          {product.name}
        </h4>

        {/* Pricing & Add to Cart row */}
        <div className="flex items-center justify-between gap-1 mt-auto pt-1.5 border-t border-gray-50">
          <span className="text-xs font-bold text-dark-accent tracking-tight">
            {formatPrice(product.price)}
          </span>

          <button
            id={`btn-add-to-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center transition-all duration-300 shadow-md shadow-primary/20 hover:bg-dark-accent active:scale-95"
            aria-label="Add to Cart"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
