import axiosInstance from "../axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/authContext";
import { AuthUserType } from "../types";

const useDeletePhoto = () => {
  const [loading, setLoading] = useState(false);

  const [imageType, setImageType] = useState("");

  const { authUser, setAuthUser } = useAuthContext();

  const deletePhoto = async (image: string) => {
    try {
      setLoading(true);
      setImageType(image);

      const response = await axiosInstance.delete(`/user/${image}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      toast.success(response.data.message);

      let newUser: AuthUserType;
      if (image === "profilepic") {
        newUser = {
          id: authUser!.id,
          fullName: authUser!.fullName,
          username: authUser!.username,
          profilepic: null,
        };
        setAuthUser(newUser);
      }
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { deletePhoto, loading, imageType };
};

export default useDeletePhoto;
