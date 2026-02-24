import { useEffect, useState } from "react";
import { fetchBoschPriceData, fetchBoschPriceList, fetchPriceData, fetchPriceList } from "../api/BoshPriceList.api";


export const useCompanySheets = (search, params = {}) => {
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { page = 1, limit = 10, search = "", id } = params;

  useEffect(() => {
    async function loadSheets() {
      setLoading(true);
      try {
        const res = await fetchBoschPriceList(search);
        setPriceList(res.data.list || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    loadSheets();
  }, [search]);

  return { sheets, loading };
};

export const useStockBySheet = () => {
  const [stock, setStock] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    async function loadStock() {
      if (!id) return;

      try {
        setLoading(true);
        const res = await fetchBoschPriceData(id, search, page, limit);
        setStock(res.data.detail || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadStock();
  }, [sheetName, search]);

  return { stock, total, loading, error };
};
