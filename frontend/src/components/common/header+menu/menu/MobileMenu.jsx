import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MobileMenu.scss";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Home",
    desc: "Dashboard overview",
    icon: "⊞",
    exact: true,
  },
  {
    to: "/company",
    label: "Companies",
    desc: "All inventory sources",
    icon: "◫",
    startsWith: true,
  },
  {
    to: "/bosch-stock",
    label: "Bosch Stock",
    desc: "Bosch parts inventory",
    icon: "◈",
  },
  {
    to: "/BoschPriceList",
    label: "Bosch Price List",
    desc: "Bosch current MRP",
    icon: "◉",
  },
  {
    to: "/bosch-stock",
    label: "All Company Catalogues",
    desc: "Browse catalogues by brand",
    icon: "◧",
  },
];

const MobileMenu = ({ open, setOpen }) => {
  const location = useLocation();
  const startX = useRef(0);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.history.pushState({ menu: true }, "");
    } else {
      document.body.style.overflow = "unset";
    }

    const handleBack = () => {
      if (open) setOpen(false);
    };

    window.addEventListener("popstate", handleBack);
    return () => {
      window.removeEventListener("popstate", handleBack);
      document.body.style.overflow = "unset";
    };
  }, [open, setOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, setOpen]);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const diff = startX.current - e.touches[0].clientX;
    if (diff > 60) setOpen(false);
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    if (item.startsWith) return location.pathname.startsWith(item.to);
    return location.pathname === item.to;
  };

  return (
    <>
      {open && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        ref={drawerRef}
        className={`mobile-menu-drawer ${open ? " is-open" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <header className="mobile-menu-header">
          <p className="mobile-menu-header__eyebrow">Inventory System</p>
          <h1 className="mobile-menu-header__brand">B.K Engineering</h1>
          <p className="mobile-menu-header__sub">Parts &amp; Stock Management</p>
          <span className="mobile-menu-header__accent-line" />
        </header>

        {/* Navigation */}
        <nav className="mobile-menu-nav">
          <p className="mobile-menu-section-label">Navigation</p>

          {NAV_ITEMS.map((item) => (
            <Link
              key={`${item.to}-${item.label}`}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`mobile-menu-item${isActive(item) ? " is-active" : ""}`}
            >
              <span className="mobile-menu-item__icon">{item.icon}</span>
              <span className="mobile-menu-item__text">
                <span className="mobile-menu-item__label">{item.label}</span>
                <span className="mobile-menu-item__desc">{item.desc}</span>
              </span>
              <span className="mobile-menu-item__arrow">▶</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <footer className="mobile-menu-footer">
          <p className="mobile-menu-footer__tagline">Discipline · Precision · Control</p>
          <p className="mobile-menu-footer__version">v2.1.0</p>
        </footer>
      </div>
    </>
  );
};

export default MobileMenu;