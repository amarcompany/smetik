import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, ShoppingBag, Share2 } from 'lucide-react';
import { ShimmerProductDetails } from './Shimmer';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductDetailsProps {
  product: Product;
  allProducts: Product[];
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: (qty?: number) => void;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onShowNotification: (msg: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  allProducts,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBack,
  onSelectProduct,
  onShowNotification,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setIsLocalLoading(true);
    setActiveImageIdx(0);
    setQuantity(1);
    
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
    }, 450);

    const appFrameBg = document.getElementById('app-frame-body');
    if (appFrameBg) {
      appFrameBg.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return () => clearTimeout(timer);
  }, [product]);

  if (isLocalLoading) {
    return <ShimmerProductDetails />;
  }

  const formatPrice = (p: number) => {
    return p.toLocaleString() + ' TZS';
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIdx((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % product.images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNextImage();
    } else if (diff < -50) {
      handlePrevImage();
    }
    setTouchStartX(null);
  };

  const totalCost = product.price * quantity;

  const handleOrderWhatsApp = () => {
    const formattedMessage = `Hello SMETIK,

I want to order:

Product:
${product.brand} - ${product.name}

Quantity:
${quantity}

Price:
${formatPrice(totalCost)}

Please assist with delivery and payment details.`;

    const encodedText = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/255714300535?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div id="product-details-screen" className="pb-28 bg-white min-h-full animate-fade-in relative">
      {/* Swipeable Image Swiper Display */}
      <div 
        className="relative w-full aspect-[4/5] bg-secondary-surface overflow-hidden group select-none cursor-grab"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Floating Share Link on top-right of image swiper */}
        <button
          id="btn-details-share"
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              onShowNotification('Product link copied to clipboard!');
            }
          }}
          className="absolute right-3.5 top-3.5 w-8 h-8 rounded-full bg-white/95 shadow-md backdrop-blur-sm flex items-center justify-center text-gray-550 hover:bg-white hover:text-primary active:scale-95 transition-all cursor-pointer z-35"
          aria-label="Share Link"
        >
          <Share2 size={13} />
        </button>

        <img
          src={product.images[activeImageIdx]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {product.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white active:scale-90 transition-all cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white active:scale-90 transition-all cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {/* Indicators dot bar */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1 bg-black/10 rounded-full backdrop-blur-sm">
            {product.images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-350 ${
                  activeImageIdx === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="p-4 flex flex-col gap-6">
        {/* Brand & Name Card */}
        <div className="flex flex-col gap-1 pr-1.5 border-b border-[#F3C5FF]/40 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {product.brand}
          </span>
          <h2 className="text-lg font-bold text-gray-900 leading-snug tracking-tight">
            {product.name}
          </h2>
          
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="text-base font-extrabold text-[#613E9E] tracking-tight">
              {formatPrice(product.price)}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded-full">
              In Stock ({product.stock})
            </span>
          </div>
        </div>

        {/* Quantity Select tool */}
        <div className="flex items-center justify-between border-b border-[#F3C5FF]/40 pb-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Select Quantity</span>
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold bg-white text-gray-600 rounded-md shadow-sm active:scale-90 hover:bg-gray-100 transition-all cursor-pointer"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-bold text-gray-800">{quantity}</span>
            <button
              onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold bg-white text-gray-600 rounded-md shadow-sm active:scale-90 hover:bg-gray-100 transition-all cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Core Product Information Scrolling Sections */}
        <div className="flex flex-col gap-5 text-xs text-gray-600 leading-relaxed">
          {/* Section 1: Description */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Description</h4>
            <p className="text-gray-700 leading-relaxed font-sans">{product.description}</p>
          </div>

          {/* Section 2: Ingredients */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Key Ingredients</h4>
            <p className="text-gray-500 italic leading-relaxed">{product.ingredients}</p>
          </div>

          {/* Section 3: Usage instructions */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Usage Instructions</h4>
            <p className="text-gray-700 font-medium leading-relaxed">{product.usage}</p>
          </div>
        </div>

        {/* Section 4: Related Beauty Products */}
        {relatedProducts.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-[#F3C5FF]/40">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Related Products</h4>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="min-w-[125px] w-32 flex flex-col gap-1.5 p-2 bg-white border border-gray-50 shadow-soft rounded-2xl cursor-pointer hover:border-gray-100 transition-all active:scale-98"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="aspect-square object-cover rounded-xl w-full bg-gray-50"
                  />
                  <div className="flex flex-col">
                    <span className="text-[7.5px] uppercase text-primary font-bold tracking-widest leading-none">
                      {p.brand.replace('Smetik ', '')}
                    </span>
                    <span className="text-[9.5px] text-gray-800 font-bold line-clamp-1 py-0.5 leading-tight">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#613E9E] tracking-tight mt-0.5">
                      {p.price.toLocaleString()} TZS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom Action Bar */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-white border-t border-[#F3C5FF]/50 px-4 flex items-center gap-2.5 z-40 filter drop-shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        {/* Wishlist toggle with Micro Interaction */}
        <button
          id="btn-details-wishlist-sticky"
          onClick={() => {
            setIsHeartAnimating(true);
            onToggleWishlist();
            setTimeout(() => setIsHeartAnimating(false), 450);
          }}
          className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
          title="Save to Wishlist"
        >
          <Heart
            className={`transition-all duration-300 ${
              isWishlisted ? 'fill-primary text-primary' : 'text-gray-400'
            } ${isHeartAnimating ? 'scale-125' : 'hover:scale-[1.06] active:scale-95'}`}
            size={18}
          />
        </button>

        {/* Add to Cart with feedback */}
        <button
          id="btn-details-cart-sticky"
          onClick={() => {
            onAddToCart(quantity);
            onShowNotification(`${quantity} formulation(s) added to cart!`);
          }}
          className="w-11 h-11 flex items-center justify-center rounded-2xl bg-[#F3C5FF]/30 text-primary hover:bg-[#F3C5FF]/45 active:scale-90 transition-all cursor-pointer"
          title="Add to Cart"
        >
          <ShoppingBag size={18} />
        </button>

        {/* WhatsApp Checkout core button: Phone: 0714300535 */}
        <button
          id="btn-details-whatsapp-sticky"
          onClick={handleOrderWhatsApp}
          className="flex-1 h-11 rounded-2xl bg-primary hover:bg-dark-accent text-white flex items-center justify-center gap-2.5 font-bold text-[11px] uppercase tracking-widest shadow-md shadow-primary/10 active:scale-[0.98] transition-all cursor-pointer"
          style={{ backgroundColor: '#845EC2' }}
        >
          <WhatsAppIcon size={14} className="text-white fill-current" />
          Order WhatsApp
        </button>
      </div>
    </div>
  );
};
