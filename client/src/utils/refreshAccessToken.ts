import axiosInstance from "../axios";
import { useNavigateNoUpdates } from "../context/RouterUtils";

const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post(
      "/refresh_token",
      {},
      {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      }
    );

    localStorage.setItem("access_token", response.data.data.token);

    // recursively call
    refreshAccessTokenBg(response.data.data.accessTokenExpiry);
  } catch (err: any) {
    console.log("status: ", err.response.status);
    console.log("Error: ", err.response.data.message);
  }
};

export const refreshAccessTokenBg = (tokenExpiryInMinutes: number) => {
  setTimeout(async () => {
    refreshAccessToken();
  }, 50000);
};

export default refreshAccessToken;
