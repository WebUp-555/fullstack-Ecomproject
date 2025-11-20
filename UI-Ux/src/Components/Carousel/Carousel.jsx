import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './Carousel.css';

function AdaptiveHeight() {
  const settings = {
    className: "h-auto",
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: dots => (
      <div style={{ bottom: '10px' }}>
        <ul style={{ margin: "0px", display: "flex", justifyContent: "center" }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: "#ea1538",
          opacity: 0.7,
          margin: "0 4px"
        }}
      />
    )
  };

  return (
    <div className="slider-container bg-gray-900 rounded-xl shadow-lg mx-auto my-6 px-2 md:px-10 max-w-5xl">
      <Slider {...settings}>
        
        <div>
          <img
            src="/b1.png"
            alt="Banner 1"
            className="w-full h-[220px] md:h-[400px] object-cover rounded-xl"
          />
        </div>
        <div>
          <img
            src="/ro.jpg"
            alt="Promo"
            className="w-full h-[220px] md:h-[400px] object-cover rounded-xl"
          />
        </div>
      </Slider>
    </div>
  );
}

export default AdaptiveHeight;
