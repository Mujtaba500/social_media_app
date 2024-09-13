import useGetPosts from "../../../hooks/useGetPosts";
import Post from "./Post";

const Posts = () => {
  const { posts, loading } = useGetPosts();
  console.log(posts);

  return (
    <>
      {posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </>
  );
};

export default Posts;
