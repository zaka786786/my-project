import React from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react"; // ✅ Import Iconify

function ConfirmationAlert({
  open,
  isLoading,
  setOpen,
  handleAgree,
  title,
  buttonText = "Ok",
}) {
  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      PaperProps={{
        style: {
          backgroundColor: "white",
          color: "black",
          boxShadow: "none",
          width: 450,
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle>
        <div className="text-center p-2 pt-3 pb-3">
          <Icon
            icon="mdi:alert-circle-outline"
            width="40"
            height="40"
            style={{ color: "#f57c00", marginBottom: "8px" }} // warning orange
          />

          <p className="text-muted mb-0">
            {title || "Your information is incomplete. You cannot proceed."}
          </p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={isLoading}
              disabled={isLoading}
              onClick={handleAgree}
              sx={{ color: "white", minWidth: "93px" }}
            >
              {isLoading ? "" : buttonText}
            </LoadingButton>
          </div>
        </div>
      </DialogTitle>
    </Dialog>
  );
}

export default ConfirmationAlert;
