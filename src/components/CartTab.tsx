import React from 'react';
import { CartItem } from '../types';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CartTabProps {
  cart: CartItem[];
  onUpdateQty: (productId: string, increment: boolean) => void;
  onRemoveItem: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onClearCart: () => void;
}

export const CartTab: React.FC<CartTabProps> = ({
  cart,
  onUpdateQty,
  onRemoveItem,
  onSelectProduct,
  onClearCart,
}) => {
  const formatPrice = (p: number) => {
    return p.toLocaleString() + ' TZS';
  };

  const getGrandTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  // WhatsApp Order formulation
  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let textBody = '';

    if (cart.length === 1) {
      // Literal exact spec format for single items
      const item = cart[0];
      textBody = `Hello SMETIK,

I want to order:

Product:
${item.product.brand} - ${item.product.name}

Quantity:
${item.quantity}

Price:
${formatPrice(item.product.price * item.quantity)}

Please assist with delivery and payment details.`;
    } else {
      // Aggregated format for multiple items in cart, clean and intuitive
      const itemsList = cart
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.product.brand} - ${item.product.name} (Qty: ${
              item.quantity
            }) - ${formatPrice(item.product.price * item.quantity)}`
        )
        .join('\n');

      textBody = `Hello SMETIK,

I want to order:

Products:
${itemsList}

Total Price:
${formatPrice(getGrandTotal())}

Please assist with delivery and payment details.`;
    }

    const encodedText = encodeURIComponent(textBody);
    const whatsappUrl = `https://wa.me/255714300535?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSupportWhatsApp = () => {
    const textBody = 'Hello SMETIK, I need assistance with searching and buying personal care products.';
    window.open(`https://wa.me/255714300535?text=${encodeURIComponent(textBody)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div id="cart-empty-view" className="flex flex-col items-center justify-center py-24 px-6 text-center h-full bg-white animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-secondary-surface flex items-center justify-center text-primary mb-4 p-4">
          <ShoppingBag size={24} />
        </div>
        <p className="text-xs text-gray-500 font-semibold max-w-xs leading-relaxed">
          Your cart is empty. Continue exploring beautiful products.
        </p>
      </div>
    );
  }

  return (
    <div id="cart-list-view" className="flex flex-col h-full bg-white">
      {/* Scrollable list area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-28">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </span>
          <button
            id="btn-cart-clear"
            onClick={onClearCart}
            className="text-[10px] font-semibold text-primary hover:text-dark-accent uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>

        {cart.map((item) => (
          <div
            key={item.product.id}
            id={`cart-item-${item.product.id}`}
            onClick={() => onSelectProduct(item.product.id)}
            className="flex gap-3 p-2 border border-gray-50 rounded-xl hover:border-gray-100 transition-colors cursor-pointer"
          >
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 object-cover rounded-lg bg-secondary-surface flex-shrink-0"
            />
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-[8px] font-bold tracking-widest uppercase text-primary">
                {item.product.brand}
              </span>
              <h4 className="text-xs font-semibold text-gray-800 truncate leading-snug">
                {item.product.name}
              </h4>
              <span className="text-[11px] font-bold text-dark-accent tracking-tight mt-1">
                {formatPrice(item.product.price)}
              </span>

              {/* Counter and Trash controls */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div
                  className="flex items-center border border-gray-100 rounded-md p-0.5 bg-gray-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onUpdateQty(item.product.id, false)}
                    className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500 rounded hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-[10px] font-bold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item.product.id, true)}
                    className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500 rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <button
                  id={`btn-cart-remove-item-${item.product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.product.id);
                  }}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-md bg-transparent hover:bg-red-50 transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart totals stick bottom area */}
      <div className="absolute bottom-16 inset-x-0 bg-white border-t border-gray-100 p-4 flex flex-col gap-3 z-40 filter drop-shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-500">Subtotal</span>
          <span className="font-semibold text-gray-800">{formatPrice(getGrandTotal())}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-500">Shipping Delivery</span>
          <span className="font-semibold text-emerald-600 uppercase tracking-widest text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded">
            To Be Arranged
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-xs font-bold text-gray-800">Total Price</span>
          <span className="text-sm font-extrabold text-primary tracking-tight">
            {formatPrice(getGrandTotal())}
          </span>
        </div>

        <button
          id="btn-cart-checkout"
          onClick={handleCheckoutWhatsApp}
          className="w-full h-10 mt-1 rounded-xl bg-primary hover:bg-dark-accent text-white flex items-center justify-center gap-2.5 font-bold text-xs uppercase tracking-widest transition-transform active:scale-98"
          style={{ backgroundColor: '#845EC2' }}
        >
          <WhatsAppIcon size={14} className="text-white fill-current" />
          Checkout via WhatsApp
        </button>
      </div>
    </div>
  );
};
