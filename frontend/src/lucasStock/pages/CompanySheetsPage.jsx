import { useState } from "react";
import { useCompanySheets } from "../hooks/useCompanyStock";
import { Link } from "react-router-dom";
import "../styles/CompanySheetsPage.scss";

// ── Inline SVG icons (no external deps) ─────────────────────────

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const EmptyIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h18M3 12h18M3 17h10" />
  </svg>
);

// ── Skeleton card ────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="csp-skeleton" aria-hidden="true">
    <div className="csp-skeleton__line csp-skeleton__line--short" />
    <div className="csp-skeleton__line csp-skeleton__line--medium" />
    <div className="csp-skeleton__line csp-skeleton__line--long" />
  </div>
);

// ── Main Page ────────────────────────────────────────────────────

const CompanySheetsPage = () => {
  const [search, setSearch] = useState("");
  const { sheets, loading } = useCompanySheets(search);

  return (
    <main className="csp-page" role="main">
      <div className="csp-container">

        {/* ── Glass Header ── */}
        <header className="csp-header">
          <span className="csp-header__eyebrow">Inventory Management</span>
          <h1 className="csp-header__title">Company Sheets</h1>
          <p className="csp-header__subtitle">
            SELECT A SHEET TO VIEW STOCK DETAILS
          </p>
        </header>

        {/* ── Search Input ── */}
        <div className="csp-search">
          <span className="csp-search__icon" aria-hidden="true">
            <SearchIcon />
          </span>
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

        {/* ── Result Meta ── */}
        {!loading && sheets.length > 0 && (
          <div className="csp-meta">
            <span className="csp-meta__count">
              Showing <strong>{sheets.length}</strong> sheet{sheets.length !== 1 ? "s" : ""}
              {search && <> matching <strong>"{search}"</strong></>}
            </span>
            <span className="csp-meta__badge">Inventory</span>
          </div>
        )}

        {/* ── Grid ── */}
        <div className="csp-grid" role="list" aria-label="Company sheets">

          {/* Loading skeletons */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          }

          {/* Empty state */}
          {!loading && sheets.length === 0 && (
            <div className="csp-empty" role="status">
              <div className="csp-empty__icon">
                <EmptyIcon />
              </div>
              <p className="csp-empty__title">No sheets found</p>
              <p className="csp-empty__sub">
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : "No company sheets are available at this time."}
              </p>
            </div>
          )}

          {/* Sheet cards */}
          {!loading &&
            sheets.map((sheet, index) => (
              <Link
                key={sheet}
                to={`/company/${sheet}`}
                className="csp-card"
                role="listitem"
                aria-label={`Open ${sheet} sheet`}
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
                  <p className="csp-card__name">{sheet}</p>
                  <p className="csp-card__sub">View stock details →</p>
                </div>
              </Link>
            ))
          }

        </div>
      </div>
    </main>
  );
};

export default CompanySheetsPage;