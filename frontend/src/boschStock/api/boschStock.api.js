import axiosInstance from "../../api/axiosInstance";

export const fetchBoschStock = async ({ page, limit, search }) => {
  const response = await axiosInstance.get("/boschStock", {
    params: {
      page: page,
      limit: limit,
      search: search,
    },
  });

  return response.data;
};
