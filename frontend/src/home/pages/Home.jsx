import React from "react";
import "../styles/home.scss";
import ArrowRight from "../../components/common/icons/ArrowRight";
import ImageMarque from "../../components/common/marque_effect/ImageMarque";
import MobileMenu from "../../components/common/header+menu/menu/MobileMenu";
import { Link } from "react-router";

const Home = () => {
  return (
    <>
      <MobileMenu />
      <div className="home">
        <div className="main-card">
          <div className="top">
            <h1>B.K Engineering</h1>
            <div className="line"></div>
            <h2>Inverntory Management</h2>
          </div>
          <div className="bottom">
            <h2>Search By Company</h2>
            <Link to="/bosch-stock">
              <div className="box">
                <div className="company-name">
                  <h3>Bosch</h3>
                  <p>Filters, Wiper Blades, Bulbs, Lubricants...</p>
                </div>
                <div className="arrow">
                  <ArrowRight />
                </div>
              </div>
            </Link>
            <div className="box">
              <div className="company-name">
                <h3>Other Companies</h3>
                <p>Lucas, NBC, RMP, Autolek, Delphi, Goodyear, Ascot...</p>
              </div>
              <div className="arrow">
                <ArrowRight />
              </div>
            </div>
          </div>
        </div>
        <ImageMarque />
      </div>
    </>
  );
};

export default Home;
