import { useState } from "react";
import axiosInstance from "../../axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";
import userPostsState from "../../global/UserPosts";

const useDeletePost = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postsState);

  const [userPosts, setUserPosts] = useRecoilState(userPostsState)

  const deletePost = async (postId: string, pageType?:string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/post/${postId}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      toast.success(response.data.message);
      
      if(pageType === 'ProfilePage'){
        const newPosts = userPosts.filter((post) => post.id !== postId);
        setUserPosts(newPosts) 
      }else {
        const newPosts = posts.filter((post) => post.id !== postId);
        setPosts(newPosts);
      }
      
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data?.message);
      toast.error(err.response.data.message);
    }
  };

  return { deletePost, loading };
};

export default useDeletePost;
