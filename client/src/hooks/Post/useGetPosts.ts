import { useState, useRef } from "react";
import axiosInstance from "../../axios";

import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useGetPosts = () => {
  const [initloading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useRecoilState(postsState);
  let offsetCount = useRef(0)
  let userId= useRef< string | null>(null)

  const getPosts = async (id?: string) => {
    try {
      // On initial render set initLoading to true 
      offsetCount.current === 0 ? setInitLoading(true) : setLoading(true)
      if(id && offsetCount.current === 0){
        offsetCount.current = 1
      }
      let offset = offsetCount.current * 5
      let pathname :string
      if(id && userId.current !== id){
        userId.current = id
        offsetCount.current = 1
      }   
      id ? pathname = `/posts/${id}?offset=${offset}` : pathname = `/posts?offset=${offset}`
      const response = await axiosInstance.get(pathname, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      if(offsetCount.current === 0){
        setPosts(response.data.data)
      }else{
        const newPosts = [...posts, ...response.data.data]
        setPosts(newPosts);
      }
      
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data.message);
    } finally {
      setInitLoading(false)
      setLoading(false)      
      offsetCount.current++
      
    }
  };

  return { getPosts,  initloading , loading};
};

export default useGetPosts;
