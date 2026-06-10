import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";

const TemplatePreviewModal = ({ open, onClose, image, title }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {title || "Template Preview"}
        </Typography>

        <IconButton onClick={onClose} size="small">
          <Icon icon="material-symbols:close" width={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 2,
          height: "80vh",
          backgroundColor: "#f4f4f4",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflowY: "auto",
        }}
      >
        {!image ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Please select a template to preview.
            </Typography>
          </Box>
        ) : (
          <img
            src={image}
            alt={title || "Template Preview"}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 4,
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreviewModal;
