import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { usePriceDetails } from "../hooks/BoshPriceList";
import "../styles/BoschPriceDetail.scss";

const BoschPriceDetail = () => {
  const { id } = useParams();

  const { loading, data } = usePriceDetails(id);

  if (loading) return <h2>Loading...</h2>;
  if (!data) return <h2>No Data Found</h2>;

  console.log(data);

  return (
    <div className="bosch-detail">
      <div className="detail-card">
        <div className="detail-header">
          <h2 className="material-no">{data.materialNo}</h2>
          <span className="hsn-badge">HSN: {data.hsn}</span>
        </div>

        <div className="detail-body">
          <div className="detail-row">
            <span className="label">Material Description</span>
            <span className="value">{data.materialDesc}</span>
          </div>

          <div className="detail-row">
            <span className="label">MRP</span>
            <span className="value price">₹ {data.mrp}</span>
          </div>

          <div className="detail-row">
            <span className="label">GST</span>
            <span className="value">{data.gst}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoschPriceDetail;
