import Post from "./Post";
import { useRecoilValue } from "recoil";
import postsState from "../../../global/Posts";
import { PostsProps } from "../../../types";

const Posts: React.FC<PostsProps> = ({getPosts, loading}) => {
  const posts = useRecoilValue(postsState);
  return (
    <>
      {posts?.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
      <div className="text-center">
        {posts.length === 0 ? (
          null 
        ) : (
          <button className="btn text-center text-white btn-outline mb-1" onClick={
            () => {
              getPosts()
            }
           }>{loading ? "Loading..." : "Load more posts"}</button>
           
        )}
       </div>
    </>
  );
};

export default Posts;
