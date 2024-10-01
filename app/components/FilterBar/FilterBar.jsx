import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleFilter = () => {
    const criteria = {
      category: selectedCategory.trim() || null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    };
    
    console.log("Filter Button Clicked:", criteria); // Debugging
    onFilter(criteria);
  };

  return (
    <div className="filter-bar">
      <select 
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)} 
        className="filter-select"
      >
        <option value="">Alle Kategorien</option>
        <option value="Nintendo">Nintendo</option>
        <option value="Sony">Sony</option>
        <option value="Microsoft">Xbox One</option>
      </select>

      <input 
        type="number" 
        placeholder="Min Preis" 
        value={minPrice} 
        onChange={(e) => setMinPrice(e.target.value)} 
        className="filter-input"
      />

      <input 
        type="number" 
        placeholder="Max Preis" 
        value={maxPrice} 
        onChange={(e) => setMaxPrice(e.target.value)} 
        className="filter-input"
      />

      <button onClick={handleFilter} className="filter-button">
        Filtern
      </button>
    </div>
  );
};

export default FilterBar;
