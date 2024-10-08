import { useState } from "react";
import axiosInstance from "../../axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useCreateComment = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postsState);

  const createComment = async (body: string, postId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `/comment/${postId}`,
        { body },
        {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        }
      );
      toast.success(response.data.message);

      let newPosts = [...posts];

      newPosts = newPosts.map((post) => {
        if (post.id === postId) {
          let newComments = [...post.comments, response.data.data];
          return { ...post, comments: newComments };
        } else {
          return post;
        }
      });

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

  return { createComment, loading };
};

export default useCreateComment;
