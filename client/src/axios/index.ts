import axios from "axios";

const stage = import.meta.env.MODE;

let baseURL;

if (stage === "production") {
  baseURL = `http://${process.env.BACKEND_URL}/api/v1`;
} else if (stage === "development") {
  baseURL = "http://localhost:4000/api/v1";
}

const axiosInstance = axios.create({
  baseURL: `${baseURL}`,
  timeout: 10000,
  headers: {
    Authorization: localStorage.getItem("access_token")!,
    "X-Custom-Header": "foobar",
  },
  withCredentials: true,
});

export default axiosInstance;
