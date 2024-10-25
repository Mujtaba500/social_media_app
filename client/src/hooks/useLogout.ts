import axiosInstance from "../axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext";
import { useSetRecoilState } from "recoil";
import postsState from "../global/Posts";

const useLogout = () => {
  const { setAuthUser } = useAuthContext();
  const setPosts = useSetRecoilState(postsState)

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      localStorage.setItem("access_token", "");
      toast.success(response.data.message);
      setAuthUser(null);
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setPosts([])
    }
  };

  return logout;
};

export default useLogout;
