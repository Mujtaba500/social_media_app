import { useState } from "react";
import axiosInstance from "../../axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";

const useEditComment = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postsState);

  const editComment = async (
    postId: string,
    commentId: string,
    body: string
  ) => {
    try {
      setLoading(true);

      const response = await axiosInstance.put(
        `/comment/${commentId}`,
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
          const newComments = post.comments.map((comment) => {
            if (commentId === comment.id) {
              return { ...comment, body: response.data.data.body };
            } else {
              return comment;
            }
          });
          return { ...post, comments: newComments };
        }
        return post;
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

  return { editComment, loading };
};

export default useEditComment;
