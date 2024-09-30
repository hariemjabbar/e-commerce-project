import React from 'react';
import './HeroSection.css'; // Du kannst den Pfad zu deiner CSS-Datei anpassen

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Willkommen zu Retroshop</h1>
        <p className="hero-text">
          Entdecke die besten Retro-Artikel in unserem Shop. Hier findest du alles, was du brauchst, um in die Vergangenheit zu reisen – von klassischen Spielen bis hin zu Vintage-Mode.
        </p>
      </div>
      <div className="hero-image-container">
        <img
          src="/uploads/Hero/hero.jpg" // Hier kannst du den Pfad zu deinem Bild anpassen
          alt="Hero"
          className="hero-image"
        />
      </div>
    </div>
  );
};

export default HeroSection;
