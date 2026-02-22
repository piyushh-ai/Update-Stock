import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.scss";

const Header = ({ setMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="header">
      {/* Back Button */}
      {!isHome ? (
        <button
          onClick={() => navigate(-1)}
          className="header__btn"
        >
          <FaArrowLeft className="header__icon" />
        </button>
      ) : (
        <div className="header__placeholder" />
      )}

      {/* Menu Button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="header__btn"
      >
        ☰
      </button>
    </div>
  );
};

export default Header;