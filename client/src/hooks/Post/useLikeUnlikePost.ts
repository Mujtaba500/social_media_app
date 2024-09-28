import { useState } from "react";
import axiosInstance from "../../axios";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useLikeUnlikePost = () => {
  const [loading, setLoading] = useState(false);

  const setPosts = useSetRecoilState(postsState);

  const likeUnlikePost = async (postId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/post/like/${postId}`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        }
      );

      toast.success(response.data.message);
      setPosts((prevPosts) => {
        let newPosts = [...prevPosts];
        const index = newPosts.findIndex((post) => post.id === postId);
        newPosts[index] = response.data.data;
        return newPosts;
      });
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data?.message);
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { likeUnlikePost, loading };
};

export default useLikeUnlikePost;
