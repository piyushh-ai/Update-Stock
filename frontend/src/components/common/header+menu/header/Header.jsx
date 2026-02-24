import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Header.scss";

const Header = ({ setMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const NAV_ITEMS = [
    { to: "/", label: "Home", exact: true },
    { to: "/company", label: "Companies", startsWith: true },
    { to: "/bosch-stock", label: "Bosch Stock", startsWith: true },
    { to: "/bosch-stock", label: "Bosch Price List", startsWith: true },
    { to: "/bosch-stock", label: "All Company Catalogues", startsWith: true },
  ];

  const isNavActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    if (item.startsWith) return location.pathname.startsWith(item.to);
    return location.pathname === item.to;
  };

  return (
    <header className="header">
      {/* LEFT SIDE */}
      <div className="header__left">
        {!isHome && isMobile && (
          <button 
            onClick={handleBack} 
            className="header__btn header__btn--back"
            aria-label="Go back"
          >
            <FaArrowLeft className="header__icon" />
          </button>
        )}

        <Link to="/" className="header__logo">
          B.K Engineering
        </Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="header__right">
        {isMobile ? (
          <button 
            onClick={() => setMenuOpen(true)} 
            className="header__btn header__btn--menu"
            aria-label="Open menu"
          >
            <span className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        ) : (
          <nav className="header__nav">
            {NAV_ITEMS.map((item) => (
              <Link
                key={`${item.to}-${item.label}`}
                to={item.to}
                className={`header__nav-link ${isNavActive(item) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;