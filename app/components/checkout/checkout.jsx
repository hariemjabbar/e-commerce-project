"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement } from "@stripe/react-stripe-js";
import "./checkout.css"; // Importiere die kombinierte CSS-Datei

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function StripeCheckoutForm({ cartItems }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (event, stripe, elements) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe wurde nicht geladen.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Kreditkarteninformationen konnten nicht geladen werden.");
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const { id: sessionId, error: backendError } = await response.json();

      if (backendError) {
        setError(backendError);
        setIsProcessing(false);
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        setError(stripeError.message || "Ein Fehler ist aufgetreten.");
        setIsProcessing(false);
      } else {
        toast.success("Bestellung erfolgreich! Vielen Dank für Ihren Einkauf!");
        router.push("/bestellung-erfolgreich");
      }
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      setIsProcessing(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      {({ stripe, elements }) => (
        <form onSubmit={(e) => handleSubmit(e, stripe, elements)} className="form-section">
          <div className="grid-two-columns">
            <div className="form-group">
              <label className="label" htmlFor="firstName">Vorname</label>
              <input className="input" id="firstName" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="lastName">Nachname</label>
              <input className="input" id="lastName" required />
            </div>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="email">E-Mail</label>
            <input className="input" id="email" type="email" required />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="address">Adresse</label>
            <input className="input" id="address" required />
          </div>
          <div className="grid-two-columns">
            <div className="form-group">
              <label className="label" htmlFor="zip">PLZ</label>
              <input className="input" id="zip" required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="city">Stadt</label>
              <input className="input" id="city" required />
            </div>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="country">Land</label>
            <input className="input" id="country" required />
          </div>
          <div className="form-group card-element-wrapper">
            <label className="label" htmlFor="card-element">Kreditkarte</label>
            <div>
              <CardElement id="card-element" />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="button" type="submit" disabled={isProcessing}>
            {isProcessing ? "Wird bearbeitet..." : `Jetzt kaufen (${totalPrice.toFixed(2)} €)`}
          </button>
        </form>
      )}
    </Elements>
  );
}

export default function Checkout() {
  const searchParams = useSearchParams();
  const itemsQuery = searchParams.get("items");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (itemsQuery) {
      const items = JSON.parse(itemsQuery);
      setCartItems(items);
      console.log("Cart Items:", items); // Debugging-Log
    }
  }, [itemsQuery]);

  // Berechne die Gesamtsumme hier
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container">
      <h1 className="title">Zur Kasse</h1>
      <div className="grid-two-columns">
        <div>
          <h2 className="subtitle">Rechnungsadresse & Zahlung</h2>
          <StripeCheckoutForm cartItems={cartItems} />
        </div>
        <div>
          <h2 className="subtitle">Ihre Bestellung</h2>
          <div className="order-summary">
            {cartItems.length === 0 ? (
              <p>Ihr Warenkorb ist leer.</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))
            )}
            <div className="total">
              <span>Gesamtsumme</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
