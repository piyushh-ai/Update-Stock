import { create } from "zustand";

export const useBoschStockStore = create((set) => ({
  boschStock: [],
  total: 0,
  setBoschStock: (data) =>
    set({
      boschStock: data.boschStock,
      total: data.total,
    }),
}));