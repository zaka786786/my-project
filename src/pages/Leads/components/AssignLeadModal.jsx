import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { _assign_lead } from "../../../DAL/Leads/leads";
import CustomAutocomplete from "../../../components/CustomeAutoComplete/CustomAutoComplete";

const AssignLeadModal = ({
  open,
  onClose,
  onAssignSuccess = () => {},
  row,
}) => {
  const [assignTo, setAssignTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!assignTo?.user_id?._id && !assignTo?.value) {
      enqueueSnackbar("Please select user", { variant: "error" });
      return;
    }

    try {
      setLoading(true);

      const res = await _assign_lead({
        lead_id: row?._id,
        assign_to_id: assignTo?.user_id?._id || assignTo?.value,
      });

      if (res?.code === 200) {
        enqueueSnackbar("Lead assigned successfully", {
          variant: "success",
        });

        onAssignSuccess(res);
        onClose();
        setAssignTo(null);
      } else {
        enqueueSnackbar(res?.message || "Failed to assign lead", {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (row?.assigned_to) {
      setAssignTo({
        label: `${row.assigned_to.first_name || ""} ${row.assigned_to.last_name || ""}`,
        value: row.assigned_to.user_id,
        ...row.assigned_to,
      });
    } else {
      setAssignTo(null);
    }
  }, [row]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Assign Lead</DialogTitle>

      <DialogContent>
        <CustomAutocomplete
          label="Assign To"
          value={assignTo}
          onChange={(val) => setAssignTo(val)}
          options={null}
          getOptionLabel={(option) => option?.label || ""}
          type="business_filter"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignLeadModal;
