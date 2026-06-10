import React from "react";
import Iconify from "../../../components/Iconify";

const LeadStats = ({ list = [] }) => {
  const colors = [
    "#06b6d4",
    "#10b981",
    "#f97316",
    "#8b5cf6",
    "#f59e0b",
    "#84cc16",
    "#3b82f6",
    "#ef4444",
  ];

  const icons = [
    // "mdi:lock-outline",
    "mdi:star-outline",
    // "mdi:account-group",
    // "mdi:chart-line",
    // "mdi:fire",
    // "mdi:progress-clock",
    // "mdi:check-circle-outline",
    // "mdi:cart-outline",
  ];

  const getColClass = () => {
    if (list.length === 1) return "col-md-4 col-sm-6";
    if (list.length === 2) return "col-6 col-md-3";

    return "col-6 col-sm-4 col-lg-3";
  };

  return (
    <div className="row mt-3">
      {list.map((item, index) => (
        <div className={`${getColClass()} mb-3`} key={index}>
          <div
            className="lead-stat-card-v2 p-3"
            style={{
              borderTop: `2px solid ${colors[index % colors.length]}`,
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div
                  className="lead-title text-muted"
                  style={{ fontSize: "14px", fontWeight: "500" }}
                >
                  {item?.title || "-"}
                </div>
                <div
                  className="lead-count"
                  style={{ fontSize: "20px", fontWeight: "bold" }}
                >
                  {item?.count || 0}
                </div>
              </div>

              {/* <div
                className="icon-box d-flex align-items-center justify-content-center"
                style={{
                  color: colors[index % colors.length],
                  backgroundColor: `${colors[index % colors.length]}20`,
                  borderRadius: "50%",
                  padding: "8px",
                }}
              >
                <Iconify
                  icon={icons[index % icons.length]}
                  width={22}
                  height={22}
                />
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadStats;
