import CreatePost from "../components/common/post/CreatePost";
import Posts from "../components/common/post/Posts";

const HomePage = () => {
  return (
    <>
      <div className="posts w-full h-full">
        <CreatePost />
        <Posts />
      </div>
    </>
  );
};

export default HomePage;
