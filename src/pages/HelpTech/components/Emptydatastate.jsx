import React from "react";
import { Box, Typography } from "@mui/material";

export default function EmptyDataState({
  title = "No data found",
  description = "There are no items to display right now.",
  icon,
  action,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        gap: 1.5,
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 0.5,
        }}
      >
        {icon ?? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 32, height: 32, color: "#9ca3af" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        )}
      </Box>

      <Typography
        sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", m: 0 }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          color: "text.secondary",
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.6,
          m: 0,
        }}
      >
        {description}
      </Typography>

      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
}
