import axiosInstance from "../../api/axiosInstance";

export const fetchBoschPriceList = ({ page, limit, search }) => {
  return axiosInstance.get(`/boschPriceList`, {
    params: { search, page, limit },
  });
};

export const fetchBoschPriceData = async (id) => {
  const response = await axiosInstance.get(`/boschPriceList/detail/${id}`);

  return response.data
};
