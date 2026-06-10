import React from "react";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Iconify from "./Iconify";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function CustomPopover({
  isOpenPop,
  isClosePop,
  title,
  componentToPassDown,
  submitButtonText,
  width,
  XSToMdScreen = "",
  showStatus,
  showAllButtons = true,
  className = "",
  isStatusActive = true,
  setIsStatusActive = () => {},
  handleSubmit = () => {},
  submitButtonLoader = false,
  setRowData = () => {},
}) {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  const handleClose = () => {
    isClosePop(false);
    setRowData(null);
  };

  return (
    <Dialog
      onTransitionExited={() => {
        setRowData && setRowData(null);
      }}
      open={isOpenPop}
      onClose={handleClose}
      className={className}
      PaperProps={{
        style: {
          minWidth: isMdScreen ? (width ? width : "550px") : XSToMdScreen,
          borderRadius: "30px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          className="custom-popover-container"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div className="d-flex justify-content-between align-items-baseline custom-popover">
            <div className="custom-popover-title capitalized">
              <h4>{title}</h4>
            </div>
            <div className="pointer custom-popover-cross" onClick={handleClose}>
              <CloseIcon />
            </div>
          </div>
          <hr />
          <div className="scrollable-content">{componentToPassDown}</div>
          {showAllButtons ? (
            <>
              <hr />
              <div className="d-flex justify-content-between">
                {showStatus ? (
                  <Button
                    variant="outlined"
                    color={isStatusActive ? "success" : "error"}
                    endIcon={
                      <Iconify
                        icon={
                          isStatusActive
                            ? "eva:checkmark-circle-2-outline"
                            : "system-uicons:cross-circle"
                        }
                        className="popover-active-inactive-button-iconify"
                      />
                    }
                    onClick={() => {
                      setIsStatusActive(!isStatusActive);
                    }}
                    className={
                      isStatusActive
                        ? "popover-active-button"
                        : "popover-inactive-button"
                    }
                  >
                    {isStatusActive ? "Active" : "Inactive"}
                  </Button>
                ) : (
                  <span></span>
                )}
                <div className="d-flex add-button">
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    className="popover-cancel-button"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="popover-apply-button"
                    loading={submitButtonLoader}
                  >
                    {submitButtonText}
                  </LoadingButton>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </form>
    </Dialog>
  );
}
