import React, { useState } from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import moment from "moment";

const ExpandableText = ({ text, limit = 50 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text?.length <= limit) {
    return (
      <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#1C1C1E" }}>
        {text}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "14px",
          color: "#1C1C1E",
          display: "inline",
        }}
      >
        {isExpanded ? text : `${text.substring(0, limit)}...`}
      </Typography>
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          textTransform: "none",
          fontSize: "12px",
          minWidth: "auto",
          p: 0,
          ml: 1,
          verticalAlign: "baseline",
          fontWeight: 700,
          color: "#16437f",
          "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
        }}
      >
        {isExpanded ? "View Less" : "View More"}
      </Button>
    </Box>
  );
};

const LeadJourneyTimeline = ({
  leadHistory = [],
  labelStyle,
  sectionStyle,
}) => {
  const MESSAGE_LIMIT = 127;

  return (
    <Box sx={sectionStyle}>
      <Typography sx={{ ...labelStyle, mb: 2 }}>
        Lead Journey Timeline
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ pl: 2 }}>
        {leadHistory && leadHistory.length > 0 ? (
          [...leadHistory].map((item, index) => (
            <Box
              key={item?._id}
              sx={{
                position: "relative",
                borderLeft:
                  index === leadHistory.length - 1
                    ? "none"
                    : "2px solid #E5E5EA",
                pl: 3,
                pb: 4,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "-7px",
                  top: 0,
                  width: 12,
                  height: 12,
                  bgcolor:
                    item?.event === "note_added"
                      ? "#16437f"
                      : item?.event === "created"
                        ? "#34C759"
                        : item?.event === "assign_change"
                          ? "#FF9500"
                          : item?.event === "follow_up_change"
                            ? "#8E55EA"
                            : "#16437f",
                  borderRadius: "50%",
                }}
              />

              <ExpandableText text={item?.message} limit={MESSAGE_LIMIT} />

              <Typography variant="caption" color="textSecondary">
                By: {item?.action_info?.first_name}{" "}
                {item?.action_info?.last_name} ·{" "}
                {moment(item?.date).format("MMM DD, hh:mm a")}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No activity recorded yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LeadJourneyTimeline;
