import { useEffect, useState } from "react";
import { fetchAllCatalogues } from "../api/catalogue.api";

export const useCatalogues = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    company
  } = params;

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCatalogues({ page, limit, search, company });
        setData(data);
        
        
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [page, limit, search, company]);

  return { loading, error, data };
};