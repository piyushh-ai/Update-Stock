import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://bkstockserver.onrender.com/api",
  timeout: 10000,
});

export default axiosInstance;