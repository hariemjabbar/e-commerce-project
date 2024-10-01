"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaCreditCard, FaLock, FaShoppingCart, FaTruck } from 'react-icons/fa'
import styles from './checkout.module.css'

function CheckoutForm({ cartItems }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const onSubmit = async (data) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Here you would implement your checkout logic
      console.log("Checkout successful!", { ...data, cartItems })
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
      router.push("/bestellung-erfolgreich")
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGrid}>
        <div>
          <label className={styles.label} htmlFor="firstName">
            <FaUser className={styles.icon} /> Vorname
          </label>
          <input
            {...register("firstName", { required: "Vorname ist erforderlich" })}
            className={styles.input}
          />
          {errors.firstName && <p className={styles.errorText}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label className={styles.label} htmlFor="lastName">
            <FaUser className={styles.icon} /> Nachname
          </label>
          <input
            {...register("lastName", { required: "Nachname ist erforderlich" })}
            className={styles.input}
          />
          {errors.lastName && <p className={styles.errorText}>{errors.lastName.message}</p>}
        </div>
      </div>
      <div>
        <label className={styles.label} htmlFor="email">
          <FaEnvelope className={styles.icon} /> E-Mail
        </label>
        <input
          {...register("email", { 
            required: "E-Mail ist erforderlich",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Ungültige E-Mail-Adresse",
            },
          })}
          type="email"
          className={styles.input}
        />
        {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
      </div>
      <div>
        <label className={styles.label} htmlFor="address">
          <FaMapMarkerAlt className={styles.icon} /> Adresse
        </label>
        <input
          {...register("address", { required: "Adresse ist erforderlich" })}
          className={styles.input}
        />
        {errors.address && <p className={styles.errorText}>{errors.address.message}</p>}
      </div>
      <div className={styles.formGrid}>
        <div>
          <label className={styles.label} htmlFor="zip">
            <FaMapMarkerAlt className={styles.icon} /> PLZ
          </label>
          <input
            {...register("zip", { required: "PLZ ist erforderlich" })}
            className={styles.input}
          />
          {errors.zip && <p className={styles.errorText}>{errors.zip.message}</p>}
        </div>
        <div>
          <label className={styles.label} htmlFor="city">
            <FaMapMarkerAlt className={styles.icon} /> Stadt
          </label>
          <input
            {...register("city", { required: "Stadt ist erforderlich" })}
            className={styles.input}
          />
          {errors.city && <p className={styles.errorText}>{errors.city.message}</p>}
        </div>
      </div>
      <div>
        <label className={styles.label} htmlFor="country">
          <FaMapMarkerAlt className={styles.icon} /> Land
        </label>
        <input
          {...register("country", { required: "Land ist erforderlich" })}
          className={styles.input}
        />
        {errors.country && <p className={styles.errorText}>{errors.country.message}</p>}
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <button
        type="submit"
        disabled={isProcessing}
        className={`${styles.button} ${isProcessing ? styles.buttonDisabled : ''}`}
      >
        {isProcessing ? "Wird bearbeitet..." : `Jetzt kaufen (${totalPrice.toFixed(2)} €)`}
      </button>
    </form>
  )
}

export default function Checkout() {
  const searchParams = useSearchParams()
  const itemsQuery = searchParams.get("items")
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (itemsQuery) {
      const items = JSON.parse(itemsQuery)
      setCartItems(items)
      console.log("Cart Items:", items) // Debugging log
    }
  }, [itemsQuery])

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaShoppingCart className={styles.titleIcon} /> Zur Kasse
      </h1>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutGrid}>
          <div>
            <h2 className={styles.subtitle}>
              <FaUser className={styles.subtitleIcon} /> Rechnungsadresse & Zahlung
            </h2>
            <CheckoutForm cartItems={cartItems} />
          </div>
          <div>
            <h2 className={styles.subtitle}>
              <FaShoppingCart className={styles.subtitleIcon} /> Ihre Bestellung
            </h2>
            <div className={styles.orderSummary}>
              {cartItems.length === 0 ? (
                <p className={styles.emptyCart}>Ihr Warenkorb ist leer.</p>
              ) : (
                <div>
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className={styles.orderItem}>
                      <span>{item.name} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                  <div className={styles.totalPrice}>
                    <span>Gesamtsumme</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.infoBox}>
              <h3 className={styles.infoTitle}>
                <FaLock className={styles.infoIcon} /> Sichere Bezahlung
              </h3>
              <p>Ihre Zahlungsinformationen werden sicher verschlüsselt übertragen.</p>
            </div>
            <div className={styles.infoBox}>
              <h3 className={styles.infoTitle}>
                <FaTruck className={styles.infoIcon} /> Versand
              </h3>
              <p>Kostenloser Versand für Bestellungen über 50 €. Lieferung innerhalb von 3-5 Werktagen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}