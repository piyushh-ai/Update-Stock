import { useEffect, useState } from "react";
import { fetchBoschStock } from "../api/boschStock.api";
import { useBoschStockStore } from "../state/boschStock.store";

export const useBoschStock = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = ""
  } = params;

  const { setBoschStock } = useBoschStockStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchBoschStock({ page, limit, search });
        setBoschStock(data);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [page, limit, search]);

  return { loading, error };
};