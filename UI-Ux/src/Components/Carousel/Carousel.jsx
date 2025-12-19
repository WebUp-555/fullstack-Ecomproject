import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import './Carousel.css';

function AdaptiveHeight() {
  const settings = {
    className: "carousel-slider",
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    appendDots: dots => (
      <div className="custom-dots">
        <ul> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="custom-dot" />
    )
  };

  const slides = [
    {
      image: '/b1.png',
      title: 'Fashion Style',
      subtitle: 'JAPANEE',
      discount: '50% Off',
      cta: 'Buy Now',
      link: '/products'
    },
    {
      image: '/ro.jpg',
      title: 'Limited Edition',
      subtitle: 'Anime Collection',
      discount: 'New Drop',
      cta: 'Shop Now',
      link: '/products'
    }
  ];

  return (
    <div className="carousel-wrapper">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <div className="carousel-content-wrapper">
              <img
                src={slide.image}
                alt={slide.title}
                className="carousel-image"
              />
              <div className="carousel-overlay">
                <div className="carousel-text-content">
                  <div className="carousel-badge">
                    <span className="discount-text">Discount</span>
                    <span className="discount-value">{slide.discount}</span>
                  </div>
                  <p className="carousel-subtitle">{slide.subtitle}</p>
                  <h1 className="carousel-title">{slide.title}</h1>
                  <Link to={slide.link}>
                    <button className="carousel-cta">
                      {slide.cta}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AdaptiveHeight;
