import React, { useEffect, useState } from "react";
import {
  ArrowIcon,
  EmptyIcon,
  SkeletonCard,
} from "../../lucasStock/pages/CompanySheetsPage";
import { Link } from "react-router";
import "../styles/maincatalogue.scss";

const MainCatalogue = () => {
  const [loading, setLoading] = useState(true);

  const apiList = [
    {
      label: "Bosch PC Filter",
      image: "/catalogue_images/bosch_filter.png",
      type: "Bosch_PC_Filter",
    },
    {
      label: "Bosch PC Filter",
      image: "/catalogue_images/bosch_filter.png",
      type: "Bosch_CV_Filter",
    },
    {
      label: "Autolek Filters",
      image: "/catalogue_images/autolek_filter.png",
      type: "Autolek_FIlter",
    },
    {
      label: "Bosch PC Starter Motor",
      image: "/catalogue_images/bosch_electric.png",
      type: "Bosch_PC_Starter",
    },
    {
      label: "Bosch PC Alternator",
      image: "/catalogue_images/bosch_electric.png",
      type: "Bosch_PC_Alternator",
    },
    {
      label: "RMP Bearings Catalogues",
      image: "/catalogue_images/rmp_bearing.png",
      type: "RMP_Bearings_Catalogues",
    },
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
              <h2 className="page-title">Catalogues</h2>
              <p className="page-subtitle">
                SELECT A COMPANY TO VIEW FULL CATALOGUE
              </p>
            </div>
          </div>
        </div>

        {/* ── Result Meta ── */}
        {!loading && apiList.length > 0 && (
          <div className="csp-meta">
            <span className="csp-meta__count">
              Showing <strong>{apiList.length}</strong> Catalogues
              {apiList.length !== 1 ? "s" : ""}
            </span>
            <span className="csp-meta__badge">Catalogues</span>
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
              <p className="csp-empty__title">No catalogues found</p>
            </div>
          )}

          {/* Sheet cards */}
          {!loading &&
            apiList.map((list, index) => (
              <Link
                key={list.label}
                to={`/catalogues/${list.type}`}
                className="csp-card"
                role="listitem"
                aria-label={`Open ${list.label} sheet`}
              >
                <div className="csp-card__header">
                  <span className="csp-card__image">
                    <img src={list.image} alt="" />
                  </span>
                  <span className="csp-card__arrow">
                    <ArrowIcon />
                  </span>
                </div>
                <div className="csp-card__body">
                  <p className="csp-card__name">{list.label}</p>
                  <p className="csp-card__sub">View Full Catalogue →</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
};

export default MainCatalogue;
