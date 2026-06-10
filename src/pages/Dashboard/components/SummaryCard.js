// @mui
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
// utils
// import { fShortenNumber } from "src/utils";
// components
import Iconify from "../../../components/Iconify";
import { ArrowForward } from "@mui/icons-material";

// ----------------------------------------------------------------------

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

// ----------------------------------------------------------------------

SummaryCard.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  // count: PropTypes.number.isRequired,
  // count: PropTypes.number,
  sx: PropTypes.object,
  onViewClick: PropTypes.func,
};

export default function SummaryCard({
  title,
  count,
  icon,
  color = "#000",
  sx,
  onViewClick,
  ...other
}) {
  return (
    <div className="dashboard-card mb-3" style={{ position: "relative" }}>
      {/* View Button in top right corner */}

      {onViewClick && (
        <Tooltip title="View All">
          <span style={{ position: "absolute", top: 8, right: 8 }}>
            <IconButton
              aria-label="view details"
              onClick={onViewClick}
              sx={{
                color: color,
                "&:hover": {
                  color: color,
                },
              }}
            >
              <Iconify
                icon={"eva:arrow-ios-forward-outline"}
                width={20}
                height={20}
              />
            </IconButton>
          </span>
        </Tooltip>
      )}

      <div>
        <IconWrapperStyle
          sx={{
            // mt: 2,
            ml: 0,
            width: 50,
            height: 50,
            bgcolor: "#eef4f9",
          }}
        >
          <Iconify
            icon={icon}
            width={25}
            height={25}
            sx={{ color: { color } }}
          />
        </IconWrapperStyle>
      </div>

      <div className="dashboard-card-title">{title}</div>
      <div className="dashboard-card-count">{count}</div>
    </div>
  );
}
