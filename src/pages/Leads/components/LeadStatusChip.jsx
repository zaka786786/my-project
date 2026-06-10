import React, { useState, useEffect } from "react";
import {
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { _change_lead_status } from "../../../DAL/Leads/leads";
import { _get_common_business_categories } from "../../../DAL/BusinessCategories/business_categories";
import { debounce } from "lodash";

const LeadStatusChip = ({
  leadId,
  currentStatus,
  onStatusChange = () => {},
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [leadStatus, setLeadStatus] = useState([]);

  const open = Boolean(anchorEl);

  const fetchLeadStatusList = debounce(async (searchText = "") => {
    setLoadingList(true);

    const response = await _get_common_business_categories({
      type: "lead_status",
      search: searchText,
    });

    if (response?.code === 200) {
      setLeadStatus(response?.data || []);
    } else {
      enqueueSnackbar(response?.message || "Failed to fetch data", {
        variant: "error",
      });
      setLeadStatus([]);
    }

    setLoadingList(false);
  }, 400);

  useEffect(() => {
    if (open) {
      fetchLeadStatusList(search);
    }

    return () => {
      fetchLeadStatusList.cancel();
    };
  }, [search, open]);

  const handleSelect = async (status) => {
    if (status?._id === currentStatus?._id) {
      handleClose();
      return;
    }

    try {
      setUpdating(true);

      const res = await _change_lead_status({
        lead_id: leadId,
        lead_status_id: status?._id,
      });

      if (res?.code === 200) {
        enqueueSnackbar("Status updated successfully", {
          variant: "success",
        });

        onStatusChange(status);
        handleClose();
      } else {
        enqueueSnackbar(res?.message || "Failed to update status", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchLeadStatusList("");
  };

  const handleClose = () => {
    if (!updating) setAnchorEl(null);
  };

  return (
    <>
      <Chip
        label={currentStatus?.title || "-"}
        size="small"
        onClick={!disabled ? handleOpen : undefined}
        sx={{
          cursor: "pointer",
          color: currentStatus?.text_color || "#000",
          backgroundColor: currentStatus?.background_color || "#e0e0e0",
          fontWeight: 600,
          border: `1px solid ${currentStatus?.text_color || "#414141"}`,
        }}
      />

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 1, width: 220 }}>
          <TextField
            size="small"
            placeholder="Search status..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {loadingList && (
          <MenuItem>
            <CircularProgress size={18} />
          </MenuItem>
        )}

        {!loadingList && leadStatus.length === 0 && (
          <MenuItem disabled>No Status Found</MenuItem>
        )}

        {!loadingList &&
          leadStatus.map((status) => (
            <MenuItem
              key={status?._id}
              onClick={() => handleSelect(status)}
              disabled={updating}
              selected={status?._id === currentStatus?._id}
            >
              {status?.title}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default LeadStatusChip;
