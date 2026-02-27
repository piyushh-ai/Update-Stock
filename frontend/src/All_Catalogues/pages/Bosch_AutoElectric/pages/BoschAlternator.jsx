// BoschAlternator.jsx — Enhanced with Detail Modal for Alternators
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCatalogues } from "../../../hooks/cataloguesHook.js";
import "../styles/BoschStarter.scss";

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
      <mark className="hl">{safeText.slice(idx, idx + safeQuery.length)}</mark>
      {safeText.slice(idx + safeQuery.length)}
    </>
  );
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString || "—";
  }
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

const SkeletonDetailModal = () => (
  <div className="detail-modal-skeleton" aria-hidden="true">
    <div className="detail-header-sk">
      <div className="sk-badge" />
      <div className="sk-title-lg" />
      <div className="sk-subtitle" />
    </div>
    <div className="detail-sections-sk">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="detail-section-sk">
          <div className="sk-section-title" />
          {[...Array(3)].map((_, j) => (
            <div key={j} className="sk-row-detail">
              <div className="sk-label" />
              <div className="sk-value" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
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
    <p className="empty-title">No matching alternators found</p>
    {query && (
      <p className="empty-sub">
        No results for <strong>"{query}"</strong> — try a different search.
      </p>
    )}
  </div>
);

/* ────────────────────────────────────────────────────────────────
   DETAIL MODAL (Desktop & Mobile)
   ──────────────────────────────────────────────────────────────── */

const DetailModal = ({ item, isOpen, onClose, loading }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <SkeletonDetailModal />
        </div>
      </div>
    );
  }

  const data = item;

  // Section groupings for ALTERNATOR detail modal
  const coreInfo = [
    { label: "Bosch Part No.", value: data.BoschPartNo || "—", badge: true },
    { label: "OE Part No.", value: data.OEPartNo || "—", badge: true },
    { label: "Brand", value: data.brandName || "—" },
    { label: "Type", value: data.type || "—" },
    { label: "Segment", value: data.segment || "—" },
  ];

  // ALTERNATOR-SPECIFIC COMPONENTS
  const alternatorComp = [
    { label: "DEF", value: data.DEF || "—", badge: true },
    { label: "SREC", value: data.SREC || "—", badge: true },
    { label: "Rotor", value: data.rotor || "—", badge: true },
    { label: "Stator", value: data.stator || "—", badge: true },
    { label: "Pulley", value: data.pulley || "—", badge: true },
    { label: "Rectifier", value: data.rectifier || "—", badge: true },
  ];

  // BEARINGS & ELECTRICAL FOR ALTERNATOR
  const bearingElec = [
    { label: "Bearing DEF", value: data.bearingDEF || "—", badge: true },
    { label: "Bearing SREC", value: data.bearingSREC || "—", badge: true },
    { label: "Regulator", value: data.regulator || "—", badge: true },
    { label: "Vacuum Pump", value: data.vaccumPump || "—" },
  ];

  const systemMeta = [
    { label: "Vehicle Manufacturer", value: data.vehManufacturer || "—" },
    { label: "Serial Number", value: data.sno || "—" },
    { label: "Product ID", value: data._id || "—" },
    { label: "Created", value: formatDate(data.createdAt) },
    { label: "Updated", value: formatDate(data.updatedAt) },
  ];

  const appText = data.application?.replace(/\r\n/g, " • ") || "—";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Modal Header (Desktop) */}
        <div className="modal-header-desktop">
          <div className="modal-icon">
            <svg viewBox="0 0 64 64" fill="none">
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="var(--color-accent-subtle)"
                opacity="0.5"
              />
              <circle cx="32" cy="32" r="18" stroke="var(--color-accent)" strokeWidth="2" />
              <path
                d="M32 16v32M16 32h32M24 24l16 16M40 24l-16 16"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="modal-header-info">
            <div className="modal-partno">{data.BoschPartNo || "—"}</div>
            <h2 className="modal-title">{data.brandName || "—"}</h2>
            <p className="modal-app">{appText}</p>
          </div>
        </div>

        {/* Modal Header (Mobile) */}
        <div className="modal-header-mobile">
          <div className="modal-badge-mobile">{data.BoschPartNo || "—"}</div>
          <h2 className="modal-title-mobile">{data.brandName || "—"}</h2>
          <p className="modal-type-mobile">{data.type || "—"}</p>
          <p className="modal-app-mobile">{appText}</p>
        </div>

        {/* Modal Sections */}
        <div className="modal-sections">
          {/* Desktop: Grid Layout */}
          <div className="modal-sections-desktop">
            <DetailSection title="Core Information" items={coreInfo} />
            <DetailSection title="Alternator Components" items={alternatorComp} />
            <DetailSection title="Bearings & Electrical" items={bearingElec} />
            <DetailSection title="System Metadata" items={systemMeta} />
          </div>

          {/* Mobile: Accordion Layout */}
          <div className="modal-sections-mobile">
            <AccordionSection
              title="Core Information"
              items={coreInfo}
              isOpen={expandedSection === 0}
              onToggle={() => setExpandedSection(expandedSection === 0 ? null : 0)}
            />
            <AccordionSection
              title="Alternator Components"
              items={alternatorComp}
              isOpen={expandedSection === 1}
              onToggle={() => setExpandedSection(expandedSection === 1 ? null : 1)}
            />
            <AccordionSection
              title="Bearings & Electrical"
              items={bearingElec}
              isOpen={expandedSection === 2}
              onToggle={() => setExpandedSection(expandedSection === 2 ? null : 2)}
            />
            <AccordionSection
              title="System Metadata"
              items={systemMeta}
              isOpen={expandedSection === 3}
              onToggle={() => setExpandedSection(expandedSection === 3 ? null : 3)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────
   DETAIL SECTION (Desktop)
   ──────────────────────────────────────────────────────────────── */

const DetailSection = ({ title, items }) => (
  <div className="detail-section-modal">
    <h3 className="detail-section-title">{title}</h3>
    <div className="detail-divider" />
    <div className="detail-items">
      {items.map((item, idx) => (
        <div key={idx} className="detail-item">
          <span className="detail-item-label">{item.label}</span>
          <span className="detail-item-value">
            {item.badge ? (
              <span className="detail-badge">{item.value}</span>
            ) : (
              item.value
            )}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   ACCORDION SECTION (Mobile)
   ──────────────────────────────────────────────────────────────── */

const AccordionSection = ({ title, items, isOpen, onToggle }) => (
  <div className="accordion-section-modal">
    <button
      className={`accordion-header-modal ${isOpen ? "open" : ""}`}
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span>{title}</span>
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
    {isOpen && (
      <div className="accordion-content-modal">
        {items.map((item, idx) => (
          <div key={idx} className="accordion-item-modal">
            <span className="accordion-label">{item.label}</span>
            <span className="accordion-value">
              {item.badge ? (
                <span className="accordion-badge">{item.value}</span>
              ) : (
                item.value
              )}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ────────────────────────────────────────────────────────────────
   DESKTOP TABLE ROW
   ──────────────────────────────────────────────────────────────── */

const TableRow = ({ item, query, index, onRowClick }) => (
  <tr
    className="table-row table-row--clickable"
    style={{ animationDelay: `${index * 25}ms` }}
    onClick={() => onRowClick(item)}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onRowClick(item);
      }
    }}
  >
    <td className="td-partno">
      <span className="partno-badge inline">
        {highlight(item.BoschPartNo || "—", query)}
      </span>
    </td>
    <td className="td-filter">{item.type || "—"}</td>
    <td className="td-brand">{item.brandName || "—"}</td>
    <td className="td-app">{highlight(item.application || "—", query)}</td>
    <td className="td-status">
      <span className={`qty-badge qty-ok`}>Active</span>
    </td>
  </tr>
);

/* ────────────────────────────────────────────────────────────────
   MOBILE FILTER CARD
   ──────────────────────────────────────────────────────────────── */

const FilterCard = ({ item, query, index, onCardClick }) => (
  <div
    className="filter-card filter-card--clickable"
    style={{ animationDelay: `${index * 40}ms` }}
    onClick={() => onCardClick(item)}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onCardClick(item);
      }
    }}
  >
    <div className="card-header">
      <span className="partno-badge">
        {highlight(item.BoschPartNo || "—", query)}
      </span>
      <span className="filter-type-badge">{item.type || "—"}</span>
    </div>

    <div className="card-title">{item.brandName || "—"}</div>

    <div className="card-desc">{highlight(item.application || "—", query)}</div>

    <div className="card-footer">
      <span className="footer-label">Type</span>
      <span className="footer-value">{item.type || "—"}</span>
      <span className="footer-label">Brand</span>
      <span className="footer-value">{item.brandName || "—"}</span>
    </div>

    <div className="card-view-btn">View Details</div>
  </div>
);

/* ────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────────────────────── */

const BoschAlternator = () => {
  const { company } = useParams();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const { data, loading } = useCatalogues({
    page,
    limit: 10,
    search: debouncedSearch,
    company,
  });

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

  /* Open detail modal */
  const handleOpenDetail = useCallback((item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
    setDetailLoading(false);
    document.body.style.overflow = "hidden";
  }, []);

  /* Close detail modal */
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedItem(null);
    document.body.style.overflow = "auto";
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
      document.body.style.overflow = "auto";
    };
  }, []);

  /* Derived states */
  const finalData = data?.alternatorData || [];
  const hasData = finalData.length > 0;
  const isEmpty = !loading && !hasData;

  console.log(finalData);

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
            <h2 className="page-title">Bosch Alternators</h2>
            <p className="page-subtitle">
              {hasData
                ? `${finalData.length} alternator${finalData.length !== 1 ? "s" : ""} available`
                : "Bosch automotive alternators"}
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
            aria-label="Search alternators"
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
              <th>Type</th>
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
                      key={item._id || i}
                      item={item}
                      query={debouncedSearch}
                      index={i}
                      onRowClick={handleOpenDetail}
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
              key={item._id || i}
              item={item}
              query={debouncedSearch}
              index={i}
              onCardClick={handleOpenDetail}
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

      {/* ── Detail Modal ─────────────────────────────────────────── */}
      {isDetailOpen && (
        <DetailModal
          item={selectedItem}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          loading={detailLoading}
        />
      )}
    </div>
  );
};

export default BoschAlternator;