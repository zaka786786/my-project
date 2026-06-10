import { Dialog } from "@mui/material";
import React from "react";

export default function GeneralPopUpModel({
  open,
  title,
  setOpen,
  componentToPassDown,
  paperClass,
  width,
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        disableEnforceFocus={true}
        sx={{
          height: "100vh",
        }}
        PaperProps={{
          className: `p-3 general-popup-model ${
            paperClass || ""
          } overflow-hidden`,
          style: {
            width: width || 700,
          },
        }}
      >
        <div class="cross-icon" onClick={() => setOpen(false)}>
          x
        </div>
        <div className="popup-title">
          <h2 className="text-capitalize">{title}</h2>
        </div>
        <hr />
        <div className="responce-messages">{componentToPassDown}</div>
      </Dialog>
    </>
  );
}
