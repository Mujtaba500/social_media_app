import CreatePost from "../components/common/post/CreatePost";
import Posts from "../components/common/post/Posts";
import useGetPosts from "../hooks/Post/useGetPosts";
import { useEffect } from "react";

const HomePage = () => {
  const { initloading, getPosts, loading} =  useGetPosts();

  // const params = useParams()
  // console.log(params);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <div className="posts w-full h-full ">
        <CreatePost />
        {initloading ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <Posts getPosts={getPosts} loading={loading}/>
        )}
        {/* <Posts /> */}
      </div>
    </>
  );
};

export default HomePage;
