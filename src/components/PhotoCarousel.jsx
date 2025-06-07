import React, { useEffect, useState } from "react";

const slides = [
  { src: "/images/img1.jpg", caption: "Caption Text" },
  { src: "/images/img2.jpg", caption: "Caption Two" },
  { src: "/images/img3.jpg", caption: "Caption Three" },
];

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${
            index === currentSlide ? "block" : "hidden"
          } relative transition-opacity duration-700`}
        >
          <img
            src={slide.src}
            alt={`Slide ${index + 1}`}
            className="w-full h-96 object-cover rounded-lg"
          />

          <div className="absolute top-0 left-0 p-3 text-white text-xs">
            {index + 1} / {slides.length}
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 py-2 text-white font-bold text-lg bg-black bg-opacity-40 hover:bg-opacity-70"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 py-2 text-white font-bold text-lg bg-black bg-opacity-40 hover:bg-opacity-70"
        onClick={nextSlide}
      >
        ❯
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-4 w-4 rounded-full cursor-pointer ${
              index === currentSlide ? "bg-gray-800" : "bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
