import React, { useEffect, useState } from "react";
import "../styles/fullBoschStock.scss";
import { useBoschStock } from "../hooks/useBoschStock";
import { useBoschStockStore } from "../state/boschStock.store";
import { useDebounce } from "../hooks/useDebounce";

const FullBoschStock = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { loading, error } = useBoschStock({
    page: page,
    limit: 20,
    search: debouncedSearch,
  });
  const { boschStock } = useBoschStockStore();

  useEffect(() => {
    setPage(1); // Reset to first page on search change
  }, [debouncedSearch]);

  console.log(boschStock);

  return (
    <div className="bosch-container">
      <div className="company-header">
        <div className="company-name">
          <h2 className="page-title">Bosch Stock</h2>
          <p className="page-description">
            LIVE INVENTORY - {boschStock.length} ITEMS SHOWN
          </p>
        </div>

        <div className="input-div">
          <svg className="search-icon" viewBox="0 0 20 20" fill="none">
            <circle
              cx="8.5"
              cy="8.5"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M13 13l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search part number..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="stock-grid">
        {Array.isArray(boschStock) &&
          boschStock.map((item) => (
            <div className="stock-card" key={item._id}>
              <div className="partno">{item.partno}</div>
              <div className="description">{item.description}</div>
            </div>
          ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={boschStock.length < 20} // Disable if less than 20 items (assuming last page)
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FullBoschStock;
