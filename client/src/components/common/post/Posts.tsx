import Post from "./Post";
import { useRecoilValue } from "recoil";
import postsState from "../../../global/Posts";

const Posts = () => {
  const posts = useRecoilValue(postsState);

  return (
    <>
      {posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </>
  );
};

export default Posts;
