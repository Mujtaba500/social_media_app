import useGetPosts from "../../../hooks/useGetPosts";
import Post from "./Post";
import { PostsProps } from "../../../types";

const Posts: React.FC<PostsProps> = ({ posts }) => {
  return (
    <>
      {posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </>
  );
};

export default Posts;
