import React, { useEffect, useRef, useState } from "react";

const MS_IN_DAY = 24 * 60 * 60 * 1000;

export default function InfiniteDateList() {
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    let initialDates = [];

    // Generate 365 past days
    for (let i = 365; i > 0; i--) {
      initialDates.push(new Date(now.getTime() - i * MS_IN_DAY));
    }

    // Today
    initialDates.push(now);

    // Generate 365 future days
    for (let i = 1; i <= 365; i++) {
      initialDates.push(new Date(now.getTime() + i * MS_IN_DAY));
    }

    setDates(initialDates);
  }, []);

  // Infinite scroll
  const addMoreDates = (direction) => {
    setDates((prev) => {
      if (prev.length === 0) return prev;
      let newDates = [...prev];

      if (direction === "top") {
        const first = newDates[0];
        let more = [];
        for (let i = 1; i <= 100; i++) {
          more.unshift(new Date(first.getTime() - i * MS_IN_DAY));
        }

        const container = containerRef.current;
        const prevHeight = container.scrollHeight;
        newDates = [...more, ...newDates];
        setTimeout(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop += newHeight - prevHeight;
        }, 0);
      } else if (direction === "bottom") {
        const last = newDates[newDates.length - 1];
        for (let i = 1; i <= 100; i++) {
          newDates.push(new Date(last.getTime() + i * MS_IN_DAY));
        }
      }

      return newDates;
    });
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop < clientHeight * 0.25) addMoreDates("top");
    if (scrollTop + clientHeight > scrollHeight * 0.75) addMoreDates("bottom");
  };

  // Watch "first" and "last" day of each month
  useEffect(() => {
    if (!containerRef.current || dates.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { isIntersecting, boundingClientRect, target } = entry;

          // 50% threshold manually checked
          const aboveHalf =
            boundingClientRect.top < window.innerHeight * 0.5 &&
            boundingClientRect.bottom > 0;

          if (isIntersecting && aboveHalf && target.dataset.type === "first") {
            const date = new Date(target.dataset.date);
            setCurrentMonth(
              `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`
            );
          }

          if (!aboveHalf && target.dataset.type === "last") {
            // If last day not above 50%, remove it
            observer.unobserve(target);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: [0.5],
      }
    );

    // Attach observer to month boundaries
    const monthBoundaries = containerRef.current.querySelectorAll(
      "[data-type='first'], [data-type='last']"
    );
    monthBoundaries.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [dates]);

  // Helper to detect first & last day of month
  const getDayType = (date, idx) => {
    const d = date.getDate();
    const next = dates[idx + 1];
    const prev = dates[idx - 1];

    if (d === 1 || !prev || prev.getMonth() !== date.getMonth()) {
      return "first";
    }
    if (!next || next.getMonth() !== date.getMonth()) {
      return "last";
    }
    return "";
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-gray-200 p-2 font-bold text-center shadow">
        {currentMonth || "Loading..."}
      </div>

      {/* Scrollable list */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll p-4"
        onScroll={handleScroll}
      >
        {dates.map((date, idx) => {
          const type = getDayType(date, idx);
          return (
            <div
              key={idx}
              className="p-2 border rounded mb-2 shadow-sm bg-white"
              data-type={type}
              data-date={date.toISOString()}
            >
              {date.toDateString()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
