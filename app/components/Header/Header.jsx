// app/components/Header/Header.js
"use client"

import { signOut } from 'next-auth/react';
import './Header.css';
import { FaSearch } from "react-icons/fa";
import React, { useState } from 'react'; // <-- Füge useState hier hinzu
import { BsController } from "react-icons/bs";
import Link from 'next/link';


const Header = ({ session }) => {
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
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
          <li><Link href="/account">Account</Link></li> {/* Link zum Account Dashboard */}
          <li><a href="/cart">Cart</a></li>
        </ul>
      </nav>
      <div className="header-right">
        <button className="search-icon" onClick={toggleSearch}>
          <FaSearch />
        </button>
        {session ? (
          <button onClick={() => signOut()}>Logout</button>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
      {searchVisible && (
        <div className="search-bar-container">
          <input type="text" className="search-bar" placeholder="Search products..." />
        </div>
      )}
    </header>
  );
};

export default Header;
