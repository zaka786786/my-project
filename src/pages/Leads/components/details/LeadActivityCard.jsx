import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Stack } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import {
  _add_lead_note,
  _edit_lead_note_by_id,
} from "../../../../DAL/Leads/leads";
import { LoadingButton } from "@mui/lab";

const LeadActivityCard = ({
  lead,
  sectionStyle,
  labelStyle,
  setLeadHistory,
  setNotes,
  editNote,
  setEditNote,
  editSectionRef,
}) => {
  const [note, setNote] = useState("");
  const [submitLoader, setSubmitLoader] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) return;

    setSubmitLoader(true);

    if (editNote) {
      const response = await _edit_lead_note_by_id(
        {
          message: note,
          note_id: editNote._id,
        },
        lead?._id,
      );

      if (response?.code === 200) {
        enqueueSnackbar("Note updated", { variant: "success" });

        setNotes((prev) =>
          prev.map((n) =>
            n._id === editNote._id ? { ...n, message: note } : n,
          ),
        );

        setEditNote(null);
        setNote("");
      }
    } else {
      const response = await _add_lead_note({
        lead_id: lead?._id,
        message: note,
      });

      if (response?.code === 200) {
        enqueueSnackbar("Note added", { variant: "success" });

        setNotes((prev) => [response?.lead_note, ...prev]);
        setNote("");
      }
    }

    setSubmitLoader(false);
  };

  useEffect(() => {
    if (editNote) {
      setNote(editNote.message || "");
    }
  }, [editNote]);

  return (
    <Box ref={editSectionRef} sx={sectionStyle}>
      <Typography sx={labelStyle}>Add Note / Activity</Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder="Write internal note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{ bgcolor: "#F9F9FB" }}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {editNote && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setEditNote(null);
                setNote("");
              }}
            >
              Cancel
            </Button>
          )}

          <LoadingButton
            fullWidth
            variant="contained"
            loading={submitLoader}
            disabled={submitLoader || !note}
            onClick={handleSubmit}
          >
            {editNote ? "Update Note" : "Add Note"}
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LeadActivityCard;
