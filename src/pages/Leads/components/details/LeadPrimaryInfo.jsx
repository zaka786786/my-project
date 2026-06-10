import React from "react";
import { Grid, Typography, Box, Avatar, Button } from "@mui/material";
import moment from "moment";
import {
  LEADS_PRIVILEGE,
  show_proper_words,
} from "../../../../utils/constant_new";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const LeadPrimaryInfo = ({ lead, sectionStyle, labelStyle, valueStyle }) => {
  const navigate = useNavigate();

  const infoList = [
    // {
    //   label: "Phone",
    //   value: lead?.phone_number,
    // },
    // {
    //   label: "Email",
    //   value: lead?.email,
    // },
    // {
    //   label: "Province",
    //   value: lead?.province_info?.name,
    // },
    // {
    //   label: "City",
    //   value: lead?.city_info?.name,
    // },
    {
      label: "Lead Source",
      value: show_proper_words(lead?.lead_source || ""),
    },
    {
      label: "Interested Product",
      value: lead?.interested_product,
    },
    {
      label: "Business Category",
      value: lead?.category?.title,
    },
    {
      label: "Expected Budget",
      value:
        lead?.expected_budget || lead?.expected_budget === 0
          ? `PKR ${Number(lead?.expected_budget).toLocaleString()}`
          : "N/A",
    },
    {
      label: "Meeting Schedule",
      value: lead?.meeting_schedule ? "Yes" : "No",
    },
    {
      label: "Meeting Date",
      value: lead?.meeting_schedule_date
        ? moment(lead?.meeting_schedule_date).format("DD MMM YYYY, hh:mm a")
        : "Not Scheduled",
    },
    {
      label: "Follow-up Date",
      value: lead?.follow_up_date
        ? moment(lead?.follow_up_date).format("DD MMM YYYY, hh:mm a")
        : "Not Set",
    },
    {
      label: "Assigned To",
      value: lead?.assigned_to
        ? `${lead.assigned_to.first_name || ""} ${lead.assigned_to.last_name || ""}`
        : "Unassigned",
    },
    {
      label: "Referral",
      value: lead?.referral_info?.name
        ? `${lead.referral_info.name} - ${show_proper_words(lead?.referral_info?.relation)}`
        : "N/A",
      secondValue: lead?.referral_info?.phone_number
        ? `${lead.referral_info.phone_number}`
        : "",
    },
    // {
    //   label: "Referral",
    //   value: lead?.referral_info?.name
    //     ? `${lead.referral_info.name} (${show_proper_words(
    //         lead?.referral_info?.relation,
    //       )})`
    //     : "N/A",
    // },
    {
      label: "Created By",
      value: lead?.action_info
        ? `${lead.action_info.first_name || ""} ${lead.action_info.last_name || ""}`
        : "N/A",
    },
    {
      label: "Created At",
      value: lead?.createdAt
        ? moment(lead?.createdAt).format("DD MMM YYYY, hh:mm a")
        : "-",
    },
    // {
    //   label: "Address",
    //   value: lead?.address,
    // },
    {
      label: "Initial Note",
      value: lead?.initial_note || "N/A",
    },
  ];

  const budget = Number(lead?.expected_budget);

  return (
    <Box sx={sectionStyle}>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          mb: 4,
          gap: 2,
        }}
      >
        {/* <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "#F5F5F7",
            color: "#16437f",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {lead?.name?.charAt(0)}
        </Avatar> */}

        <Box sx={{ flexGrow: 1 }}>
          {/* <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {lead?.name || "-"}
          </Typography>

          <Typography variant="body2" color="textSecondary">
            {lead?.city_info?.name || "-"}, {lead?.province_info?.name || "-"} ·{" "}
            {lead?.address || "-"}
          </Typography> */}

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {lead?.name || "-"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.7,
              mt: 0.5,
            }}
          >
            {lead?.phone_number && (
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#4b5563",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {lead?.phone_number}
              </Typography>
            )}

            {lead?.email && (
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#6b7280",
                  lineHeight: 1.4,
                }}
              >
                {lead?.email}
              </Typography>
            )}

            {(lead?.city_info?.name ||
              lead?.province_info?.name ||
              lead?.address) && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  lineHeight: 1.5,
                }}
              >
                {[lead?.city_info?.name, lead?.province_info?.name]
                  .filter(Boolean)
                  .join(", ")}

                {lead?.address ? " · " + lead?.address : ""}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {/* <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "#F5F5F7",
                borderRadius: "4px",
                fontSize: "12px",
                border: "1px solid #E5E5EA",
                color: "#16437f",
                fontWeight: 500,
              }}
            >
              {lead?.interested_product || "No Product"}
            </Box> */}

            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "#F5F5F7",
                borderRadius: "4px",
                fontSize: "12px",
                border: "1px solid #E5E5EA",
                fontWeight: 500,
              }}
            >
              Campaign: {lead?.platform_campaign || "N/A"}
            </Box>

            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "#F5F5F7",
                borderRadius: "4px",
                fontSize: "12px",
                border: "1px solid #E5E5EA",
                fontWeight: 500,
              }}
            >
              Category: {lead?.category?.title || "N/A"}
            </Box>

            {budget > 0 && !isNaN(budget) && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: "#F5F5F7",
                  borderRadius: "4px",
                  fontSize: "12px",
                  border: "1px solid #E5E5EA",
                  fontWeight: 500,
                }}
              >
                {`PKR ${Number(lead?.expected_budget).toLocaleString()}`}
              </Box>
            )}
          </Box>
        </Box>
        <div className="d-flex gap-3">
          <Box
            sx={{
              px: 2,
              py: 0.75,
              border: `1px solid ${lead?.lead_status?.text_color || "#16437f"}`,
              borderRadius: "20px",
              color: lead?.lead_status?.text_color || "#16437f",
              bgcolor: lead?.lead_status?.background_color || "#fff",
              fontSize: "12px",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {lead?.lead_status?.title || "No Status"}
          </Box>
          {LEADS_PRIVILEGE?.edit_lead && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/leads/edit/${lead?._id}?from=detail`)}
              sx={{
                minWidth: 36,
                width: 36,
                height: 36,
                borderRadius: "10px",
                borderColor: "#dbe3ee",
                color: "#4b5563",
                p: 0,
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f8fafc",
                  borderColor: "#cbd5e1",
                },
              }}
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </Button>
          )}
        </div>
      </Box>

      <Grid container spacing={3}>
        {infoList.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{
              borderBottom: "1px solid #F2F2F7",
              pb: 2,
            }}
          >
            <Typography sx={labelStyle}>{item?.label}</Typography>

            <Typography
              sx={{
                ...valueStyle,
                wordBreak: "break-word",
              }}
            >
              {item?.value || "-"}
              {item?.secondValue && (
                <Typography
                  sx={{
                    mt: 0,
                    fontSize: "12px",
                    color: "#8a8a8a",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    wordBreak: "break-word",
                  }}
                >
                  {item?.secondValue}
                </Typography>
              )}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LeadPrimaryInfo;
