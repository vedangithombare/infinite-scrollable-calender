import DisplayCalender from "./components/DisplayCalender";
import PostCarousel from "./components/PostCarousel";
import { sampleData } from "./statics/data";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);
  const [postIndex, setPostIndex] = useState(null);
  // if the clicked data is present in the sample data then render the post carousel get the current clicked index
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
      return data.findIndex((post) => {
        let index = compareDates(post.date, clickedDate);
        return index;
      });
    }
  }

  useEffect(() => {
    setData(sampleData);
  }, []);

  useEffect(() => {
    if (clickedDate && data.length > 0) {
      const clickedPostIndex = checkClickedDateIsPresent(clickedDate, data);
      setPostIndex(clickedPostIndex);
    }
  }, [clickedDate, data]);

  return (
    <>
      <DisplayCalender setClickedDate={setClickedDate} />

      {postIndex !== null && postIndex >= 0 && (
        <PostCarousel data={data} postIndex={postIndex} setPostIndex={setPostIndex}  />
      )}
    </>
  );
}

export default App;
