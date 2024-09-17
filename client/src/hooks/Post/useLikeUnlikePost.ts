import { useState } from "react";
import axiosInstance from "../../axios";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import postsState from "../../global/Posts";
import { useAuthContext } from "../../context/authContext";

const useLikeUnlikePost = () => {
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useRecoilState(postsState);

  const { authUser } = useAuthContext();

  const likeUnlikePost = async (postId: string) => {
    try {
      // let newPosts = [...posts];
      // const index = newPosts.findIndex((post) => post.id === postId);

      // if (newPosts[index].likes.includes(authUser!.id)) {
      //   const indexLike = newPosts[index].likes.findIndex(
      //     (id) => id === authUser!.id
      //   );
      //   console.log("like", indexLike);
      //   const likes = newPosts[index].likes;
      //   likes.splice(indexLike, 1);
      //   setPosts(newPosts);
      // } else {
      //   newPosts[index].likes.push(authUser!.id);
      // }

      setLoading(true);
      const response = await axiosInstance.put(`/post/like/${postId}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });

      toast.success(response.data.message);
      setPosts((prevPosts) => {
        let newPosts = [...prevPosts];
        const index = newPosts.findIndex((post) => post.id === postId);
        newPosts[index] = response.data.data;
        return newPosts;
      });
      //   newPosts[index] = response.data.data;

      //   setPosts(newPosts);
    } catch (err: any) {
      console.log(err);
      console.log("status: ", err.response?.status);
      console.log("Error: ", err.response?.data?.message);
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { likeUnlikePost, loading };
};

export default useLikeUnlikePost;
