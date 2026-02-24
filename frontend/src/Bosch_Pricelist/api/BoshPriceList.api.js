import axiosInstance from "../../api/axiosInstance";

export const fetchBoschPriceList = ({page, limit, search}) => {
  return axiosInstance.get(`/boschPriceList`, {
    params: { search, page, limit },
  });
  
};

// export const fetchBoschPriceData = (id, search, page, limit) => {
//   return axiosInstance.get(`/api/boschPriceList/detail/${id}`, {
//     params: { search: search, limit: limit, page: page },
//   });
// };
