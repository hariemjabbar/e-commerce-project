import React, { useEffect, useState } from 'react';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      const response = await fetch('/api/purchases');
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div>
      <h2>My Purchases</h2>
      <ul>
        {purchases.map((purchase) => (
          <li key={purchase._id}>
            {purchase.productName} - ${purchase.price} on {new Date(purchase.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPurchases;
