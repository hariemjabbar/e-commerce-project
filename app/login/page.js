"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import './login.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); // Zustand für Benachrichtigungen

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result.error) {
      setError(result.error);
      setNotification(null); // Fehlermeldung zurücksetzen
    } else {
      setNotification('Anmeldung erfolgreich!'); // Erfolgsbenachrichtigung setzen
      setError(null); // Fehler zurücksetzen
      window.location.href = '/';
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h2 className="title">Anmelden</h2>
        <p className="subtitle">
          Oder{' '}
          <Link href="/register" className="link">
            registrieren Sie sich für ein neues Konto
          </Link>
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="email-address" className="label">
              E-Mail-Adresse
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              placeholder="E-Mail-Adresse"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password" className="label">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
              placeholder="Passwort"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="options">
            <div className="rememberMe">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox"
              />
              <label htmlFor="remember-me" className="checkboxLabel">
                Angemeldet bleiben
              </label>
            </div>
            <a href="#" className="forgotPassword">
              Passwort vergessen?
            </a>
          </div>
          {error && <p className="error">{error}</p>} {}
          {notification && <p className="notification">{notification}</p>} {}
          <button type="submit" className="button">
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}
