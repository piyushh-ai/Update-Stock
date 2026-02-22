import React from "react";
import "./ImageMarque.scss";

// ─── Logo data — single source of truth ──────
// Duplicating in JSX (instead of copy-pasting img tags) keeps
// the component clean and easy to update.
const LOGOS = [
  { src: "/company_images/Bosch_logo.png", alt: "Bosch" },
  { src: "/company_images/lucas.png", alt: "Lucas" },
  { src: "/company_images/nbc.png", alt: "NBC" },
  { src: "/company_images/rmp.png", alt: "RMP" },
  { src: "/company_images/delphi_tvs.png", alt: "Delphi TVS" },
  { src: "/company_images/ascot1.png", alt: "Ascot" },
  { src: "/company_images/gy.png", alt: "GY" },
];

// ─── Marquee Strip ───────────────────────────
const ImageMarque = () => {
  return (
    // .site-footer handles background, padding, and overflow:hidden.
    // It sits inside .page-shell → flex column, so it sticks to the
    // bottom naturally without position:absolute or fixed hacks.
    <footer className="site-footer">
      {/* Section label */}
      <p className="marquee-label">TRUSTED BY INDUSTRY BRANDS</p>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        {/*
          marquee-track holds two identical sets of logos.
          The keyframe moves -50%, landing perfectly on the
          start of the second set — a seamless infinite loop.
        */}
        <div className="marquee-track">
          {/* Set 1 */}
          {LOGOS.map(({ src, alt }) => (
            <img
              key={`a-${alt}`}
              className="logo"
              src={src}
              alt={alt}
              draggable="false"
            />
          ))}
          {/* Set 2 — duplicate for seamless loop */}
          {LOGOS.map(({ src, alt }) => (
            <img
              key={`b-${alt}`}
              className="logo"
              src={src}
              alt={alt}
              draggable="false"
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default ImageMarque;

// ─── HOW TO USE: Sticky Footer Pattern ───────
//
// In your root layout (App.jsx or _app.jsx), wrap everything like:
//
//   <div className="page-shell">
//     <main className="page-content">
//       {/* all your page routes / content */}
//     </main>
//     <ImageMarque />
//   </div>
//
// .page-shell   → display:flex; flex-direction:column; min-height:100dvh
// .page-content → flex:1  (grows to fill space, pushes footer down)
// <ImageMarque> → always sits at the bottom, never overlaps content
//
// No position:fixed, no position:absolute, no z-index hacks needed.
