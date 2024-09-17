import { useState } from "react";
import axiosInstance from "../axios";
import toast from "react-hot-toast";
import useGetPosts from "./useGetPosts";
import { useRecoilState } from "recoil";
import postsState from "../global/Posts";

const useCreatePost = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postsState);

  // const { getPosts } = useGetPosts();

  const createPost = async (values: FormData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/post", values, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      const newPosts = [response.data.data, ...posts];
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

  return { createPost, loading };
};

export default useCreatePost;
