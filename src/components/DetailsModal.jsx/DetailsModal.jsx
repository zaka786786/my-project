import { Box, IconButton, Modal, Typography, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DetailsModal = ({ component, open, handleClose, title }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "80%", md: "60%" },
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            pb: 1,
          }}
        >
          {title && (
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Divider below header */}
        {title && <Divider />}

        {/* Modal Content */}
        <Box
          sx={{
            p: 2,
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {component}
        </Box>
      </Box>
    </Modal>
  );
};

export default DetailsModal;
