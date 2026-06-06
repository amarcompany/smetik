import React, { useState, useEffect } from 'react';
import { Product, CartItem, ActiveTab } from './types';
import { INITIAL_PRODUCTS } from './data';
// @ts-ignore
import avatarPlaceholder from './assets/images/smetik_avatar_placeholder_1780694939503.png';
import { BannerSlider } from './components/BannerSlider';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { CartTab } from './components/CartTab';
import { WishlistTab } from './components/WishlistTab';
import { CategoriesTab } from './components/CategoriesTab';
import { ProfileTab } from './components/ProfileTab';
import { AdminPanel } from './components/AdminPanel';
import { ShimmerCard, ShimmerCategoriesPage, ShimmerProductDetails, ShimmerCartPage } from './components/Shimmer';
import { FlutterExporter } from './components/FlutterExporter';
import { SmetikAssistant } from './components/SmetikAssistant';
import { SmetikSparkLogo } from './components/SmetikSparkLogo';
import { Search, ShoppingBag, Heart, Compass, Grid, User, Wifi, Battery, AlertTriangle, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);
  const [prevTabBeforeDetail, setPrevTabBeforeDetail] = useState<ActiveTab>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('12:00 PM');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Custom temporary HUD notification state
  const [notification, setNotification] = useState<string | null>(null);

  // Live active clock for the phone mockup status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Soft skeleton loader simulation when app boots or switches view
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeTab, focusedProduct]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // State Updates: Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      
      const isNowLiked = updated.includes(productId);
      showNotification(isNowLiked ? 'Added to your Wishlist!' : 'Removed from your Wishlist.');
      return updated;
    });
  };

  // State Updates: Add to Cart
  const handleAddToCart = (productId: string, quantity = 1) => {
    const pMatched = products.find((p) => p.id === productId);
    if (!pMatched) return;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === productId);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { product: pMatched, quantity }];
      }
    });
  };

  // State Updates: Update Quantity in Cart
  const handleUpdateCartQty = (productId: string, increment: boolean) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === productId);
      if (existingIdx === -1) return prev;

      const updated = [...prev];
      const targetItem = updated[existingIdx];
      const newQty = increment ? targetItem.quantity + 1 : targetItem.quantity - 1;

      if (newQty <= 0) {
        // Remove item from cart list
        showNotification('Item removed from cart.');
        return updated.filter((item) => item.product.id !== productId);
      } else if (newQty > targetItem.product.stock) {
        showNotification(`Only ${targetItem.product.stock} units available in stock.`);
        return prev;
      } else {
        updated[existingIdx] = { ...targetItem, quantity: newQty };
        return updated;
      }
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('Item removed from cart completely.');
  };

  // Admin database controls
  const handleAdminAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleAdminUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    // If updating currently viewed details
    if (focusedProduct?.id === updatedProd.id) {
      setFocusedProduct(updatedProd);
    }
  };

  const handleAdminDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((i) => i.product.id !== id));
    setWishlistIds((prev) => prev.filter((wid) => wid !== id));
    if (focusedProduct?.id === id) {
      setFocusedProduct(null);
    }
  };

  // Product details navigation callbacks
  const handleTriggerProductDetails = (product: Product) => {
    setPrevTabBeforeDetail(activeTab);
    setFocusedProduct(product);
  };

  // Triggers detail page from product ID directly (e.g. cart items or wishlist items)
  const handleTriggerProductDetailsById = (id: string) => {
    const fProd = products.find((p) => p.id === id);
    if (fProd) {
      handleTriggerProductDetails(fProd);
    }
  };

  // Formulate filtered lists for Explore screen
  const getFilteredProducts = () => {
    let result = products;
    if (searchQuery.trim()) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  };

  const filteredItems = getFilteredProducts();
  const featuredProducts = filteredItems.filter((p) => p.featured);
  const newArrivals = filteredItems.filter((p) => p.newArrival);
  const bestSellers = filteredItems.filter((p) => p.bestSeller);

  const getWishlistedProducts = () => {
    return products.filter((p) => wishlistIds.includes(p.id));
  };

  return (
    <div id="developer-workspace" className="min-h-screen bg-[#0d0d0f] flex items-center justify-center font-sans select-none overflow-hidden p-4 md:p-6">
      
      {/* Smart Phone Device Bezels Mockup perfectly centered */}
      <div className="relative w-[345px] h-[710px] bg-[#1a1b22] rounded-[42px] border-[10px] border-[#2f303a] shadow-[0_32px_64px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ring-4 ring-[#1f2026]/95">
            
            {/* Top Speaker grill & Camera pill notch */}
            <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1b22] rounded-b-2xl z-50 flex items-center justify-center p-1">
              {/* Speaker slit */}
              <div className="w-10 h-0.75 bg-slate-700 rounded-full mb-1" />
              {/* Front facing camera glass lens */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#0d0e12] border border-blue-950/40 ml-2" />
            </div>

            {/* Smart Phone Top Status Bar (Wifi, Carrier network, battery percentage, dynamic Clock) */}
            <div className="bg-white h-9 pt-3 px-6 flex items-center justify-between text-gray-600 font-sans text-[10px] font-bold tracking-tight select-none z-50 relative">
              <span className="text-[10px] tabular-nums">{currentTime}</span>
              <div className="flex items-center gap-1 pl-4">
                <span>SMETIK Net</span>
                <Wifi size={11} className="text-gray-600" />
                <span className="-ml-0.5">5G</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] tabular-nums">94%</span>
                <div className="w-5 h-2.5 border border-gray-400 rounded-sm p-0.5 flex items-center">
                  <div className="bg-gray-600 h-full w-4/5 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Smetik Application Shell Workspace inside screen viewport */}
            <div id="app-frame-body" className="flex-1 bg-white relative overflow-hidden flex flex-col h-full">
              
              {/* Branded Fixed Global Header - Consistent across all screens */}
              <div className="flex items-center justify-between p-4 pb-2.5 border-b border-gray-100 bg-white select-none shrink-0 z-30 font-sans">
                <div className="flex items-center gap-1.5">
                  {focusedProduct && (
                    <button 
                      onClick={() => setFocusedProduct(null)}
                      className="p-1 rounded-full hover:bg-gray-100 active:scale-90 transition-transform cursor-pointer mr-0.5"
                      title="Back to Catalog"
                    >
                      <ArrowLeft size={16} className="text-gray-800" />
                    </button>
                  )}
                  {!focusedProduct && (
                    <span className="font-brand text-xl text-black font-normal tracking-wide">Smetik</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* AI Sparkles Assistant Trigger Button */}
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3C5FF]/30 hover:bg-[#F3C5FF]/50 border border-[#845EC2]/10 active:scale-95 transition-transform text-[9px] font-extrabold uppercase tracking-widest text-[#845EC2] cursor-pointer"
                    title="Smetik AI Assistant"
                  >
                    <SmetikSparkLogo size={13} className="animate-spin-slow" />
                    <span>AI Assistant</span>
                  </button>

                  {/* Reused Circular Avatar Image */}
                  <button 
                    onClick={() => {
                      setFocusedProduct(null);
                      setActiveTab('profile');
                    }}
                    className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-primary/20 flex items-center justify-center cursor-pointer active:scale-95 transition-transform bg-[#F3C5FF]/20"
                    title="View Profile"
                  >
                    <img 
                      src={avatarPlaceholder} 
                      alt="User Profile" 
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                </div>
              </div>

              {/* Dynamic scrollable screen content area */}
              <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full bg-white text-gray-800">
                {focusedProduct ? (
                  isLoading ? (
                    <ShimmerProductDetails />
                  ) : (
                    <ProductDetails
                      product={focusedProduct}
                      allProducts={products}
                      isWishlisted={wishlistIds.includes(focusedProduct.id)}
                      onToggleWishlist={() => handleToggleWishlist(focusedProduct.id)}
                      onAddToCart={(qty) => handleAddToCart(focusedProduct.id, qty)}
                      onBack={() => setFocusedProduct(null)}
                      onSelectProduct={(p) => setFocusedProduct(p)}
                      onShowNotification={showNotification}
                    />
                  )
                ) : (
                  <>
                  
                  {/* TAB 1: EXPLORE VIEW */}
                  {activeTab === 'explore' && (
                    <div id="tab-pane-explore" className="flex flex-col gap-4 p-4 pb-20 overflow-y-auto animate-fade-in h-full">
                      {/* Search & Promo Banners continue below regular header */}
                      {/* Custom Search bar */}
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search skincare, makeup..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#FAF9FF] text-xs py-2.5 pl-9 pr-4 rounded-xl border border-gray-150 focus:outline-none focus:border-primary text-gray-700 font-sans font-medium"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Sliding Promo Banner Cards */}
                      <BannerSlider isLoading={isLoading} />

                      {/* Dynamic Lists based on search */}
                      {isLoading ? (
                        <div className="flex flex-col gap-5 pb-8 mt-2">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center py-1">
                              <div className="h-4 w-1/2 rounded-full animate-shimmer bg-gray-100" />
                              <div className="h-3.5 w-12 rounded-full animate-shimmer bg-gray-100" />
                            </div>
                            <div className="flex gap-3 overflow-hidden pb-1.5">
                              <div className="w-36 flex-shrink-0 bg-white border border-gray-50 rounded-3xl p-3 flex flex-col gap-2.5 shadow-soft">
                                <div className="w-full aspect-[4/5] rounded-2xl animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/3 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3.5 w-4/5 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/2 rounded-full animate-shimmer bg-gray-100 mt-auto" />
                              </div>
                              <div className="w-36 flex-shrink-0 bg-white border border-gray-50 rounded-3xl p-3 flex flex-col gap-2.5 shadow-soft">
                                <div className="w-full aspect-[4/5] rounded-2xl animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/3 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3.5 w-4/5 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/2 rounded-full animate-shimmer bg-gray-100 mt-auto" />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center py-1">
                              <div className="h-4 w-1/2 rounded-full animate-shimmer bg-gray-100" />
                              <div className="h-3.5 w-12 rounded-full animate-shimmer bg-gray-100" />
                            </div>
                            <div className="flex gap-3 overflow-hidden pb-1.5">
                              <div className="w-36 flex-shrink-0 bg-white border border-gray-50 rounded-3xl p-3 flex flex-col gap-2.5 shadow-soft">
                                <div className="w-full aspect-[4/5] rounded-2xl animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/3 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3.5 w-4/5 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/2 rounded-full animate-shimmer bg-gray-100 mt-auto" />
                              </div>
                              <div className="w-36 flex-shrink-0 bg-white border border-gray-50 rounded-3xl p-3 flex flex-col gap-2.5 shadow-soft">
                                <div className="w-full aspect-[4/5] rounded-2xl animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/3 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3.5 w-4/5 rounded-full animate-shimmer bg-gray-100" />
                                <div className="h-3 w-1/2 rounded-full animate-shimmer bg-gray-100 mt-auto" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Search outcome count */}
                          {searchQuery && (
                            <div className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider pl-1">
                              Search results ({filteredItems.length} found)
                            </div>
                          )}

                          {/* Filtered grid or Empty State */}
                          {filteredItems.length === 0 ? (
                            <div className="text-center py-10">
                              <p className="text-xs text-gray-400 font-medium bg-[#FAF9FF] py-2 px-3 rounded-full inline-block">
                                No products found matching query
                              </p>
                            </div>
                          ) : searchQuery ? (
                            <div className="grid grid-cols-2 gap-3 pb-6">
                              {filteredItems.map((p) => (
                                <ProductCard
                                  key={p.id}
                                  product={p}
                                  isWishlisted={wishlistIds.includes(p.id)}
                                  onToggleWishlist={() => handleToggleWishlist(p.id)}
                                  onAddToCart={() => {
                                    handleAddToCart(p.id);
                                    showNotification('Added to Cart!');
                                  }}
                                  onSelectProduct={() => handleTriggerProductDetails(p)}
                                />
                              ))}
                            </div>
                          ) : (
                            /* DEFAULT HOME LISTS WITH CAROUSELS */
                            <div className="flex flex-col gap-5 pb-8">
                              {/* Group A: Featured Ranges */}
                              {featuredProducts.length > 0 && (
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-gray-800 tracking-wide pl-1">Featured Hot Products</h4>
                                    <span className="text-[10px] font-semibold text-primary">See All</span>
                                  </div>
                                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5 pl-0.5">
                                    {featuredProducts.map((p) => (
                                      <div key={p.id} className="w-36 flex-shrink-0">
                                        <ProductCard
                                          product={p}
                                          isWishlisted={wishlistIds.includes(p.id)}
                                          onToggleWishlist={() => handleToggleWishlist(p.id)}
                                          onAddToCart={() => {
                                            handleAddToCart(p.id);
                                            showNotification('Added to Cart!');
                                          }}
                                          onSelectProduct={() => handleTriggerProductDetails(p)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Group B: New Arrivals */}
                              {newArrivals.length > 0 && (
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-gray-800 tracking-wide pl-1">New Arrivals</h4>
                                    <span className="text-[10px] font-semibold text-primary">See All</span>
                                  </div>
                                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5 pl-0.5">
                                    {newArrivals.map((p) => (
                                      <div key={p.id} className="w-36 flex-shrink-0">
                                        <ProductCard
                                          product={p}
                                          isWishlisted={wishlistIds.includes(p.id)}
                                          onToggleWishlist={() => handleToggleWishlist(p.id)}
                                          onAddToCart={() => {
                                            handleAddToCart(p.id);
                                            showNotification('Added to Cart!');
                                          }}
                                          onSelectProduct={() => handleTriggerProductDetails(p)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Group C: Best Sellers */}
                              {bestSellers.length > 0 && (
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-gray-800 tracking-wide pl-1">Best Sellers</h4>
                                    <span className="text-[10px] font-semibold text-primary">See All</span>
                                  </div>
                                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5 pl-0.5">
                                    {bestSellers.map((p) => (
                                      <div key={p.id} className="w-36 flex-shrink-0">
                                        <ProductCard
                                          product={p}
                                          isWishlisted={wishlistIds.includes(p.id)}
                                          onToggleWishlist={() => handleToggleWishlist(p.id)}
                                          onAddToCart={() => {
                                            handleAddToCart(p.id);
                                            showNotification('Added to Cart!');
                                          }}
                                          onSelectProduct={() => handleTriggerProductDetails(p)}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                   {/* TAB 2: CATEGORIES CATALOG */}
                  {activeTab === 'categories' && (
                    <div id="tab-pane-categories" className="flex-1 pb-16 h-full overflow-hidden animate-fade-in">
                      {isLoading ? (
                        <ShimmerCategoriesPage />
                      ) : (
                        <CategoriesTab
                          products={products}
                          wishlistIds={wishlistIds}
                          onToggleWishlist={handleToggleWishlist}
                          onAddToCart={(pid) => {
                            handleAddToCart(pid);
                            showNotification('Added to Cart!');
                          }}
                          onSelectProduct={handleTriggerProductDetails}
                        />
                      )}
                    </div>
                  )}

                  {/* TAB 3: SHOPPING CART */}
                  {activeTab === 'cart' && (
                    <div id="tab-pane-cart" className="flex-1 pb-16 h-full overflow-hidden animate-fade-in">
                      {isLoading ? (
                        <ShimmerCartPage />
                      ) : (
                        <CartTab
                          cart={cart}
                          onUpdateQty={handleUpdateCartQty}
                          onRemoveItem={handleRemoveFromCart}
                          onSelectProduct={handleTriggerProductDetailsById}
                          onClearCart={() => {
                            setCart([]);
                            showNotification('Cart emptied completely.');
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* TAB 4: WISHLIST SAVED */}
                  {activeTab === 'wishlist' && (
                    <div id="tab-pane-wishlist" className="flex-1 pb-16 h-full overflow-hidden animate-fade-in">
                      {isLoading ? (
                        <div className="p-4 flex flex-col gap-4 pb-20 h-full overflow-y-auto">
                          <div className="h-4 w-1/3 rounded bg-gray-150 animate-shimmer" />
                          <div className="grid grid-cols-2 gap-3 pb-8">
                            <ShimmerCard />
                            <ShimmerCard />
                            <ShimmerCard />
                            <ShimmerCard />
                          </div>
                        </div>
                      ) : (
                        <WishlistTab
                          wishlist={getWishlistedProducts()}
                          onToggleWishlist={handleToggleWishlist}
                          onAddToCart={(pid) => {
                            handleAddToCart(pid);
                            showNotification('Added to Cart!');
                          }}
                          onSelectProduct={handleTriggerProductDetailsById}
                        />
                      )}
                    </div>
                  )}

                  {/* TAB 5: PROFILE SETTINGS */}
                  {activeTab === 'profile' && (
                    <div id="tab-pane-profile" className="flex-1 pb-16 h-full overflow-hidden animate-fade-in">
                      {isLoading ? (
                        <div className="p-4 flex flex-col gap-6 h-full bg-white animate-fade-in">
                          <div className="flex flex-col items-center text-center gap-3 py-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 animate-shimmer" />
                            <div className="h-4 w-28 rounded bg-gray-100 animate-shimmer" />
                            <div className="h-3 w-40 rounded bg-gray-100 animate-shimmer mt-0.5" />
                          </div>
                          <div className="flex flex-col gap-3">
                            <div className="h-3 w-1/4 rounded bg-gray-150 animate-shimmer mb-1" />
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex items-center justify-between p-3 border border-gray-50 rounded-2xl bg-white shadow-soft">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-gray-100 animate-shimmer" />
                                  <div className="h-3.5 w-32 rounded bg-gray-100 animate-shimmer" />
                                </div>
                                <div className="w-4 h-4 rounded bg-gray-100 animate-shimmer" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <ProfileTab
                          onOpenAdmin={() => setIsAdminOpen(true)}
                          onShowNotification={showNotification}
                        />
                      )}
                    </div>
                  )}

                  </>
                )}
              </div>

              {/* Admin Panel Overlay stacked over the entire cellular phone frame if unlocked */}
              {isAdminOpen && (
                <AdminPanel
                  products={products}
                  onAddProduct={handleAdminAddProduct}
                  onUpdateProduct={handleAdminUpdateProduct}
                  onDeleteProduct={handleAdminDeleteProduct}
                  onClose={() => setIsAdminOpen(false)}
                  onShowNotification={showNotification}
                />
              )}

              {/* Smetik Assistant Modal overlay */}
              {isChatOpen && (
                <SmetikAssistant
                  onClose={() => setIsChatOpen(false)}
                  onSelectProductById={handleTriggerProductDetailsById}
                  allProducts={products}
                  currentScreen={focusedProduct ? "Product Details" : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
                  currentProduct={focusedProduct}
                />
              )}

              {/* FLOATING ACTION HUD TOAST NOTIFICATION POPUP */}
              {notification && (
                <div id="toast-hud-popup" className="absolute bottom-20 left-4 right-4 bg-gray-900/95 text-white py-2 px-3 rounded-xl flex items-center gap-2 shadow-lg z-50 text-[10px] uppercase font-bold tracking-wider animate-slide-up border border-gray-800">
                  <CheckCircle size={13} className="text-primary" />
                  <span>{notification}</span>
                </div>
              )}
               {/* Cellular Bottom Navigation Bar */}
              {!focusedProduct && (
                <nav className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-primary/20 flex items-center justify-around z-40">
                  {[
                    { tab: 'explore', label: 'Explore', icon: Compass },
                    { tab: 'categories', label: 'Categories', icon: Grid },
                    { tab: 'cart', label: 'Cart', icon: ShoppingBag, count: cart.reduce((sum, item) => sum + item.quantity, 0) },
                    { tab: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistIds.length },
                    { tab: 'profile', label: 'Profile', icon: User },
                  ].map((btn) => {
                    const IconComp = btn.icon;
                    const isActive = activeTab === btn.tab;
                    return (
                      <button
                        key={btn.tab}
                        id={`nav-btn-${btn.tab}`}
                        onClick={() => {
                          setFocusedProduct(null);
                          setActiveTab(btn.tab as ActiveTab);
                        }}
                        className={`flex flex-col items-center justify-center w-14 h-full relative transition-colors ${
                          isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <div className="relative">
                          <IconComp size={18} className={isActive ? 'scale-105' : ''} />
                          {btn.count && btn.count > 0 ? (
                            <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center scale-95 border border-white">
                              {btn.count}
                            </span>
                          ) : null}
                        </div>
                        <span className="text-[9px] font-semibold mt-1 leading-none">
                          {btn.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              )}

            </div>
          </div>
        </div>
      );
    }
