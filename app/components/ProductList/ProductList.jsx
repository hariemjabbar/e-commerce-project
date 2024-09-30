"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const ProductList = ({ addToCart, filterCriteria }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data); // Speichern aller Produkte
        setFilteredProducts(data); // Standardmäßig alle Produkte anzeigen
      } catch (error) {
        console.error("Fehler beim Abrufen der Produkte:", error);
      }
    };

    fetchProducts();
  }, []);

  // Produkte filtern, wenn sich die Filterkriterien ändern
  useEffect(() => {
    if (filterCriteria) {
      const { category, minPrice, maxPrice } = filterCriteria;

      const filtered = products.filter((product) => {
        const categoryMatch = category ? product.category === category : true;
        const minPriceMatch = minPrice ? product.price >= parseFloat(minPrice) : true;
        const maxPriceMatch = maxPrice ? product.price <= parseFloat(maxPrice) : true;

        return categoryMatch && minPriceMatch && maxPriceMatch;
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Falls keine Filterkriterien gesetzt sind, alle Produkte anzeigen
    }
  }, [filterCriteria, products]); // Filterung aktualisieren, wenn sich Filterkriterien oder Produkte ändern

  return (
    <div className='product-list-container'>
      <div className="product-list">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
