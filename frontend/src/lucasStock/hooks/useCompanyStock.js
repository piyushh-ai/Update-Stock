import { useEffect, useState } from "react";
import { fetchAllSheets, fetchStockBySheet } from "../api/companyStock.api";

export const useCompanySheets = (search) => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSheets() {
      setLoading(true);
      try {
        const res = await fetchAllSheets(search);
        setSheets(res.data.sheetData || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    loadSheets();
  }, [search]);

  return { sheets, loading };
};

export const useStockBySheet = (params = {}) => {
  const [stock, setStock] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { page = 1, limit = 10, search = "", sheetName } = params;

  useEffect(() => {
    async function loadStock() {
      if (!sheetName) return;

      try {
        setLoading(true);
        const res = await fetchStockBySheet(sheetName, search, page, limit);
        setStock(res.data.stockBySheet || []);
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
