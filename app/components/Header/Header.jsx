// components/Header/Header.js
"use client";

import { signOut } from 'next-auth/react';
import './Header.css';
import { FaSearch } from "react-icons/fa";
import React, { useState } from 'react';
import { BsController } from "react-icons/bs";
import Link from 'next/link';

const Header = ({ session, cartItems, setCartItems }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setSearchTerm(''); // Reset search term when toggling search bar
    setSearchResults([]); // Clear search results when toggling search bar
  };

  const handleSearch = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim().length > 0) {
      try {
        const response = await fetch(`/api/search?query=${term}`);
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Fehler bei der Suche:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(item => item._id === product._id);
    if (existingItemIndex > -1) {
      // Produkt ist bereits im Warenkorb, erhöhe die Menge
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Produkt ist nicht im Warenkorb, füge es hinzu
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    // Suchergebnisse zurücksetzen, nachdem ein Produkt hinzugefügt wurde
    setSearchResults([]);
    setSearchTerm('');
  };

  return (
    <header className="header">
      <div className="header-left">
        <BsController className="icon" />
        <h1>Retroshop</h1>
      </div>
      <nav className="nav">
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/products">All Products</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><Link href="/account">Account</Link></li>
        </ul>
      </nav>
      <div className="header-right">
        <button className="search-icon" onClick={toggleSearch}>
          <FaSearch />
        </button>
        {session ? (
          <button className="button-modern" onClick={() => signOut()}>Logout</button>
        ) : (
          <Link href="/login">
            <button className="button-modern">Login</button>
          </Link>
        )}
      </div>
      {searchVisible && (
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="search-result-item"
                  onClick={() => addToCart(product)} // Produkt zum Warenkorb hinzufügen
                >
                  <img src={product.imageUrl} alt={product.name} />
                  <span>{product.name} - {product.price.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
