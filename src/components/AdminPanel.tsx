import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../data';
import { LayoutDashboard, ShoppingBag, Plus, Edit, Trash2, X, PlusCircle, Bookmark, DollarSign, Calendar, Eye, Settings } from 'lucide-react';
import { ShimmerAdmin } from './Shimmer';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onClose: () => void;
  onShowNotification: (msg: string) => void;
}

type AdminView = 'dashboard' | 'products' | 'orders' | 'promotions' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onClose,
  onShowNotification,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminView>('dashboard');
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setIsAdminLoading(true);
    const timer = setTimeout(() => {
      setIsAdminLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeAdminTab]);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formUsage, setFormUsage] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Start creating new product
  const handleStartAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory(CATEGORIES[0]);
    setFormPrice('25000');
    setFormDescription('A premium dermatologically tested beauty formula suitable for all skin types.');
    setFormIngredients('Organic extracts, pure distilled water, niacinamide, vitamins.');
    setFormUsage('Apply evenly after washing skin. Massage until absorbed.');
    setFormStock('20');
    setFormImageUrl('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600');
    setShowProductForm(true);
  };

  // Start editing existing product
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormBrand(product.brand);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormDescription(product.description);
    setFormIngredients(product.ingredients);
    setFormUsage(product.usage);
    setFormStock(product.stock.toString());
    setFormImageUrl(product.images[0] || '');
    setShowProductForm(true);
  };

  // Handle Form Submission (Create or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formBrand.trim() || !formPrice) {
      onShowNotification('Please fill in Name, Brand, and Price inputs.');
      return;
    }

    const priceNum = parseFloat(formPrice);
    const stockNum = parseInt(formStock) || 10;

    if (editingProduct) {
      // Edit mode
      const updated: Product = {
        ...editingProduct,
        name: formName.trim(),
        brand: formBrand.trim(),
        category: formCategory,
        price: priceNum,
        description: formDescription.trim(),
        ingredients: formIngredients.trim(),
        usage: formUsage.trim(),
        stock: stockNum,
        images: [formImageUrl.trim() || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
      };
      onUpdateProduct(updated);
      onShowNotification('Product updated configuration successfully.');
    } else {
      // Add mode
      const created: Product = {
        id: 'prod_' + Date.now(),
        name: formName.trim(),
        brand: formBrand.trim(),
        category: formCategory,
        price: priceNum,
        rating: 4.5,
        description: formDescription.trim(),
        ingredients: formIngredients.trim(),
        usage: formUsage.trim(),
        stock: stockNum,
        images: [formImageUrl.trim() || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        featured: false,
        newArrival: true,
      };
      onAddProduct(created);
      onShowNotification('New product added to inventory database.');
    }

    setShowProductForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you certain you want to delete this product item?')) {
      onDeleteProduct(id);
      onShowNotification('Product removed from catalog.');
    }
  };

  return (
    <div id="admin-panel-overlay" className="absolute inset-0 bg-white z-50 flex flex-col font-sans animate-fade-in h-full">
      {/* Admin Panel Header */}
      <div className="sticky top-0 bg-primary text-white p-4 flex items-center justify-between shadow z-40">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold tracking-widest text-[#F3C5FF] uppercase leading-none">Console Area</span>
          <h2 className="text-base font-bold tracking-tight">SMETIK Admin Panel</h2>
        </div>
        <button
          id="btn-admin-close"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          title="Exit Admin Area"
        >
          <X size={15} />
        </button>
      </div>

      {/* Admin Sub Navigation bar tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto bg-[#FAF9FF] scrollbar-none px-2 z-10">
        {[
          { tab: 'dashboard', label: 'Stats', icon: LayoutDashboard },
          { tab: 'products', label: 'Products', icon: ShoppingBag },
          { tab: 'orders', label: 'Orders (Mock)', icon: DollarSign },
          { tab: 'promotions', label: 'Promos', icon: Calendar },
          { tab: 'settings', label: 'Settings', icon: Settings },
        ].map((t) => {
          const IconComp = t.icon;
          return (
            <button
              key={t.tab}
              onClick={() => setActiveAdminTab(t.tab as AdminView)}
              className={`py-3 px-3.5 border-b-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeAdminTab === t.tab
                  ? 'border-primary text-primary bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <IconComp size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Admin Central body panel */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-24">
        {isAdminLoading ? (
          <ShimmerAdmin />
        ) : (
          <>
            {/* VIEW 1: STATS DASHBOARD */}
            {activeAdminTab === 'dashboard' && (
          <div id="admin-view-dashboard" className="flex flex-col gap-4 animate-fade-in pl-1 pl-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Store Dashboard Summary</h3>
            
            {/* Stats grid cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-100 p-3 bg-secondary-surface rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Estimated Value</span>
                <span className="text-sm font-extrabold text-primary tracking-tight mt-1">
                  1,840,000 TZS
                </span>
              </div>
              <div className="border border-gray-100 p-3 bg-secondary-surface rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Active Catalog</span>
                <span className="text-sm font-extrabold text-gray-800 mt-1">
                  {products.length} Items
                </span>
              </div>
              <div className="border border-gray-100 p-3 bg-secondary-surface rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Total Categories</span>
                <span className="text-sm font-extrabold text-gray-800 mt-1">
                  {CATEGORIES.length} Ranges
                </span>
              </div>
              <div className="border border-gray-100 p-3 bg-secondary-surface rounded-xl flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Simulated Sales</span>
                <span className="text-sm font-extrabold text-primary mt-1">
                  48 orders
                </span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="mt-4 border border-gray-100 p-4 rounded-xl flex flex-col gap-2 bg-white">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Actions</span>
              <button
                id="btn-admin-quick-add"
                onClick={handleStartAdd}
                className="w-full py-2.5 bg-primary hover:bg-dark-accent text-white font-bold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <PlusCircle size={14} />
                Create New product listing
              </button>
            </div>
            
            <div className="border border-gray-50 p-3 text-[10px] text-gray-400 leading-normal rounded-xl">
              SMETIK Beauty database is stored inside the local client memory. Any customized edits, new creations, or product removals will be preserved during this browser preview session.
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT LIST CATALOGUE */}
        {activeAdminTab === 'products' && (
          <div id="admin-view-products" className="flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Listing Core ({products.length} items)
              </span>
              <button
                id="btn-admin-add-product"
                onClick={handleStartAdd}
                className="py-1 px-3 bg-primary hover:bg-dark-accent text-white text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1"
              >
                <Plus size={12} />
                New
              </button>
            </div>

            {/* Micro product card matrix list */}
            <div className="flex flex-col gap-2.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-3 p-2.5 border border-gray-100 rounded-xl items-center"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded bg-secondary-surface flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-[8px] font-bold tracking-wider uppercase text-primary leading-none">
                      {p.brand} ({p.category})
                    </span>
                    <h4 className="text-xs font-semibold text-gray-800 truncate mt-1">
                      {p.name}
                    </h4>
                    <span className="text-[10px] font-bold text-dark-accent tracking-wider mt-0.5">
                      {p.price.toLocaleString()} TZS / Stock: {p.stock}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      id={`btn-admin-edit-${p.id}`}
                      onClick={() => handleStartEdit(p)}
                      className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                      title="Edit Item"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      id={`btn-admin-del-${p.id}`}
                      onClick={() => handleDelete(p.id)}
                      className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: INCOMING ORDERS LIST (MOCK ONLY) */}
        {activeAdminTab === 'orders' && (
          <div id="admin-view-orders" className="flex flex-col gap-3 animate-fade-in">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Orders Queues Log (Simulated)</span>
            
            <div className="flex flex-col gap-2.5">
              {[
                { orderNo: 'SMK-2309', user: 'Fatma Juma', val: 73000, items: 'Glow Serum x1, Velvet Lipstick x1', stat: 'Completed' },
                { orderNo: 'SMK-2310', user: 'Sada Ally', val: 110000, items: 'Ambre Nuit EDP x1', stat: 'Awaiting WhatsApp' },
                { orderNo: 'SMK-2311', user: 'Lilian Raymond', val: 38000, items: 'Centella Body Lotion x1', stat: 'Awaiting Help' }
              ].map((or) => (
                <div key={or.orderNo} className="p-3 border border-gray-100 rounded-xl flex flex-col gap-1.5 bg-[#FAF9FF]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-800 font-mono">{or.orderNo}</span>
                    <span className={`text-[8px] font-bold tracking-wider uppercase py-0.5 px-1.5 rounded-full ${
                      or.stat === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {or.stat}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <div>Customer: <strong className="text-gray-800">{or.user}</strong></div>
                    <div className="text-[11px] mt-0.5 truncate italic text-gray-400">Items: {or.items}</div>
                  </div>
                  <div className="text-[11px] font-bold text-primary border-t border-gray-50 pt-1.5 mt-0.5 flex justify-between">
                    <span>Value: {or.val.toLocaleString()} TZS</span>
                    <span className="text-[9px] hover:underline cursor-pointer block">Trace Whatsapp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: PROMOTIONS */}
        {activeAdminTab === 'promotions' && (
          <div id="admin-view-promotions" className="flex flex-col gap-3 animate-fade-in">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Promotional Banner Cards</span>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Banner 1: Glow Serum', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400' },
                { name: 'Banner 2: Lipsticks Set', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400' },
                { name: 'Banner 3: Hair conditioning', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400' }
              ].map((b, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden relative h-20 bg-gray-50 flex items-center justify-between p-3">
                  <div className="z-10 flex flex-col">
                    <span className="text-[10px] text-primary font-bold">Slider Card {i + 1}</span>
                    <span className="text-xs font-semibold text-gray-800 white-space-nowrap">{b.name}</span>
                  </div>
                  <img src={b.img} referrerPolicy="no-referrer" alt="" className="absolute right-0 top-0 bottom-0 min-w-32 object-cover opacity-60" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: CONFIG CONFIGURATION */}
        {activeAdminTab === 'settings' && (
          <div id="admin-view-settings" className="flex flex-col gap-4 animate-fade-in leading-relaxed">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 font-sans">Settings Configuration</span>
            
            <div className="border border-gray-50 rounded-xl divide-y divide-gray-50 overflow-hidden bg-white">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-700">Support Dial Phone</div>
                  <div className="text-[10px] text-gray-400">0714300535</div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-700">Default Currency Settings</div>
                  <div className="text-[10px] text-gray-400">TZS (Tanzanian Shilling)</div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between box-border">
                <div>
                  <div className="text-xs font-bold text-gray-700">Database Engine</div>
                  <div className="text-[10px] text-gray-400">Local Stateful Browser Cache (Volatile Mock-Db)</div>
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* FORM OVERLAY SHEET (ADD or EDIT PROD) */}
      {showProductForm && (
        <div id="admin-form-popup" className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-h-[90%] overflow-y-auto flex flex-col p-4 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">
                {editingProduct ? 'Edit Beauty Product' : 'Add New Beauty Product'}
              </h3>
              <button
                type="button"
                id="btn-admin-form-close"
                onClick={() => setShowProductForm(false)}
                className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="flex flex-col gap-3 pb-8 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Skin Soothing Dew Serum"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-600">Brand Creator</label>
                  <input
                    type="text"
                    placeholder="e.g. Smetik Organics"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary font-medium"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-600">Category Selection</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="p-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-primary font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-600">Price (in TZS)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary font-medium"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-gray-600">Stock Count</label>
                  <input
                    type="number"
                    placeholder="e.g. 25"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">Primary Product Image URL</label>
                <input
                  type="url"
                  placeholder="Paste Image web url..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary text-[11px] font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain therapeutic details and beauty outcomes..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary text-[11px] font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">Aesthetic Ingredients (Beauty-spec)</label>
                <textarea
                  rows={1}
                  placeholder="Separate keys with commas..."
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary text-[11px] font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">Usage Instructions</label>
                <textarea
                  rows={1}
                  placeholder="How should beauty shoppers apply this formula..."
                  value={formUsage}
                  onChange={(e) => setFormUsage(e.target.value)}
                  className="p-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-primary text-[11px] font-medium"
                />
              </div>

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 font-bold uppercase tracking-wider text-gray-500"
                >
                  Cancel
                </button>
                <button
                  id="btn-admin-form-submit"
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-dark-accent text-white rounded-xl font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
