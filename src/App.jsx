import DisplayCalender from "./components/DisplayCalender";
import PostCarousel from "./components/PostCarousel";
import { sampleData } from "./statics/data";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [postIndex, setPostIndex] = useState(null);
  const [loading, setLoading] = useState(true); // loader state

  // Compare dates function
  function compareDates(postDate, clickedDate) {
    const postDateArr = postDate.split("/").map(Number);
    const post = new Date(postDateArr[2], postDateArr[1] - 1, postDateArr[0]);

    return (
      clickedDate.getFullYear() === post.getFullYear() &&
      clickedDate.getMonth() === post.getMonth() &&
      clickedDate.getDate() === post.getDate()
    );
  }

  function checkClickedDateIsPresent(clickedDate, data) {
    if (clickedDate) {
      const index = data.findIndex((post) => compareDates(post.date, clickedDate));
      return index >= 0 ? index : -1;
    }
    return -1;
  }

  // Load data after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(sampleData);
      setLoading(false); // stop loader
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Set postIndex when a date is clicked
  useEffect(() => {
    if (clickedDate && data.length > 0) {
      const clickedPostIndex = checkClickedDateIsPresent(clickedDate, data);
      setPostIndex(clickedPostIndex);
    }
  }, [clickedDate, data]);

  if (loading) {
   // Spinning loader
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-lg font-semibold text-black">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DisplayCalender
        setClickedDate={setClickedDate}
        data={data}
        compareDates={compareDates}
        clickedDate={clickedDate}
      />

      {postIndex !== null && postIndex >= 0 && (
        <PostCarousel
          data={data}
          postIndex={postIndex}
          setPostIndex={setPostIndex}
        />
      )}
    </>
  );
}

export default App;
