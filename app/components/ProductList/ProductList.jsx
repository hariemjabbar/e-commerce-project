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

  useEffect(() => {
    if (filterCriteria && Object.keys(filterCriteria).length > 0) {
      const { category, minPrice, maxPrice } = filterCriteria;

      const filtered = products.filter((product) => {
        const categoryMatch = category ? product.category.toLowerCase() === category.toLowerCase() : true;
        const minPriceMatch = minPrice !== null ? product.price >= minPrice : true;
        const maxPriceMatch = maxPrice !== null ? product.price <= maxPrice : true;

        return categoryMatch && minPriceMatch && maxPriceMatch;
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Zeige alle Produkte, wenn keine Filterkriterien vorhanden sind
    }
  }, [filterCriteria, products]);

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
