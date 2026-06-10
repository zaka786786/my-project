import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import DashboardTableCard from "./DashboardTableCard";
import LeadStatusChip from "../../Leads/components/LeadStatusChip";
import CustomImageAvatar from "../../../components/CustomImageAvatar";
import { imageBaseUrl } from "../../../config/config";
import { show_proper_words } from "../../../utils/constant_new";

const DashboardUpcomingLeads = ({ data = [], show = false }) => {
  const navigate = useNavigate();

  const TABLE_HEAD = [
    { id: "number", label: "#", type: "number" },
    {
      id: "lead",
      label: "Lead",
      renderData: (row) => (
        <div
          className="lead-cell pointer"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <p className="lead-name mb-0">{row?.name || "-"}</p>

          {(row?.phone_number || row?.email) && (
            <p className="lead-sub mb-0">{row?.phone_number || row?.email}</p>
          )}

          {(row?.city_info?.name || row?.province_info?.name) && (
            <p
              className="mb-0"
              style={{
                fontSize: "12px",
                color: "#8a8a8a",
              }}
            >
              {row?.city_info?.name || ""}
              {row?.city_info?.name && row?.province_info?.name ? ", " : ""}
              {row?.province_info?.name || ""}
            </p>
          )}

          {row?.address && (
            <p
              className="mb-0"
              style={{
                fontSize: "11px",
                color: "#a0a0a0",
                maxWidth: "240px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row?.address}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "source",
      label: "Source",
      renderData: (row) => (
        <div className="source-cell">
          <span className="source-badge">
            {row?.lead_source ? show_proper_words(row?.lead_source) : "-"}
          </span>

          {row?.referral_info?.name && (
            <div
              style={{
                marginTop: "4px",
                fontSize: "11px",
                color: "#8a8a8a",
                lineHeight: "1.4",
              }}
            >
              <div>
                {row.referral_info.name}{" "}
                {row?.referral_info?.relation
                  ? `- ${show_proper_words(row.referral_info.relation)}`
                  : ""}
              </div>

              {row?.referral_info?.phone_number && (
                <div style={{ marginTop: "2px" }}>
                  {row.referral_info.phone_number}
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      renderData: (row) => (
        <div className="status-cell">
          <LeadStatusChip
            leadId={row?._id}
            currentStatus={row?.lead_status}
            disabled={true}
          />
        </div>
      ),
    },

    {
      id: "assigned_to",
      label: "Assigned To",
      renderData: (row) => (
        <div className="assigned-cell">
          {row?.assigned_to ? (
            <div className="assigned-row">
              {row?.assigned_to?.profile_image ? (
                <CustomImageAvatar
                  imageUrl={
                    row?.assigned_to?.profile_image
                      ? imageBaseUrl + row?.assigned_to?.profile_image
                      : ""
                  }
                  size={26}
                  altText={row?.assigned_to?.first_name}
                  name={row?.assigned_to?.first_name}
                />
              ) : (
                <div className="avatar">
                  {row?.assigned_to?.first_name?.[0]}
                  {row?.assigned_to?.last_name?.[0]}
                </div>
              )}
              <span>{row?.assigned_to?.first_name}</span>
            </div>
          ) : (
            "-"
          )}
        </div>
      ),
    },

    {
      id: "lead_info",
      label: "Lead Info",
      renderData: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            minWidth: "220px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#555",
            }}
          >
            <span style={{ fontWeight: 600 }}>Campaign:</span>{" "}
            {row?.platform_campaign || "N/A"}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#555",
            }}
          >
            <span style={{ fontWeight: 600 }}>Business:</span>{" "}
            {row?.category?.title || "N/A"}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#555",
            }}
          >
            <span style={{ fontWeight: 600 }}>Product:</span>{" "}
            {row?.interested_product || "N/A"}
          </div>

          {row?.expected_budget ? (
            <div
              style={{
                fontSize: "12px",
                color: "#555",
              }}
            >
              <span style={{ fontWeight: 600 }}>Budget:</span> PKR{" "}
              {Number(row?.expected_budget).toLocaleString()}
            </div>
          ) : null}
        </div>
      ),
    },

    {
      id: "added",
      label: "Added",
      renderData: (row) => (
        <div className="date-cell">
          {row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY") : "-"}
        </div>
      ),
    },
  ];

  return (
    <DashboardTableCard
      title="Upcoming Leads"
      data={data}
      tableHead={TABLE_HEAD}
      show={show}
    />
  );
};

export default DashboardUpcomingLeads;
