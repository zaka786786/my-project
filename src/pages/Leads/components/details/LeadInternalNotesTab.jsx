import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Stack,
  Typography,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

import { useSnackbar } from "notistack";

import {
  _list_lead_note,
  _delete_lead_note_by_id,
  _edit_lead_note_by_id,
} from "../../../../DAL/Leads/leads";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import DeleteConfirmation from "../../../../components/DeleteConfirmation";
import { LoadingButton } from "@mui/lab";

import InternalNoteDesign from "./InternalNoteDesign";

const LeadInternalNotesTab = ({
  lead_id,
  notes = [],
  setNotes,
  setEditNote,
  editSectionRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [input, setInput] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const observer = useRef();

  const recordLimit = 10;

  // =========================
  // MENU
  // =========================

  const handleMenuOpen = (event, note) => {
    setAnchorEl(event.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNote(null);
  };

  const handleEdit = () => {
    setEditNote(selectedNote);
    handleMenuClose();

    setTimeout(() => {
      editSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };
  // const handleEdit = () => {
  //   setInput(selectedNote?.message || "");
  //   setEditId(selectedNote?._id);

  //   handleMenuClose();

  //   setTimeout(() => {
  //     editSectionRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //     });
  //   }, 100);
  // };

  const handleUpdate = async () => {
    if (!input.trim()) {
      enqueueSnackbar("Note cannot be empty", {
        variant: "error",
      });

      return;
    }

    setBtnLoading(true);

    const response = await _edit_lead_note_by_id(
      {
        message: input,
        note_id: editId,
      },
      lead_id,
    );

    if (response?.code === 200) {
      enqueueSnackbar(response?.message || "Note updated", {
        variant: "success",
      });

      setNotes((prev) =>
        prev.map((item) =>
          item._id === editId
            ? {
                ...item,
                ...response?.lead_note,
              }
            : item,
        ),
      );

      setInput("");
      setEditId(null);
    } else {
      enqueueSnackbar(response?.message || "Failed", {
        variant: "error",
      });
    }

    setBtnLoading(false);
  };

  const handleDeleteClick = () => {
    setOpenDelete(true);
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    setDelLoading(true);

    const response = await _delete_lead_note_by_id(
      {
        note_id: selectedNote?._id,
      },
      lead_id,
    );

    if (response?.code === 200) {
      enqueueSnackbar(response?.message || "Note deleted", {
        variant: "success",
      });

      setNotes((prev) => prev.filter((item) => item._id !== selectedNote?._id));
    } else {
      enqueueSnackbar(response?.message || "Delete failed", {
        variant: "error",
      });
    }

    setDelLoading(false);
    setOpenDelete(false);
    handleMenuClose();
  };

  const fetchNotes = async (pageNumber = 0, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const payload = {
      lead_id,
    };

    const response = await _list_lead_note(pageNumber, recordLimit, payload);

    if (response?.code === 200) {
      const newNotes = response?.lead_note_list || [];

      if (isLoadMore) {
        setNotes((prev) => [...prev, ...newNotes]);
      } else {
        setNotes(newNotes);
      }

      if (newNotes.length < recordLimit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } else {
      enqueueSnackbar(response?.message || "Failed to load notes", {
        variant: "error",
      });
    }

    setLoading(false);
    setLoadingMore(false);
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchNotes(0);
  }, [lead_id]);

  const lastElementRef = useCallback(
    (node) => {
      if (loadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;

          setPage(nextPage);

          fetchNotes(nextPage, true);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, page],
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* {editId && (
        <Box ref={editSectionRef} sx={{ mb: 2 }}>
          <Stack spacing={2}>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Edit note..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setInput("");
                }}
              >
                Cancel
              </Button>

              <LoadingButton
                loading={btnLoading}
                disabled={btnLoading || !input}
                variant="contained"
                onClick={handleUpdate}
              >
                Update
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      )} */}

      {notes?.length > 0 ? (
        <>
          <Stack spacing={2}>
            {notes.map((note, index) => {
              const fullName = `${
                note?.action_info?.first_name || ""
              } ${note?.action_info?.last_name || ""}`.trim();

              return (
                <div
                  key={note?._id}
                  ref={index === notes.length - 1 ? lastElementRef : null}
                >
                  <InternalNoteDesign
                    note={note}
                    fullName={fullName}
                    handleMenuOpen={handleMenuOpen}
                  />
                </div>
              );
            })}

            {loadingMore && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 2,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>

            <MenuItem onClick={handleDeleteClick} sx={{ color: "#DC2626" }}>
              <DeleteOutlineOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>

          <DeleteConfirmation
            open={openDelete}
            setOpen={setOpenDelete}
            isLoading={delLoading}
            title="Are you sure you want to delete this note?"
            handleAgree={handleDelete}
          />
        </>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            No internal notes found.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LeadInternalNotesTab;
