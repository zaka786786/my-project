import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

function LogoutConfirmation({
  open,
  setOpen,
  handleAgree,
  selected,
  setSelected,
  isLoading,
  title,
  buttonText,
}) {
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
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
          },
        }}
      >
        <DialogTitle className="logout-popup">
          <div>
            <p className="text-color">
              {title ? title : "Are you sure you want to take this action?"}
            </p>
          </div>
          <FormControl className="mt-0">
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="this_device"
              name="radio-buttons-group"
              className="password_radio"
              value={selected}
              onChange={handleChange}
            >
              <FormControlLabel
                value="this"
                control={<Radio />}
                label="Logout from this device"
              />
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="Logout from all devices"
              />
            </RadioGroup>
          </FormControl>
        </DialogTitle>
        <DialogActions>
          <Button className="model-button-hover" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            className="model-button-hover"
            autoFocus
            onClick={handleAgree}
          >
            {isLoading ? "Loading..." : "Agree"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LogoutConfirmation;
