import { useState } from "react";
import axiosInstance from "../../axios";

import { useSetRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useGetPosts = () => {
  const [loading, setLoading] = useState(false);
  const setPosts = useSetRecoilState(postsState);

  const getPosts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/posts", {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      console.log(response);
      setPosts(response.data.data);
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { getPosts, loading };
};

export default useGetPosts;
