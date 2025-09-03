import { useEffect, useState } from "react";
import { sampleData } from "../statics/data";

function PostCarausel() {
  const [data, setData] = useState([]);

  //   getting full month string
  function getDateString(date) {
    let dateStr = "";
    let dateArr = date.split("/");
    let month = dateArr[1];
    let year = dateArr[2];
    let monthName = new Date(year, month).toLocaleString("en-US", {
      month: "long",
    });

    dateStr = `${dateArr[0]} ${monthName}`;

    return dateStr;
  }

  //   shortening article
  function shortenArticle(desc) {
    let maxLength = 100;

    if (desc.length > maxLength) {
      return desc.substring(0, maxLength) + "...";
    } else {
      return desc;
    }
  }

  //  Category badges
  function renderBadges(categories) {
    const colors = [
      "bg-purple-100 text-purple-600",
      "bg-pink-100 text-pink-600",
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
    ];

    return (
      <div className="flex gap-1">
        {categories.slice(0, 2).map((category, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              colors[index % colors.length]
            }`}
          >
            {category
              .split(" ")
              .map((categoryStyle) => categoryStyle[0])
              .join("")
              .toUpperCase()}
          </span>
        ))}
      </div>
    );
  }

  //  Star rating
  function renderStars(rating) {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.floor(rating);
          const half = !filled && i < rating;

          return (
            <div key={i} className="relative w-4 h-4">
              {filled ? (
                // full star
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-blue-500"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.171L12 18.896l-7.335 3.868 1.401-8.171L.132 9.211l8.2-1.193z" />
                </svg>
              ) : half ? (
                <>
                  {/* empty star base */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-4 h-4 text-gray-300"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.171L12 18.896l-7.335 3.868 1.401-8.171L.132 9.211l8.2-1.193z" />
                  </svg>
                  {/* half overlay */}
                  <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-blue-500"
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.171L12 18.896l-7.335 3.868 1.401-8.171L.132 9.211l8.2-1.193z" />
                    </svg>
                  </div>
                </>
              ) : (
                // empty star
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-4 h-4 text-gray-300"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.171L12 18.896l-7.335 3.868 1.401-8.171L.132 9.211l8.2-1.193z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  useEffect(() => {
    setData(sampleData);
  }, []);
  console.log(data);
  return (
    <>
      <div className="flex flex-wrap lg:flex-row gap-4 items-center justify-center w-full">
        {data.map((post) => {
          return (
            <div className="flex flex-col w-[16rem] h-[32rem] rounded-xl md:w-[20rem] md:h-[38rem]  ">
              <div className=" w-full rounded-t-md  h-[22rem] overflow-hidden ">
                <img
                  className="w-full h-full rounded-t-md object-cover"
                  src={`${post.imgUrl}`}
                  alt={`${post.date}`}
                  loading="lazy"
                />
              </div>
              <div className=" flex  flex-col flex-1 bg-white rounded-b-md">
                <div className="flex flex-row justify-between p-1 items-center">
                  <div className="flex flex-row p-3 ">
                    <span>{renderBadges(post.categories)}</span>
                  </div>
                  <div>{renderStars(post.rating)}</div>
                </div>
                <div className="flex flex-1 flex-col  p-2 gap-2">
                  <div>{getDateString(post.date)}</div>
                  <div>{shortenArticle(post.description)}</div>
                </div>
                <div className="flex-end w-full bg-gray-400 border-t border-gray rounded-b-md">
                  <span className="flex justify-center font-bold p-2">
                    View full Post
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PostCarausel;
