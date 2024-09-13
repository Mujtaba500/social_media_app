import { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { Post } from "../types";

const useGetPosts = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/posts", {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        });
        setPosts(response.data.data);
        console.log(response);
      } catch (err: any) {
        console.log("status: ", err.response.status);
        console.log("Error: ", err.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  return { posts, loading };
};

export default useGetPosts;
