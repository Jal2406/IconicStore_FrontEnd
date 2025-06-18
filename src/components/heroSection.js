import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./HeroSection.css";

const slides = [
  {
    title: "Shop the Latest Trends",
    subtitle: "Curated fashion & tech products, just for you.",
    button1: "Shop Now",
    button2: "Watch Demo",
    bg: require("../image/image.png"), // Fix image import
  },
  {
    title: "Exclusive Deals Await",
    subtitle: "Don't miss out on our biggest discounts.",
    button1: "Explore",
    button2: "Learn More",
    bg: require("../image/image2.jpg"), // Fix image import
  },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);

  const scrollToSlide = (index) => {
    if (!carouselRef.current || isTransitioning) return;
    
    setIsTransitioning(true);
    const width = carouselRef.current.offsetWidth;
    
    carouselRef.current.style.transition = "transform 0.8s ease-in-out";
    carouselRef.current.style.transform = `translateX(-${index * 100}%)`;
    
    setCurrentIndex(index);
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    scrollToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    scrollToSlide(prevIndex);
  };

  return (
    <div className="hero-carousel-container">
      <button className="carousel-arrow left" onClick={prevSlide} disabled={isTransitioning}>
        <FaChevronLeft />
      </button>

      <div className="hero-carousel-wrapper">
        <div 
          className="hero-carousel" 
          ref={carouselRef}
          style={{
            display: "flex",
            width: `${slides.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / slides.length)}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div
              className="hero-slide"
              key={index}
              style={{ 
                backgroundImage: `url(${slide.bg})`,
                width: `${100 / slides.length}%`
              }}
            >
              <div className="overlay"></div>
              <div className="hero-text text-white">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <div className="button-group">
                  <button className="btn btn-primary">{slide.button1}</button>
                  <button className="btn btn-outline-light">
                    {slide.button2}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-arrow right" onClick={nextSlide} disabled={isTransitioning}>
        <FaChevronRight />
      </button>
      
      {/* Slide indicators */}
      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => scrollToSlide(index)}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
