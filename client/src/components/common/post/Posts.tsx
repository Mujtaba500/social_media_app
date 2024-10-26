import Post from "./Post";
import { useRecoilValue } from "recoil";
import postsState from "../../../global/Posts";
import { PostsProps, userPostsProps} from "../../../types";
import userPostsState from "../../../global/UserPosts";
import useGetUserPosts from "../../../hooks/Post/useGetUserPosts";

const Posts: React.FC<PostsProps | userPostsProps> = (props) => {
 
  let posts
  let getUserPosts: ((id: string) => void)
  let getPosts: () => void
  let loading: Boolean 
  let userId: string | undefined
  let pageType:string

  ({getUserPosts, loading} = useGetUserPosts())

  if('userId' in  props){
    ({userId} = props)
    pageType = 'ProfilePage'
  }else if('getPosts' in props){
    ({getPosts, loading} = props)
  }

  userId ? posts = useRecoilValue(userPostsState)  :  posts = useRecoilValue(postsState);
 
  return (
    <>
      {posts?.map((post) => {
        return <Post post={post} key={post.id} pageType={pageType}/>;
      })}
      <div className="text-center">
        {posts.length === 0 ? (
          null 
        ) : (
          <button className="btn text-center text-white btn-outline mb-1" onClick={
            () => {
              if(userId){
                getUserPosts(userId)
              }else{
                getPosts()
              }
              
            }
           }>{loading ? "Loading..." : "Load more posts"}</button>
           
        )}
       </div>
    </>
  );
};

export default Posts;
