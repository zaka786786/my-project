import PropTypes from "prop-types";
import { Popover } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

const ArrowStyle = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    top: -7,
    zIndex: 1,
    width: 12,
    right: 20,
    height: 12,
    content: "''",
    position: "absolute",
    borderRadius: "0 0 4px 0",
    transform: "rotate(-135deg)",
    borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    background: "",
  },
}));

// ----------------------------------------------------------------------

ProfilePopover.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

export default function ProfilePopover({ children, sx, ...other }) {
  return (
    <Popover
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        style: {
          marginTop: "69px",
          marginLeft: "-9px",
        },
        sx: {
          mt: 5,
          ml: 0.5,
          overflow: "inherit",
          border: (theme) => `solid 1px ${theme.palette.grey[500_8]}`,
          ...sx,
        },
      }}
      {...other}
    >
      <ArrowStyle className="arrow" />

      {children}
    </Popover>
  );
}
