import { useState, useRef } from "react";
import axiosInstance from "../../axios";

import { useRecoilState } from "recoil";
import userPostsState from "../../global/UserPosts";

const useGetUserPosts = () => {
  const [loading, setLoading] = useState(false)
  const [userPosts, setUserPosts] = useRecoilState(userPostsState);
  let offsetCount = useRef(1) 
  let userId= useRef< string | null>(null)

  const getUserPosts = async (id: string) => {
    try {
      setLoading(true)
      if(userId.current !== id){
        userId.current = id
        offsetCount.current = 1
      }     
      

      let offset = offsetCount.current * 5
      const response = await axiosInstance.get(`/posts/${id}?offset=${offset}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      const newPosts = [...userPosts, ...response.data.data]
      setUserPosts(newPosts);
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data.message);
    } finally {
      
      setLoading(false)      
      offsetCount.current++
    }
  };

  return { getUserPosts,  loading};
};

export default useGetUserPosts;
