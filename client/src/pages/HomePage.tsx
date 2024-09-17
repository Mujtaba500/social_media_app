import { useRecoilValue } from "recoil";
import CreatePost from "../components/common/post/CreatePost";
import Posts from "../components/common/post/Posts";
import useGetPosts from "../hooks/Post/useGetPosts";
import { useEffect } from "react";
import postsState from "../global/Posts";

const HomePage = () => {
  const { loading, getPosts } = useGetPosts();
  const posts = useRecoilValue(postsState);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <div className="posts w-full h-full ">
        <CreatePost />
        {loading ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <Posts posts={posts} />
        )}
      </div>
    </>
  );
};

export default HomePage;
