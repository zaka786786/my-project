import PropTypes from "prop-types";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, Divider } from "@mui/material";
import { useMediaQuery } from "@mui/material";

CustomDrawer.propTypes = {
  isOpenDrawer: PropTypes.bool,
  onResetDrawer: PropTypes.func,
  onCloseDrawer: PropTypes.func,
};

export default function CustomDrawer({
  isOpenDrawer,
  onCloseDrawer,
  componentToPassDown,
  pageTitle,
}) {
  const isMobileScreen = useMediaQuery("(max-width:400px)");
  return (
    <>
      <Drawer
        className="forms-drawer event-title"
        anchor="right"
        open={isOpenDrawer}
        onClose={onCloseDrawer}
        PaperProps={{
          sx: { width: isMobileScreen ? 250 : 350, border: "none" },
        }}
      >
        <div className="px-3 py-3 fixed_header filter-bg-color">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="m-0 p-0 filter-text-color"> {pageTitle}</h5>
            <CloseIcon
              onClick={onCloseDrawer}
              style={{
                fill: "#555",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
        <Divider />
        <div className="mt-5">{componentToPassDown}</div>
      </Drawer>
    </>
  );
}
