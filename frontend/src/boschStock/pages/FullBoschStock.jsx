import React, { useEffect, useState, useRef } from "react";
import "../styles/fullBoschStock.scss";
import { useBoschStock } from "../hooks/useBoschStock";
import { useBoschStockStore } from "../state/boschStock.store";
import { useDebounce } from "../hooks/useDebounce";

/* ─── Helpers ─────────────────────────────────────────────────── */
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
};

const highlight = (text = "", query = "") => {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="hl">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

/* ─── Skeleton card ───────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="stock-card skeleton" aria-hidden="true">
    <div className="sk-line sk-partno" />
    <div className="sk-line sk-name" />
    <div className="sk-row">
      <div className="sk-pill" />
      <div className="sk-pill sk-pill--sm" />
    </div>
    <div className="sk-line sk-date" />
  </div>
);

const SkeletonRow = () => (
  <tr className="skeleton-row" aria-hidden="true">
    {[...Array(7)].map((_, i) => (
      <td key={i}>
        <div className="sk-line" />
      </td>
    ))}
  </tr>
);

/* ─── Empty state ─────────────────────────────────────────────── */
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
    <p className="empty-title">No matching stock found</p>
    {query && (
      <p className="empty-sub">
        No results for <strong>"{query}"</strong> — try a different part number.
      </p>
    )}
  </div>
);

/* ─── Stock Card (mobile) ─────────────────────────────────────── */
const StockCard = ({ item, query, index }) => (
  <div className="stock-card" style={{ animationDelay: `${index * 40}ms` }}>
    <div className="card-header">
      <span className="partno-badge">
        {highlight(item.partno || "—", query)}
      </span>
      <span
        className={`qty-badge ${item.quantity === 0 ? "qty-zero" : item.quantity < 5 ? "qty-low" : "qty-ok"}`}
      >
        Qty: {item.quantity ?? 0}
      </span>
    </div>
    <div className="item-name">{item.itemName || item.description || "—"}</div>
    <div className="item-name">{highlight(item.description || "—", query)}</div>
    <div className="card-meta">
      <span className="meta-chip">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1v6l4 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {item.sheetName || "—"}
      </span>
      <span className="meta-chip">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <rect
            x="2"
            y="3"
            width="12"
            height="11"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5 1v4M11 1v4M2 7h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {formatDate(item.modifiedDate || item.createdAt)}
      </span>
    </div>
    <div className="card-footer">
      <span className="mrp-label">MRP</span>
      <span className="mrp-value">
        {item.mrp != null
          ? `₹${item.mrp}`
          : "—"}
      </span>
      <span className="serial-label">S/N</span>
      <span className="serial-value">{item.sno || "—"}</span>
    </div>
  </div>
);

/* ─── Desktop Table Row ───────────────────────────────────────── */
const TableRow = ({ item, query, index }) => (
  <tr className="table-row" style={{ animationDelay: `${index * 25}ms` }}>
    <td className="td-partno">
      <span className="partno-badge inline">
        {highlight(item.partno || "—", query)}
      </span>
    </td>
    <td className="td-name">{item.itemName || item.description || "—"}</td>
    <td className="td-name">{highlight(item.description || "—", query)}</td>
    <td className="td-qty">
      <span
        className={`qty-badge ${item.quantity === 0 ? "qty-zero" : item.quantity < 5 ? "qty-low" : "qty-ok"}`}
      >
        {item.quantity ?? 0}
      </span>
    </td>
    <td className="td-mrp">
      {item.mrp != null ? (
        `₹${item.mrp}`
      ) : (
        <span className="na">—</span>
      )}
    </td>
    <td className="td-sheet">{item.sheetName || "—"}</td>
    <td className="td-serial">{item.sno || "—"}</td>
    <td className="td-date">
      {formatDate(item.modifiedDate || item.createdAt)}
    </td>
  </tr>
);

/* ─── Main Component ──────────────────────────────────────────── */
const FullBoschStock = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const debouncedSearch = useDebounce(search, 400);

  const { loading, error } = useBoschStock({
    page,
    limit: 20,
    search: debouncedSearch,
  });
  const { boschStock } = useBoschStockStore();

  console.log(boschStock);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const hasData = Array.isArray(boschStock) && boschStock.length > 0;
  const isEmpty = !loading && !error && !hasData;

  return (
    <div className="bosch-container">
      {/* ── Top bar ─────────────────────────── */}
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
            <h2 className="page-title">Bosch Stock</h2>
            <p className="page-subtitle">
              Live inventory · {hasData ? boschStock.length : 0} items shown
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
            placeholder="Search by part number…"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search part number"
          />
          {search && (
            <button
              className="clear-btn"
              onClick={() => {
                setSearch("");
                inputRef.current?.focus();
              }}
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

      {/* ── Error ───────────────────────────── */}
      {error && (
        <div className="error-banner" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 5v4M8 11v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </div>
      )}

      {/* ── Desktop Table ────────────────────── */}
      <div className="table-wrap">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Part No.</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Qty</th>
              <th>MRP</th>
              <th>Sheet</th>
              <th>Serial No.</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              : hasData
                ? boschStock.map((item, i) => (
                    <TableRow
                      key={item._id}
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

      {/* ── Mobile Cards ─────────────────────── */}
      <div className="card-grid">
        {loading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : hasData ? (
          boschStock.map((item, i) => (
            <StockCard
              key={item._id}
              item={item}
              query={debouncedSearch}
              index={i}
            />
          ))
        ) : isEmpty ? (
          <EmptyState query={debouncedSearch} />
        ) : null}
      </div>

      {/* ── Pagination ───────────────────────── */}
      {!loading && hasData && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
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
            onClick={() => setPage((p) => p + 1)}
            disabled={boschStock.length < 20}
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

export default FullBoschStock;
