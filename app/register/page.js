"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import './register.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',           // Vollständiger Name hinzugefügt
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.name,  // Vollständiger Name an die API senden
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Registrierung fehlgeschlagen');
      } else {
        alert('Registrierung erfolgreich!');
        // Hier könnten Sie die Benutzer zur Anmeldeseite weiterleiten
        // window.location.href = '/login';  // Uncomment this line for redirection
      }
    } catch (error) {
      console.error('Registrierungsfehler:', error);
      setError('Ein unerwarteter Fehler ist aufgetreten');
    }
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h2 className="title">Konto erstellen</h2>
        <p className="subtitle">
          Oder{' '}
          <Link href="/login" className="link">
            melden Sie sich an, wenn Sie bereits ein Konto haben
          </Link>
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label htmlFor="name" className="label">
              Vollständiger Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input"
              placeholder="Vollständiger Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
              autoComplete="new-password"
              required
              className="input"
              placeholder="Passwort"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password-confirm" className="label">
              Passwort bestätigen
            </label>
            <input
              id="password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
              className="input"
              placeholder="Passwort bestätigen"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">
            Registrieren
          </button>
        </form>
      </div>
    </div>
  );
}
