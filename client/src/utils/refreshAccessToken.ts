import axiosInstance from "../axios";

const refreshAccessToken = (tokenExpiryInMinutes: number) => {
  setTimeout(async () => {
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
      refreshAccessToken(response.data.data.accessTokenExpiry);
    } catch (err: any) {
      console.log("status: ", err.response.status);
      console.log("Error: ", err.response.data.message);
    }
  }, 50000);
};

export default refreshAccessToken;
