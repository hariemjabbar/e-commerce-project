"use client";

import React, { useState, useEffect } from 'react';
import ProductList from "./components/ProductList/ProductList";
import Warenkorb from './components/ShoppingCart/ShoppingCart';
import FilterBar from './components/FilterBar/FilterBar';
import './page.module.css';
import HeroSection from './components/HeroSection/HeroSection';

export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({}); // Halte es als leeres Objekt

  // Funktion zum Filtern der Produkte
  const handleFilter = (filters) => {
    setFilterCriteria(filters);
  };

  // Funktion zum Hinzufügen von Produkten zum Warenkorb
  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevCartItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCartItems, { ...product, quantity: 1 }];
    });
  };

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div className="main-container">
      <HeroSection />
      <FilterBar onFilter={handleFilter} />
      <div className="content">
        <Warenkorb cartItems={cartItems} setCartItems={setCartItems} addToCart={addToCart} />
        <ProductList addToCart={addToCart} filterCriteria={filterCriteria} /> {/* Filterkriterien übergeben */}
      </div>
    </div>
  );
}
