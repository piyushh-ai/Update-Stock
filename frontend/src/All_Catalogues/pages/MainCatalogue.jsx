import React, { useEffect, useState } from "react";
import {
  ArrowIcon,
  EmptyIcon,
  SkeletonCard,
} from "../../lucasStock/pages/CompanySheetsPage";
import { Link } from "react-router";

const MainCatalogue = () => {
  const [loading, setLoading] = useState(true);

  const apiList = [
    { label: "API 1", type: "api1" },
    { label: "API 2", type: "api2" },
    { label: "API 3", type: "api3" },
    { label: "API 4", type: "api4" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1.2 sec loader

    return () => clearTimeout(timer);
  }, []);

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
              <h2 className="page-title">Company Sheets</h2>
              <p className="page-subtitle">
                SELECT A SHEET TO VIEW STOCK DETAILS
              </p>
            </div>
          </div>
        </div>

        {/* ── Result Meta ── */}
        {!loading && apiList.length > 0 && (
          <div className="csp-meta">
            <span className="csp-meta__count">
              Showing <strong>{apiList.length}</strong> sheet
              {apiList.length !== 1 ? "s" : ""}
              
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
          {!loading && apiList.length === 0 && (
            <div className="csp-empty" role="status">
              <div className="csp-empty__icon">
                <EmptyIcon />
              </div>
              <p className="csp-empty__title">No sheets found</p>
              
            </div>
          )}

          {/* Sheet cards */}
          {!loading &&
            apiList.map((list, index) => (
              <Link
                key={list.label}
                to={`/company/${list}`}
                className="csp-card"
                role="listitem"
                aria-label={`Open ${list} sheet`}
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
                  <p className="csp-card__name">{list.label}</p>
                  <p className="csp-card__sub">View stock details →</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
};

export default MainCatalogue;
