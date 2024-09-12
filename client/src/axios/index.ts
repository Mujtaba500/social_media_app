import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: { "X-Custom-Header": "foobar" },
  withCredentials: true,
});

export default axiosInstance;
