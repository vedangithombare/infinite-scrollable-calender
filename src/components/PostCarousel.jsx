import { useEffect, useRef, useCallback } from "react";
import React from "react";
import CarouselCard from "./CarouselCard";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";

function PostCarousel({ data, postIndex, setPostIndex }) {
  const touchStartXRef = useRef(null);

  // Handling swipe on mobile
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (touchStartXRef.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartXRef.current - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && postIndex < data.length - 1) {
          setPostIndex((prev) => prev + 1);
        } else if (diff < 0 && postIndex > 0) {
          setPostIndex((prev) => prev - 1);
        }
      }

      touchStartXRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [postIndex, data.length, setPostIndex]);

  // Memoized callbacks for buttons
  const handlePrev = useCallback(() => {
    if (postIndex > 0) setPostIndex((prev) => prev - 1);
  }, [postIndex, setPostIndex]);

  const handleNext = useCallback(() => {
    if (postIndex < data.length - 1) setPostIndex((prev) => prev + 1);
  }, [postIndex, data.length, setPostIndex]);

  const handleClose = useCallback(() => setPostIndex(null), [setPostIndex]);

  return (
    <div className="fixed inset-0 z-20 bg-black/70 flex items-center justify-center p-2">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute cursor-pointer top-4 right-4 bg-black/70 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-2xl shadow-md active:scale-95 transition"
      >
        <MdClose />
      </button>

      {/* Carousel */}
      <div className="flex items-center justify-center gap-3 w-full max-w-full md:gap-6 relative">
        {/* Prev Button */}
        {postIndex > 0 && (
          <button
            onClick={handlePrev}
            className="hidden md:flex items-center px-[6px] py-[6px] justify-center cursor-pointer text-white text-2xl rounded-[50%] bg-black/50 absolute left-4 z-10"
          >
            <MdChevronLeft />
          </button>
        )}

        {/* Cards */}
        <div className="flex items-center justify-center gap-3 md:gap-6 w-full">
          {/* left card */}
          {postIndex > 0 && (
            <div className="hidden md:block cursor-pointer scale-y-90 opacity-70">
              <MemoizedCarouselCard post={data[postIndex - 1]} />
            </div>
          )}

          {/* center card */}
          <div className="flex justify-center cursor-pointer w-full max-w-sm sm:max-w-md">
            <MemoizedCarouselCard post={data[postIndex]} />
          </div>

          {/* right card */}
          {postIndex < data.length - 1 && (
            <div className="hidden md:block cursor-pointer scale-y-90 opacity-70">
              <MemoizedCarouselCard post={data[postIndex + 1]} />
            </div>
          )}
        </div>

        {/* Next Button */}
        {postIndex < data.length - 1 && (
          <button
            onClick={handleNext}
            className="hidden md:flex items-center cursor-pointer px-[6px] py-[6px] justify-center text-white text-2xl rounded-[50%] bg-black/50 absolute right-4 z-10"
          >
            <MdChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}

// Memoized CarouselCard to prevent unnecessary re-renders
const MemoizedCarouselCard = React.memo(CarouselCard);

export default PostCarousel;
