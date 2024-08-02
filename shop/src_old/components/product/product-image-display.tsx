import React, { useState, useRef } from "react";
import { ArrowNext } from "@components/icons/arrow-next";
import { ArrowPrev } from "@components/icons/arrow-prev";

interface ProductImageCarouselProps {
  images: [
    {
      id: number;
      original: string;
      thumbnail: string;
    }
  ];
  openLuckyForm(): any;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const [zoomPosition, setZoomPosition] = useState({ x: 0.5, y: 0.5 });

  const handleMouseEnter = () => {
    setIsZoomed(true);

  };

  const handleMouseLeave = () => {
    setIsZoomed(false);

  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      setZoomPosition({ x, y });
    }
  };

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const ref = useRef<HTMLInputElement>(null);

  const scroll = (scrollOffset: number) => {
    if (ref.current)
      ref.current.scrollLeft += scrollOffset;
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const onNextClick = () => {
    currentIndex < images.length - 1
      ? setCurrentIndex((prev) => prev + 1)
      : setCurrentIndex(0);
    scroll(25);
  };

  const onPrevClick = () => {
    currentIndex > 0
      ? setCurrentIndex((prev) => prev - 1)
      : setCurrentIndex(0);
    scroll(-25);
  };


 
  

  return (
    <div className="item-center relative">
      <div
        className="item-center relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div className="transition duration-150 ease-in hover:opacity-90 flex justify-evenly">
          <div className="zoom-container">
          <div
              className={`w-full h-full zoomed-image object-contain ${isZoomed ? 'zoomed zoomed-in' : ''}`}
              style={{
                backgroundImage: `url(${images[currentIndex]?.original || "/"})`,
                backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                backgroundSize: isZoomed ? "auto" : "contain"
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="justify-center flex">
        <div className="self-center cursor-pointer">
          {currentIndex > 0 && (
            <ArrowPrev
              onClick={onPrevClick}
            />
          )}
        </div>
        <div className="align-middle inline-flex mx-2 overflow-x-auto" ref={ref}>
          {images.map((image, index) => (
            <img
              src={image?.thumbnail || "/"}
              alt={`Product Image ${image?.id}`}
              key={`Product Image Carousel Image of ${image?.id}`}
              className={`border min-w-[70px] min-h-[70px] w-15 h-15 xl:w-[70px] xl:h-[70px] mx-1 my-1 ${
                index === currentIndex && "border-2 border-yellow-300"
              } w-20 h-20 m-0 p-0 object-fill hover:border-yellow-200 hover:border-2 cursor-pointer
              }
              `}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
        <div className="self-center cursor-pointer " >
          {currentIndex < images.length - 1 && (
            <ArrowNext
              onClick={onNextClick}
            />
          )}
        </div>
      </div>
      <style>
      {`
 /* Add this CSS to your styles */
 .zoom-container {
   overflow: hidden;
   position: relative;
   width: 100%;
   height: 550px;
 }
 
 .zoomed-image {
   width: 100%;
   height: 100%;
   background-repeat: no-repeat;
   transition: transform 0.2s;
   cursor: pointer;
   /* Reset the transform-origin to its default value when not zoomed */
  transform-origin: 50% 50%;
 }
 
 .zoomed-in {
   transform: scale(1);
   transform-origin: 50% 50%;
   transition: transform 0.2s;
 }
 
  `}
      </style>
    </div>
  );
};

export default ProductImageCarousel;
