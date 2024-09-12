import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    Authorization: localStorage.getItem("access_token")!,
    "X-Custom-Header": "foobar",
  },
  withCredentials: true,
});

export default axiosInstance;
