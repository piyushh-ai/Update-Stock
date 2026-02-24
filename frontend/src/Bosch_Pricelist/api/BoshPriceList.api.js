import axiosInstance from "../../api/axiosInstance";

export const fetchBoschPriceList = (search = "") => {
  return axiosInstance.get(`/api/boschPriceList`, {
    params: { search },
  });
};

export const fetchBoschPriceData = (id, search, page, limit) => {
  return axiosInstance.get(`/api/boschPriceList/detail/${id}`, {
    params: { search: search, limit: limit, page: page },
  });
};
