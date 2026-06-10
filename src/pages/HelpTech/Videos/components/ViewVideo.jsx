import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ViewVideo = ({ open, onClose, video }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>View Video</DialogTitle>
      <DialogContent>
        {video ? (
          <div>
            <Typography variant="h6">{video.title}</Typography>
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              {video.description}
            </Typography>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ccc",
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Video Player Placeholder
                  <br />
                  <small>Duration: {video.duration}</small>
                </Typography>
              </div>
            </div>
          </div>
        ) : (
          <Typography>No video data available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewVideo;
