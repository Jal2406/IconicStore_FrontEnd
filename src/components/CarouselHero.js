// src/components/CarouselHero.jsx
import React from "react";

const CarouselHero = () => {
  return (
    <div id="heroCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner vh-100">
        {[1, 2, 3].map((index) => (
          <div
            className={`carousel-item ${index === 1 ? "active" : ""}`}
            key={index}
          >
            <div
              className="d-flex justify-content-center align-items-center vh-100 text-white text-center"
              style={{
                background: `url(/images/slide${index}.jpg) center/cover no-repeat`,
              }}
            >
              <div className="bg-dark bg-opacity-50 p-4 rounded">
                <h1 className="display-4 fw-bold mb-3">Slide {index} Heading</h1>
                <p className="lead">This is a short description for slide {index}.</p>
                <a href="#products" className="btn btn-light mt-3 rounded-pill px-4 py-2">
                  Explore Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default CarouselHero;

