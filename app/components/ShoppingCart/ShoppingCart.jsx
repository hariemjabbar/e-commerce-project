import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ChevronRight, Trash2 } from 'lucide-react';
import './ShoppingCart.css';
import { useRouter } from 'next/navigation';

const Warenkorb = ({ cartItems, setCartItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const query = new URLSearchParams({ items: JSON.stringify(cartItems) }).toString();
    router.push(`/checkout?${query}`);
  };

  const handleRemoveItem = (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCartItems);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(true)} className="cart-button">
        <ShoppingCart className="icon" />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="cart-modal"
          >
            <div className="cart-header">
              <h2 className="cart-title">Warenkorb ({totalItems})</h2>
              <button onClick={() => setIsOpen(false)} className="close-button">
                <X className="icon" />
              </button>
            </div>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <img src={item.imageUrl} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-quantity">Menge: {item.quantity}</p>
                  </div>
                  <p className="item-price">{(item.price * item.quantity).toFixed(2)} €</p>
                  <button onClick={() => handleRemoveItem(index)} className="remove-button">
                    <Trash2 className="icon" />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Gesamtsumme:</span>
                <span className="summary-total">{totalPrice.toFixed(2)} €</span>
              </div>
              <button onClick={handleCheckout} className="checkout-button">
                Zur Kasse
                <ChevronRight className="icon" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Warenkorb;
