import { useState } from "react";
import axiosInstance from "../../axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useDeleteComment = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postsState);

  const deleteComment = async (commentId: string, postId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/comment/${commentId}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      toast.success(response.data.message);
      let newPosts = [...posts];
      newPosts = newPosts.map((post) => {
        if (post.id === postId) {
          const newComments = post.comments.filter(
            (comment) => comment.id !== commentId
          );
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
    }
  };

  return { deleteComment, loading };
};

export default useDeleteComment;
