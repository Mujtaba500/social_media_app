import Post from "./Post";
import { useRecoilValue } from "recoil";
import postsState from "../../../global/Posts";
import { PostsProps, userPostsProps} from "../../../types";
// import useGetUserPosts from "../../../hooks/Post/useGetUserPosts";
import useGetPosts from "../../../hooks/Post/useGetPosts";

const Posts: React.FC<PostsProps | userPostsProps> = (props) => {
 
  let getPosts: ((id?:string) => void)
  let loading: Boolean 
  let userId: string | undefined


  if('userId' in  props){
    ({userId} = props);
    ({getPosts, loading} =  useGetPosts())
  }else if('getPosts' in props){
    ({getPosts, loading} = props)
  }

  // userId ? posts = useRecoilValue(userPostsState)  :  posts = useRecoilValue(postsState);
 
const posts = useRecoilValue(postsState)


  return (
    <>
      {posts?.map((post) => {
        return <Post post={post} key={post.id}/>;
      })}
      <div className="text-center">
        {posts.length === 0 ? (
          null 
        ) : (
          <button className="btn text-center text-white btn-outline mb-1" onClick={
            () => {
              if(userId){
                // getUserPosts(userId)
                getPosts(userId)
              }else{
                getPosts()
              }
              
            }
           }>{loading! ? "Loading..." : "Load more posts"}</button>
           
        )}
       </div>
    </>
  );
};

export default Posts;
