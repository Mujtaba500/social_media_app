import CreatePost from "../components/common/post/CreatePost";
import Posts from "../components/common/post/Posts";
import useGetPosts from "../hooks/useGetPosts";

const HomePage = () => {
  const { posts, loading } = useGetPosts();

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
