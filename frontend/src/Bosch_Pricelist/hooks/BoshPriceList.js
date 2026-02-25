import { useEffect, useState } from "react";
import {
  fetchBoschPriceData,
  fetchBoschPriceList,
} from "../api/BoshPriceList.api";

export const usePriceListData = (params = {}) => {
  const [priceList, setPriceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { page = 1, limit = 10, search = "", id } = params;

  useEffect(() => {
    async function loadSheets() {
      setLoading(true);
      try {
        const res = await fetchBoschPriceList({ search, page, limit });
        setPriceList(res.data.list || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    loadSheets();
  }, [search, page, limit]);

  return { priceList, loading };
};

export const usePriceDetails = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const result = await fetchBoschPriceData(id);
        setData(result.detail);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getData()
  }, [id]);

  return {data, loading}
};
