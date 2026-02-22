import axiosInstance from "../../api/axiosInstance";


export const fetchAllSheets = (search = "") => {
  return axiosInstance.get(`/companyStock/sheets`, {
    params: { search },
  });
};

export const fetchStockBySheet = (sheetName, search = "") => {
  return axiosInstance.get(
    `/companyStock/sheets/${sheetName}`,
    {
      params: { search },
    }
  );
};