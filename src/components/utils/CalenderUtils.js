  // Helper: get all dates of a month
  export function getMonthDates(year, monthIndex) {
    const monthDays = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from(
      { length: monthDays },
      (_, i) => new Date(year, monthIndex, i + 1)
    );
  }

  // Generate past/future months for infinite scroll
 export function getPrevNextMonths(year, month, range = 1) {
    let months = [];
    for (let offset = -range; offset <= range; offset++) {
      const date = new Date(year, month + offset);
      months.push({ year: date.getFullYear(), month: date.getMonth() });
    }
    return months;
  }

  // Convert timeline into month objects with dates
export  function getMonthDatesArr(timeline) {
    return timeline.map(({ year, month }) => ({
      year,
      month,
      dates: getMonthDates(year, month),
    }));
  }

  // Generating month name
 export function getMonthName(year, month) {
    return new Date(year, month).toLocaleString("en-US", { month: "short" });
  }
