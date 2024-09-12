import axiosInstance from "../axios";
import CreatePost from "../components/common/post/CreatePost";
import Posts from "../components/common/post/Posts";

const HomePage = () => {
  const getPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts");
      console.log(response);
    } catch (err: any) {
      console.log(err);
    }
  };

  getPosts();

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
