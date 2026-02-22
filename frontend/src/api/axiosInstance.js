import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://update-stock.vercel.app/",
  timeout: 10000,
});

export default axiosInstance;