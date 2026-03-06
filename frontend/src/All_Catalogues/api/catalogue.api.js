import axiosInstance from "../../api/axiosInstance";

export const fetchAllCatalogues = async ({ page, limit, search, company }) => {
  const apiMap = {
    Bosch_PC_Filter: "/bosch-filters",
    Autolek_FIlter: "/autolek-filters",
    Bosch_PC_Starter: "/bosch-electric-cat/starter",
    Bosch_PC_Alternator: "/bosch-electric-cat/alternator",
    RMP_Bearings_Catalogues: "/rmpCat",
    Bosch_CV_Filter: "/bosch-filters/cv",
  };

  const endpoint = apiMap[company];

  if (!endpoint) {
    throw new Error("Invalid catalogue type");
  }
  const response = await axiosInstance.get(endpoint, {
    params: {
      page: page,
      limit: limit,
      search: search,
    },
  });

  return response.data;
};
