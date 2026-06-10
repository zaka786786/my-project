import React from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const LeadNoteInputCard = ({
  editId,
  input,
  setInput,
  handleAddOrUpdate,
  btnLoading,
  handleCancelEdit,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        // borderColor: "#eef2f7ea",
        borderColor: "#ffffffea",
        borderRadius: "6px",
        // mx: { xs: 2, sm: 3 },
        mx: { xs: 1, sm: 0 },
        // mt: 2,
        // background: "rgba(255, 255, 255, 0.9)",
        // backdropFilter: "blur(12px)",
        // boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
      }}
    >
      <CardContent sx={{ p: "20px 24px !important" }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems="center"
          >
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write something important about this lead..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#fcfcfc",
                  "& fieldset": { borderColor: "#e0e0e0" },
                },
              }}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {editId && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCancelEdit}
                  sx={{
                    minWidth: "70px",
                    height: "45px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.775rem",
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                    px: 0,
                  }}
                >
                  Cancel
                </Button>
              )}

              <LoadingButton
                variant="contained"
                onClick={handleAddOrUpdate}
                loading={btnLoading}
                disabled={!input.trim() || btnLoading}
                sx={{
                  //   borderRadius: "10px",
                  minWidth: editId ? "70px" : "110px",
                  height: "45px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.775rem",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                  px: 2,
                }}
              >
                {editId ? "Update" : "Add Note"}
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LeadNoteInputCard;
