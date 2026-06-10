import { useEffect, useState, useRef, useCallback } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import CircularLoader from "../../components/loaders/CircularLoader";

import {
  _list_lead_note,
  _delete_lead_note_by_id,
  _add_lead_note,
  _edit_lead_note_by_id,
} from "../../DAL/Leads/leads";

import DeleteConfirmation from "../../components/DeleteConfirmation";
import { useAdminContext } from "../../Hooks/AdminContext";
import { LoadingButton } from "@mui/lab";

import InternalNoteDesign from "./components/details/InternalNoteDesign";
import LeadNoteInputCard from "./components/LeadNoteInputCard";

const LeadInternalNotes = () => {
  const { id: lead_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();

  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [btnLoading, setBtnLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [lead, setLead] = useState(null);

  const [page, setPage] = useState(0);
  const recordLimit = 10;

  const observer = useRef();

  const fetchNotes = async (pageNumber = 0, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    const payload = { lead_id };

    const response = await _list_lead_note(pageNumber, recordLimit, payload);

    if (response?.code === 200) {
      const newNotes = response?.lead_note_list || [];
      setLead(response?.lead || null);
      if (isLoadMore) {
        setNotes((prev) => [...prev, ...newNotes]);
      } else {
        setNotes(newNotes);
      }

      if (newNotes.length < recordLimit) {
        setHasMore(false);
      }
    } else {
      enqueueSnackbar(response?.message || "Failed to load notes", {
        variant: "error",
      });
    }

    setLoading(false);
    setLoadingMore(false);
  };

  // initial load
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchNotes(0, false);
  }, [lead_id]);

  // =========================
  // INFINITE SCROLL
  // =========================
  const lastNoteRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (!hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchNotes(nextPage, true);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, page],
  );

  // =========================
  // ADD / UPDATE NOTE
  // =========================
  const handleAddOrUpdate = async () => {
    if (!input.trim()) {
      enqueueSnackbar("Note cannot be empty", { variant: "error" });
      return;
    }

    setBtnLoading(true);

    let response;

    if (editId) {
      response = await _edit_lead_note_by_id(
        { message: input, note_id: editId },
        lead_id,
      );
    } else {
      response = await _add_lead_note({
        lead_id,
        message: input,
      });
    }

    if (response?.code === 200) {
      enqueueSnackbar(response?.message || "Success", {
        variant: "success",
      });

      if (editId) {
        setNotes((prev) =>
          prev.map((item) =>
            item._id === editId ? { ...item, ...response?.lead_note } : item,
          ),
        );
      } else {
        setNotes((prev) => [response?.lead_note, ...prev]);
      }

      setInput("");
      setEditId(null);
    }

    setBtnLoading(false);
  };

  // =========================
  // MENU
  // =========================
  const handleMenuOpen = (e, note) => {
    setAnchorEl(e.currentTarget);
    setSelectedNote(note);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNote(null);
  };

  const handleCancelEdit = () => {
    setInput("");
    setEditId(null);
  };

  const handleEdit = () => {
    setInput(selectedNote?.message || "");
    setEditId(selectedNote?._id);
    handleMenuClose();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    setDelLoading(true);

    const response = await _delete_lead_note_by_id(
      { note_id: selectedNote?._id },
      lead_id,
    );

    if (response?.code === 200) {
      setNotes((prev) => prev.filter((item) => item._id !== selectedNote?._id));
    }

    setDelLoading(false);
    setOpenDelete(false);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDelete(true);
    setAnchorEl(null);
  };

  useEffect(() => {
    setIsBackButton(true);
    setNavBarTitle(
      lead
        ? `Internal Notes (${lead?.name || "-"}${
            lead?.phone_number ? ` / ${lead?.phone_number}` : ""
          })`
        : "Internal Notes",
    );
  }, [lead]);

  if (loading) return <CircularLoader />;

  return (
    <Box className="container-fluid">
      <LeadNoteInputCard
        editId={editId}
        input={input}
        setInput={setInput}
        handleAddOrUpdate={handleAddOrUpdate}
        btnLoading={btnLoading}
        handleCancelEdit={handleCancelEdit}
      />

      {/* NOTES */}
      {notes?.length > 0 ? (
        <Box
          sx={{
            maxHeight: "calc(100vh - 240px)",
            overflowY: "auto",
            px: { xs: 2, sm: 3 },
            pb: 3,
            pt: 2,
          }}
        >
          <Stack spacing={2}>
            {notes.map((note, index) => {
              const fullName = `${
                note?.action_info?.first_name || ""
              } ${note?.action_info?.last_name || ""}`.trim();

              return (
                <div
                  key={note?._id}
                  ref={index === notes.length - 1 ? lastNoteRef : null}
                >
                  <InternalNoteDesign
                    note={note}
                    fullName={fullName}
                    handleMenuOpen={handleMenuOpen}
                  />
                </div>
              );
            })}
          </Stack>

          {loadingMore && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CircularProgress size={22} />
            </Box>
          )}
        </Box>
      ) : (
        <Typography sx={{ px: 3, py: 4 }}>No notes found</Typography>
      )}

      {/* MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: "red" }}>
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
    </Box>
  );
};

export default LeadInternalNotes;
