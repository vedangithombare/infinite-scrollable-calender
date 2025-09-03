/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";

function DisplayCalender() {
  const [currentMonthYear, setCurrentMonthYear] = useState({
    year: null,
    month: null,
  });
  const [currentMonthName, setCurrentMonthName] = useState("");
  const [presentTimeLine, setPresentTimeLine] = useState([]);
  const [presentVisibleDates, setPresentVisibleDates] = useState([]);

  const scrollContainerRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const currentMonthRef = useRef(null);
  const monthRefs = useRef({});
  const hasScrolledRef = useRef(false);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper: get all dates of a month
  function getMonthDates(year, monthIndex) {
    const monthDays = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from(
      { length: monthDays },
      (_, i) => new Date(year, monthIndex, i + 1)
    );
  }

  // Generate past/future months for infinite scroll
  function getPrevNextMonths(year, month, range = 1) {
    let months = [];
    for (let offset = -range; offset <= range; offset++) {
      const date = new Date(year, month + offset);
      months.push({ year: date.getFullYear(), month: date.getMonth() });
    }
    return months;
  }

  // Convert timeline into month objects with dates
  function getMonthDatesArr(timeline) {
    return timeline.map(({ year, month }) => ({
      year,
      month,
      dates: getMonthDates(year, month),
    }));
  }

  // Generating month name
  function getMonthName(year, month) {
    return new Date(year, month).toLocaleString("en-US", { month: "short" });
  }

  // Initialize timeline with current month + surrounding months
  useEffect(() => {
    const today = new Date();
    const initialTimeline = getPrevNextMonths(
      today.getFullYear(),
      today.getMonth(),
      6
    );
    setPresentTimeLine(initialTimeline);
    setCurrentMonthYear({ year: today.getFullYear(), month: today.getMonth() });
    setCurrentMonthName(getMonthName(today.getFullYear(), today.getMonth()));
  }, []);

  // Update visible dates whenever timeline changes
  useEffect(() => {
    setPresentVisibleDates(getMonthDatesArr(presentTimeLine));
  }, [presentTimeLine]);

  // Infinite scroll observer
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (entry.target === bottomRef.current) {
            const last = presentTimeLine[presentTimeLine.length - 1];
            const nextTimeline = getPrevNextMonths(last.year, last.month, 1);
            const filteredNext = nextTimeline.filter(
              (m) =>
                !presentTimeLine.some(
                  (p) => p.year === m.year && p.month === m.month
                )
            );
            if (filteredNext.length > 0)
              setPresentTimeLine((prev) => [...prev, ...filteredNext]);
          }

          if (entry.target === topRef.current) {
            const container = scrollContainerRef.current;
            const prevScrollHeight = container.scrollHeight;

            const first = presentTimeLine[0];
            const prevTimeline = getPrevNextMonths(first.year, first.month, 1);
            const filteredPrev = prevTimeline.filter(
              (m) =>
                !presentTimeLine.some(
                  (p) => p.year === m.year && p.month === m.month
                )
            );

            if (filteredPrev.length > 0) {
              setPresentTimeLine((prev) => [...filteredPrev, ...prev]);
              // Maintain scroll position
              requestAnimationFrame(() => {
                container.scrollTop +=
                  container.scrollHeight - prevScrollHeight;
              });
            }
          }
        });
      },
      { root: scrollContainerRef.current, threshold: 1.0 }
    );

    if (topRef.current) observer.observe(topRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [presentTimeLine]);

  // Update header on scroll
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const [year, month] = entry.target.dataset.month
              .split("-")
              .map(Number);
            setCurrentMonthYear({ year, month });
            setCurrentMonthName(getMonthName(year, month));
          }
        });
      },
      { root: scrollContainerRef.current, threshold: 0.5 }
    );

    presentVisibleDates.forEach(({ year, month }) => {
      const el = monthRefs.current[`${year}-${month}`];
      if (el) headerObserver.observe(el);
    });

    return () => headerObserver.disconnect();
  }, [presentVisibleDates]);

  // Auto-scroll to current month only on first render
  useEffect(() => {
    if (!hasScrolledRef.current && currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
      hasScrolledRef.current = true;
    }
  }, [presentVisibleDates]);

  // Flatten dates for continuous flow
  const allDates = [];
  presentVisibleDates.forEach(({ dates }) => allDates.push(...dates));
  const emptyStartCount = allDates.length ? allDates[0].getDay() : 0;

  return (
    <div className="flex w-full h-full flex-col">
      {/* Header */}
      <div className="flex sticky top-0 z-20 h-12 w-full items-center p-1 md:p-6 lg:px-12 flex-row justify-between text-base bg-white">
        <div className="flex flex-row gap-5 items-center">
          <span
            style={{ fontWeight: "600" }}
            className="material-symbols-outlined"
          >
            arrow_back
          </span>
          <span className="font-bold">
            <span className="text-[#1d4ce3]">my</span> hair Diary
          </span>
        </div>
        <span className="flex flex-row gap-1">
          <span className="font-bold">{currentMonthName}</span>
          <span>{currentMonthYear.year}</span>
        </span>
      </div>

      {/*  Weekdays */}
      <div className="flex w-full h-10 sticky top-12 z-10 bg-white">
        <ul className="flex w-full items-center">
          {weekDays.map((day) => (
            <li key={day} className="flex w-full justify-center items-center">
              {day}
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar */}
      <div
        ref={scrollContainerRef}
        className="flex flex-wrap w-full overflow-y-auto flex-1"
      >
        <div ref={topRef}></div>

        {Array.from({ length: emptyStartCount }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex w-1/7 h-[10rem] border-t border-l border-gray-400"
          ></div>
        ))}

        {allDates.map((date) => {
          const key = date.toISOString();
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          const today = new Date();
          const isCurrentMonth =
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth();

          if (!monthRefs.current[monthKey]) monthRefs.current[monthKey] = null;

          return (
            <div
              key={key}
              ref={(el) => {
                if (!monthRefs.current[monthKey])
                  monthRefs.current[monthKey] = el;
                if (isCurrentMonth && !currentMonthRef.current)
                  currentMonthRef.current = el;
              }}
              data-month={monthKey}
              className={`flex w-1/7 items-start justify-center h-[10rem] border-t border-l border-gray-400 ${
                isCurrentMonth ? "text-black" : "text-gray-400"
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>
      
    </div>
  );
}

export default DisplayCalender;
