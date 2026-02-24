import React, { useEffect, useState } from "react";
import {
  ArrowIcon,
  EmptyIcon,
  SkeletonCard,
} from "../../lucasStock/pages/CompanySheetsPage";
import "../styles/BoschPriceList.scss";
import { fetchBoschPriceList } from "../api/BoshPriceList.api";
import { useDebounce } from "../../boschStock/hooks/useDebounce";
import { usePriceListData } from "../hooks/BoshPriceList";

const BoschPriceList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debounseSearch = useDebounce(search);

  const { priceList, loading } = usePriceListData({
    page,
    limit: 10,
    search: debounseSearch,
  });

  

  useEffect(() => {
    setPage(1);
  }, [debounseSearch]);

  return (
    <main className="csp-page" role="main">
      <div className="csp-container">
        {/* ── Glass Header ── */}
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
              <h2 className="page-title">Bosch Price List</h2>
              <p className="page-subtitle">
                SELECT A PART NUMBER TO VIEW PRICE DETAILS
              </p>
            </div>
          </div>

          {/* Search */}
          <div className={`search-wrap `}>
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
              className="csp-search__input"
              type="search"
              placeholder="Search company sheets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search company sheets"
              autoComplete="off"
            />
          </div>
        </div>

        {/* ── Result Meta ── */}
        {!loading && priceList.length > 0 && (
          <div className="csp-meta">
            <span className="csp-meta__count">
              Showing <strong>{priceList.length}</strong> sheet
              {priceList.length !== 1 ? "s" : ""}
              {search && (
                <>
                  {" "}
                  matching <strong>"{search}"</strong>
                </>
              )}
            </span>
            <span className="csp-meta__badge">Inventory</span>
          </div>
        )}

        {/* ── Grid ── */}
        <div className="csp-grid" role="list" aria-label="Company sheets">
          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {/* Empty state */}
          {!loading && priceList.length === 0 && (
            <div className="csp-empty" role="status">
              <div className="csp-empty__icon">
                <EmptyIcon />
              </div>
              <p className="csp-empty__title">No Data found</p>
              <p className="csp-empty__sub">
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : "No company Data are available at this time."}
              </p>
            </div>
          )}

          {/* Sheet cards */}
          {!loading &&
            priceList.map((list, index) => (
              <Link
                key={sheet}
                // to={`/company/${sheet}`}
                className="csp-card"
                role="listitem"
                // aria-label={`Open ${sheet} sheet`}
              >
                <div className="csp-card__header">
                  <span className="csp-card__index">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="csp-card__arrow">
                    <ArrowIcon />
                  </span>
                </div>
                <div className="csp-card__body">
                  <p className="csp-card__name">{list.materialNo}</p>
                  <p className="csp-card__name">{list.materialDesc}</p>
                  <p className="csp-card__sub">View Price details →</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
 
  );
};

export default BoschPriceList;
