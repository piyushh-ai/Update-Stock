import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://update-stock-jnfp.onrender.com/api",
  timeout: 10000,
});

export default axiosInstance;