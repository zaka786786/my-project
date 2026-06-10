import React from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";

function DeleteConfirmation({
  open,
  isLoading,
  setOpen,
  handleAgree,
  title,
  buttonText = "Delete",
}) {
  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: "white",
            color: "black",
            boxShadow: "none",
            width: 550,
            borderRadius: "20px",
          },
        }}
      >
        <DialogTitle>
          <div className="text-center p-1 pt-1 pb-1">
            <div className="">
              <p className="text-muted  mb-0 delete-confirm-text">
                {title ? title : "Are you sure you want to take this action?"}
              </p>
            </div>
            <div className="d-flex justify-content-center gap-3 ">
              <Button
                variant="outlined"
                className="capitalized delete-cancel-button font-family"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                color="primary"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                onClick={handleAgree}
                sx={{
                  color: "white",
                  minWidth: "93px",
                }}
                className="capitalized delete-confirm-button font-family"
              >
                {isLoading ? "" : buttonText}
              </LoadingButton>
            </div>
          </div>
        </DialogTitle>
      </Dialog>
    </>
  );
}

export default DeleteConfirmation;
