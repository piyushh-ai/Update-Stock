// BoschFilter.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCatalogues } from "../../../hooks/cataloguesHook.js";
import "../../Bosch_filter/styles/BoschFIlter.scss";

/* ────────────────────────────────────────────────────────────────
   HELPER FUNCTIONS
   ──────────────────────────────────────────────────────────────── */

const highlight = (text, query = "") => {
  const safeText = String(text ?? ""); // force string
  const safeQuery = String(query ?? "");

  if (!safeQuery.trim()) return safeText;

  const lowerText = safeText.toLowerCase();
  const lowerQuery = safeQuery.toLowerCase();

  const idx = lowerText.indexOf(lowerQuery);
  if (idx === -1) return safeText;

  return (
    <>
      {safeText.slice(0, idx)}
      <mark className="hl">
        {safeText.slice(idx, idx + safeQuery.length)}
      </mark>
      {safeText.slice(idx + safeQuery.length)}
    </>
  );
};

/* ────────────────────────────────────────────────────────────────
   SKELETON COMPONENTS
   ──────────────────────────────────────────────────────────────── */

const SkeletonCard = () => (
  <div className="filter-card skeleton" aria-hidden="true">
    <div className="sk-line sk-partno" />
    <div className="sk-line sk-title" />
    <div className="sk-row">
      <div className="sk-pill" />
      <div className="sk-pill sk-pill--sm" />
    </div>
    <div className="sk-line sk-text" />
  </div>
);

const SkeletonRow = () => (
  <tr className="skeleton-row" aria-hidden="true">
    {[...Array(5)].map((_, i) => (
      <td key={i}>
        <div className="sk-line" />
      </td>
    ))}
  </tr>
);

/* ────────────────────────────────────────────────────────────────
   EMPTY STATE
   ──────────────────────────────────────────────────────────────── */

const EmptyState = ({ query }) => (
  <div className="empty-state">
    <svg
      className="empty-icon"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="52"
        cy="52"
        r="36"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeDasharray="6 4"
        opacity="0.4"
      />
      <circle
        cx="52"
        cy="52"
        r="22"
        fill="var(--color-accent-subtle)"
        opacity="0.5"
      />
      <line
        x1="80"
        y1="80"
        x2="104"
        y2="104"
        stroke="var(--color-accent)"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M44 52h16M52 44v16"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      <circle cx="94" cy="26" r="4" fill="var(--color-accent)" opacity="0.2" />
      <circle cx="18" cy="88" r="3" fill="var(--color-accent)" opacity="0.15" />
      <circle
        cx="106"
        cy="60"
        r="2.5"
        fill="var(--color-accent)"
        opacity="0.2"
      />
    </svg>
    <p className="empty-title">No matching filters found</p>
    {query && (
      <p className="empty-sub">
        No results for <strong>"{query}"</strong> — try a different search.
      </p>
    )}
  </div>
);

/* ────────────────────────────────────────────────────────────────
   DESKTOP TABLE ROW
   ──────────────────────────────────────────────────────────────── */

const TableRow = ({ item, query, index }) => (
  <tr className="table-row" style={{ animationDelay: `${index * 25}ms` }}>
    <td className="td-partno">
      <span className="partno-badge inline">
        {highlight(item.PARTNO || "—", query)}
      </span>
    </td>
    <td className="td-filter">{item.ITEMS || "—"}</td>
    <td className="td-brand">{item.brand || "—"}</td>
    <td className="td-app">{highlight(item.DESCRIPTION || "—", query)}</td>
    <td className="td-status">
      <span className={`qty-badge qty-ok`}>Active</span>
    </td>
  </tr>
);

/* ────────────────────────────────────────────────────────────────
   MOBILE FILTER CARD
   ──────────────────────────────────────────────────────────────── */

const FilterCard = ({ item, query, index }) => (
  <div className="filter-card" style={{ animationDelay: `${index * 40}ms` }}>
    <div className="card-header">
      <span className="partno-badge">
        {highlight(item.PARTNO || "—", query)}
      </span>
      <span className="filter-type-badge">{item.ITEMS || "—"}</span>
    </div>

    <div className="card-title">{item.brand || "—"}</div>

    <div className="card-desc">
      {highlight(item.DESCRIPTION || "—", query)}
    </div>

    <div className="card-footer">
      <span className="footer-label">Type</span>
      <span className="footer-value">{item.ITEMS || "—"}</span>
      <span className="footer-label">Brand</span>
      <span className="footer-value">Bosch CV</span>
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────────────────────── */

const BoschCV = () => {
  const { company } = useParams();
  
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, loading } = useCatalogues({
    page,
    limit: 10,
    search: debouncedSearch,
    company,    
  });
console.log(data);

  /* Debounced search handler */
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  }, []);

  /* Clear search */
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(1);
    inputRef.current?.focus();
  }, []);

  /* Pagination */
  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const handleNextPage = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  /* Cleanup */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /* Derived states */
  const finalData = data?.boschFilters || [];
  const hasData = finalData.length > 0;
  const isEmpty = !loading && !hasData;

  /* ────────────────────────────────────────────────────────────────
     RENDER
     ──────────────────────────────────────────────────────────────── */

  return (
    <div className="bosch-container">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="top-bar">
        <div className="title-group">
          <svg className="title-icon" viewBox="0 0 32 32" fill="none">
            <rect
              x="2"
              y="6"
              width="28"
              height="20"
              rx="4"
              fill="var(--color-primary)"
              opacity="0.12"
            />
            <rect
              x="2"
              y="6"
              width="28"
              height="20"
              rx="4"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
            />
            <path
              d="M8 12h16M8 17h10M8 22h6"
              stroke="var(--color-accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle
              cx="26"
              cy="22"
              r="5"
              fill="var(--color-accent)"
              opacity="0.15"
            />
            <circle
              cx="26"
              cy="22"
              r="3"
              fill="var(--color-accent)"
              opacity="0.4"
            />
          </svg>
          <div>
            <h2 className="page-title">Bosch PC Filters</h2>
            <p className="page-subtitle">
              {hasData
                ? `${finalData.length} filter${finalData.length !== 1 ? "s" : ""} available`
                : "Bosch automotive filters"}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className={`search-wrap ${focused ? "search-wrap--focused" : ""}`}>
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
            ref={inputRef}
            type="text"
            placeholder="Search by part number or brand…"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search filters"
          />
          {searchQuery && (
            <button
              className="clear-btn"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                <path
                  d="M3 3l10 10M13 3L3 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop Table ──────────────────────────────────────────── */}
      <div className="table-wrap">
        <table className="filter-table">
          <thead>
            <tr>
              <th>Part No.</th>
              <th>Filter Type</th>
              <th>Brand</th>
              <th>Application</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              : hasData
                ? finalData.map((item, i) => (
                    <TableRow
                      key={item.id}
                      item={item}
                      query={debouncedSearch}
                      index={i}
                    />
                  ))
                : null}
          </tbody>
        </table>
        {isEmpty && <EmptyState query={debouncedSearch} />}
      </div>

      {/* ── Mobile Cards ───────────────────────────────────────────── */}
      <div className="card-grid">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : hasData ? (
          finalData.map((item, i) => (
            <FilterCard
              key={item.id}
              item={item}
              query={debouncedSearch}
              index={i}
            />
          ))
        ) : isEmpty ? (
          <EmptyState query={debouncedSearch} />
        ) : null}
      </div>

      {/* ── Pagination ─────────────────────────────────────────────── */}
      {!loading && hasData && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={handlePreviousPage}
            disabled={page === 1}
            aria-label="Go to previous page"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Prev
          </button>
          <span className="page-indicator">Page {page}</span>
          <button
            className="page-btn"
            onClick={handleNextPage}
            disabled={finalData.length < 10}
            aria-label="Go to next page"
          >
            Next
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default BoschCV;