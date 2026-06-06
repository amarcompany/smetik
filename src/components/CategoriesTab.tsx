import React, { useState } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../data';
import { ProductCard } from './ProductCard';
import { LayoutGrid, Check, SlidersHorizontal } from 'lucide-react';

interface CategoriesTabProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

const CATEGORY_META: Record<string, { desc: string }> = {
  All: { desc: 'Our complete premium collection of skincare, makeup, and hair care formulations.' },
  Skincare: { desc: 'Dermatologist-tested face serums, moisturisers, and botanical cleansers.' },
  Makeup: { desc: 'Satin velvet lipsticks, translucent blur powders, and flawless blushes.' },
  'Hair Care': { desc: 'Premium deep restructurant keratin masks and nourish scalp therapy.' },
  Fragrances: { desc: 'Sensual luxury eau de parfum featuring patchouli, rose, and amber.' },
  'Body Care': { desc: 'Exfoliating Kakadu plum Vitamin C scrubs and soothing lotions.' },
  'Personal Care': { desc: 'Everyday hygiene essentials with hydrating amino acids.' },
};

const ALL_BRANDS = ['Smetik Organics', 'Smetik Beauty', 'Smetik Botanicals', 'Smetik Fragrance'];

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Collapsed on mobile by default to fit clean card grid, but user can toggle
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(120000);

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const categoriesWithAll = ['All', ...CATEGORIES];

  const getFilteredProducts = () => {
    let list = products;

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Brand
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // Filter by Price
    list = list.filter((p) => p.price <= priceMax);

    return list;
  };

  const categoryProducts = getFilteredProducts();

  return (
    <div id="catalog-redesigned-view" className="flex flex-col h-full bg-white animate-fade-in">
      {/* Sub-header navigation with Filter toggle */}
      <div className="bg-white/95 backdrop-blur-md px-3.5 py-3 border-b border-gray-100 flex items-center justify-between z-30">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
            Smetik Range
          </span>
          <h3 className="text-sm font-extrabold text-gray-900 tracking-tight mt-1 flex items-center gap-1">
            <LayoutGrid size={13} className="text-primary" />
            {selectedCategory === 'All' ? 'All Formulations' : selectedCategory}
          </h3>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
            isSidebarOpen 
              ? 'bg-primary text-white shadow-md shadow-primary/10' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={{ backgroundColor: isSidebarOpen ? '#845EC2' : '' }}
        >
          <SlidersHorizontal size={10} />
          Filters {isSidebarOpen ? 'Active' : 'Show'}
        </button>
      </div>

      {/* Master body container with dynamic layout width */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* COMPACT FILTER SIDEBAR: Collapsible on mobile/inside phone frame */}
        <aside
          className={`bg-[#FAFAFC] h-full border-r border-gray-100 flex flex-col transition-all duration-350 ease-in-out z-20 ${
            isSidebarOpen 
              ? 'w-[125px] opacity-100 p-3' 
              : 'w-0 opacity-0 p-0 overflow-hidden'
          } overflow-y-auto no-scrollbar flex-shrink-0`}
        >
          <div className="flex flex-col gap-5">
            {/* 1. Category Switch List */}
            <div>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Categories
              </span>
              <div className="flex flex-col gap-1">
                {categoriesWithAll.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-[10px] py-1.5 px-2 rounded-lg transition-all truncate font-semibold ${
                      cat === selectedCategory
                        ? 'bg-[#F3C5FF]/30 text-primary font-bold'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Price filter (mock UI only as requested, but reactive to state is even cleaner!) */}
            <div className="border-t border-gray-100 pt-3">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                Max Price
              </span>
              <span className="text-[9px] font-bold text-primary font-mono block mb-1">
                {priceMax >= 120000 ? 'Any' : `${priceMax.toLocaleString()} TZS`}
              </span>
              <input
                type="range"
                min="20000"
                max="120000"
                step="10000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-primary h-1 bg-gray-200 rounded-lg cursor-pointer font-sans"
              />
            </div>

            {/* 3. Brand filter as checklist */}
            <div className="border-t border-gray-100 pt-3 mb-6">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Brands
              </span>
              <div className="flex flex-col gap-2">
                {ALL_BRANDS.map((brand_name) => {
                  const isChecked = selectedBrands.includes(brand_name);
                  return (
                    <button
                      key={brand_name}
                      onClick={() => handleToggleBrand(brand_name)}
                      className="flex items-start gap-1.5 text-left text-gray-600 transition-colors group cursor-pointer"
                    >
                      <div className={`w-3.5 h-3.5 rounded bg-white border flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                        isChecked 
                          ? 'bg-primary border-primary text-white' 
                          : 'border-gray-250 group-hover:border-primary/50 bg-white'
                      }`}
                      style={{ backgroundColor: isChecked ? '#845EC2' : '#ffffff', borderColor: isChecked ? '#845EC2' : '' }}>
                        {isChecked && <Check size={8} strokeWidth={4} />}
                      </div>
                      <span className={`text-[9px] font-semibold leading-tight truncate ${
                        isChecked ? 'text-primary font-bold' : 'text-gray-500'
                      }`}>
                        {brand_name.replace('Smetik ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT GRID AREA: Premium and minimalist luxury fashion catalog look */}
        <div className="flex-1 overflow-y-auto p-3 bg-white flex flex-col h-full">
          {/* Active category explanation header card */}
          <div className="mb-4 bg-gray-55 p-3 rounded-2xl border border-gray-100/60">
            <p className="text-[10px] text-gray-500 leading-normal font-medium first-letter:uppercase">
              {CATEGORY_META[selectedCategory]?.desc || 'Browse our curated selection of high-performance beauty essentials.'}
            </p>
          </div>

          {categoryProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 bg-[#FAFAFC] rounded-2xl p-4 border border-dashed border-gray-200">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                No items match filter
              </span>
              <p className="text-[9px] text-gray-450 mt-1 max-w-[150px] text-center">
                Try lifting maximum price boundaries or clearing brand filters.
              </p>
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setPriceMax(120000);
                  setSelectedCategory('All');
                }}
                className="mt-4 py-1.5 px-3 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm"
                style={{ backgroundColor: '#845EC2' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-24">
              {categoryProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlistIds.includes(p.id)}
                  onToggleWishlist={() => onToggleWishlist(p.id)}
                  onAddToCart={() => onAddToCart(p.id)}
                  onSelectProduct={() => onSelectProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
