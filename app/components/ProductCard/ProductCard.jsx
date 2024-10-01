'use client'; 

import React from 'react';
import './ProductCard.css'; // Importiere die CSS-Datei für die Stile

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="card">
      <img className="card-img" src={product.imageUrl} alt={product.name} />
      <h3 className="card-title">{product.name}</h3>
      <div className="card-price">${product.price}</div>
      <button onClick={() => addToCart(product)}>In den Warenkorb</button>
    </div>
  );
};

export default ProductCard;
