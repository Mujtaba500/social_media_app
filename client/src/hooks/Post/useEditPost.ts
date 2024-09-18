import { useState } from "react";
import axiosInstance from "../../axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useEditPost = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postsState);

  const editPost = async (postId: string, values: FormData) => {
    try {
      setLoading(true);

      const response = await axiosInstance.put(`/post/${postId}`, values, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);

      let newPosts = [...posts];
      const index = newPosts.findIndex((post) => post.id === postId);
      newPosts[index] = response.data.data;
      setPosts(newPosts);
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data?.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { editPost, loading };
};

export default useEditPost;
