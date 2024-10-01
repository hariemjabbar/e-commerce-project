"use client";

import React, { useEffect, useState } from 'react';
import { User, Package, ShoppingCart, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import './AccountManagment.css'
import MyPurchases from '../MyPurchases/MyPurchases';

const PersonalInformation = ({ title, userData, onUpdate }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });

  useEffect(() => {
    if (userData) {
      setFormData({ fullName: userData.fullName || '', email: userData.email, phone: userData.phone || '' });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  return (
    <div>
      <h2 className="section-title">{title}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (data) => {
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('User information updated successfully!'); // Hier könnten Sie eine bessere Benutzeroberfläche verwenden
      const updatedUserData = await response.json();
      setUserData(updatedUserData);
    } else {
      alert('Failed to update user information.');
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="sidebar">
          <div className="user-info">
            <div className="avatar">JD</div>
            <div>
              <h2>{userData?.fullName || 'Loading...'}</h2>
              <p>{userData?.email || 'Loading...'}</p>
            </div>
          </div>
          <nav>
            <ul>
              <li>
                <button onClick={() => setActiveTab('personal')} className={activeTab === 'personal' ? 'active' : ''}>
                  <User /> Personal Information
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('purchases')} className={activeTab === 'purchases' ? 'active' : ''}>
                  <Package /> My Purchases
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>
                  <ShoppingCart /> My Orders
                </button>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <LogOut /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content">
          {activeTab === 'personal' && <PersonalInformation title="Personal Information" userData={userData} onUpdate={handleUpdate} />}
          {activeTab === 'purchases' && <MyPurchases title="My Purchases" />}
          {activeTab === 'orders' && <MyOrders title="My Orders" />} {/* Diese Komponente müssen Sie separat implementieren */}
        </div>
      </div>
    </div>
  );
}


