/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

function DisplayCalender() {
  const [currentMonthYear, setCurrentMonthYear] = useState({
    year: null,
    month: null,
  });

  const [currentMonthName, setCurrentMonthName] = useState("");
  const [presentTimeLine, setPresentTimeLine] = useState([]);
  const [presentVisibleDates, setPresentVisibleDates] = useState([]);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  console.log(today.getDate());

  //helper function:  getting dates of the month
  function getMonthDates(year, monthIndex) {
    let dates = [];
    let monthDays = new Date(year, monthIndex + 1, 0).getDate();

    for (let i = 1; i <= monthDays; i++) {
      dates.push(new Date(year, monthIndex, i));
    }
    return dates;
  }

  // getting past and future  6 months on the basis of current month and year
  function getPrevNextMonths(year, month, range = 6) {
    let pastMonths = [];
    let futureMonths = [];
    let newYear;
    let newMonth;
    let currentTimeLine;

    // calculating past 6 months on the basis of present year and month
    for (let past = 1; past <= range; past++) {
      newMonth = month - past;
      newYear = year;

      if (newMonth <= 0) {
        newMonth += 12;
        newYear -= 1;
      }
      pastMonths.push({ year: newYear, month: newMonth });
    }

    // calculating future 6 months on the basis of present year and month
    for (let future = 1; future <= range; future++) {
      newMonth = month + future;
      newYear = year;

      if (newMonth > 11) {
        newMonth -= 12;
        newYear += 1;
      }
      futureMonths.push({ year: newYear, month: newMonth });
    }
    // reversing past months
    pastMonths.reverse();

    currentTimeLine = [...pastMonths, { year, month }, ...futureMonths];
    return currentTimeLine;
  }

  // getting the dates of all the current 13 months
  function getMonthDatesArr(presentTimeLine) {
    let dates = [];
    for (let j = 0; j < presentTimeLine.length; j++) {
      let currentYear = presentTimeLine[j].year;
      let currentMonth = presentTimeLine[j].month;
      let newDate = getMonthDates(currentYear, currentMonth);
      dates.push(...newDate);
    }
    console.log(dates);
    return dates;
  }

  let visibleData = getMonthDatesArr(presentTimeLine);
  console.log(visibleData);

  function getMonthName(year, month) {
    const currentMonth = new Date(year, month);
    const monthName = currentMonth.toLocaleString("en-US", { month: "short" });
    return monthName;
  }

  let monthName = getMonthName(currentMonthYear.year, currentMonthYear.month);

  useState(() => {
    /*heres the key acc to this month and year the data should get loaded*/
    setPresentTimeLine(getPrevNextMonths(2025, 8));
    setCurrentMonthName(monthName);
  }, [presentTimeLine]);
  useEffect(() => {
    setPresentVisibleDates(visibleData);
  }, [visibleData]);

  return (
    <>
      <div className="flex w-full h-full flex-col  ">
        <div className="flex h-12 w-full items-center p-1 md:p-6 lg:px-12 flex-row justify-between text-base">
          <div className="flex flex-row gap-5 items-center ">
            <span
              style={{ fontWeight: "600" }}
              class="material-symbols-outlined"
            >
              arrow_back
            </span>
            <span className="font-bold">
              <span className="text-[#1d4ce3]">my</span> hair Diary
            </span>
          </div>
          <span className="flex flex-row gap-1">
            <span className="font-bold">{currentMonthName}</span>
            <span>2025</span>
          </span>
        </div>

        <div className=" flex flex-1   flex-col lg:p-[2rem] lg:px-[4rem]">
          <div className="flex w-full h-10  sticky ">
            <ul className="flex w-full items-center ">
              {weekDays.map((day) => {
                return (
                  <li className="flex w-full justify-center items-center">
                    {day}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-wrap w-full  overflow-y-auto ">
            <div className="flex flex-col w-1/7  items-center h-[10rem] border-t border-l  border-gray-400 ">
              <span>1</span>
              <div className="flex w-full h-[60%] bg-blue-300"></div>
            </div>

            {/* <div
              className={`flex w-1/7 items-start justify-center  h-[10rem] border-t border-l border-gray-400 border-gray-400`}
            >
              1
            </div> */}

            {presentVisibleDates.map((date) => {
              return (
                <div
                  className={`flex w-1/7 items-start justify-center  h-[10rem] border-t border-l border-gray-400 border-gray-400`}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default DisplayCalender;
