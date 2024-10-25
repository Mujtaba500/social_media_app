import { useState, useRef } from "react";
import axiosInstance from "../../axios";

import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useGetPosts = () => {
  const [initloading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useRecoilState(postsState);
  let offsetCount = useRef(0)

  const getPosts = async () => {
    try {
      // On initial render set initLoading to true 
      posts.length === 0 ? setInitLoading(true) : setLoading(true)
      
      let offset = offsetCount.current * 5
      const response = await axiosInstance.get(`/posts?offset=${offset}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      const newPosts = [...posts, ...response.data.data]
      setPosts(newPosts);
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data.message);
    } finally {
      setInitLoading(false)
      setLoading(false)      
      offsetCount.current++
      console.log(offsetCount);
    }
  };

  return { getPosts,  initloading , loading};
};

export default useGetPosts;
