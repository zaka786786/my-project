import React, { useState } from "react";
import { Box, Typography, Stack, TextField, Button } from "@mui/material";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import CustomAutocomplete from "../../../../components/CustomeAutoComplete/CustomAutoComplete";
import { _partial_update_lead_by_id } from "../../../../DAL/Leads/leads";

const LeadUpdateCard = ({
  lead,
  sectionStyle,
  labelStyle,
  setLead,
  setLeadHistory,
}) => {
  const [form, setForm] = useState({
    lead_status_id: lead?.lead_status || null,

    assign_to_id: lead?.assigned_to
      ? {
          label: `${lead.assigned_to.first_name || ""} ${lead.assigned_to.last_name || ""}`,
          value: lead.assigned_to.user_id,
          ...lead.assigned_to,
        }
      : null,

    follow_up_date: lead?.follow_up_date
      ? moment(lead.follow_up_date).format("YYYY-MM-DDTHH:mm")
      : "",
  });

  const [submitLoader, setSubmitLoader] = useState(false);

  const handleSubmit = async () => {
    if (!form?.lead_status_id?._id) {
      enqueueSnackbar("Lead status required", {
        variant: "error",
      });
      return;
    }

    if (!form?.assign_to_id?.user_id) {
      enqueueSnackbar("Assign to required", {
        variant: "error",
      });
      return;
    }

    const postData = {
      lead_status_id: form?.lead_status_id?._id,
      assign_to_id: form?.assign_to_id?.user_id?._id,
    };

    if (form?.follow_up_date) {
      postData.follow_up_date = new Date(form?.follow_up_date).toISOString();
    }

    setSubmitLoader(true);

    const response = await _partial_update_lead_by_id(postData, lead?._id);

    if (response?.code === 200) {
      setLead((prev) => ({
        ...prev,
        ...(response?.lead || {}),
      }));

      setLeadHistory((prev) => [...(response?.lead_history || []), ...prev]);

      enqueueSnackbar("Lead updated successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(response?.message || "Failed", {
        variant: "error",
      });
    }

    setSubmitLoader(false);
  };

  return (
    <Box sx={sectionStyle}>
      <Typography sx={labelStyle}>Update Lead</Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <CustomAutocomplete
          label="Lead Status"
          value={form?.lead_status_id || null}
          onChange={(newValue) => {
            setForm((prev) => ({
              ...prev,
              lead_status_id: newValue,
            }));
          }}
          options={null}
          getOptionLabel={(option) => option?.title || ""}
          required={true}
          type="lead_status"
          size="small"
        />

        <CustomAutocomplete
          label="Assign To"
          value={form?.assign_to_id || null}
          onChange={(newValue) => {
            setForm((prev) => ({
              ...prev,
              assign_to_id: newValue,
            }));
          }}
          options={null}
          getOptionLabel={(option) =>
            option?.label ||
            `${option?.first_name || ""} ${option?.last_name || ""}`
          }
          type="business_filter"
          required={true}
          size="small"
        />

        <TextField
          label="Follow-up Date"
          fullWidth
          size="small"
          type="datetime-local"
          value={form?.follow_up_date || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              follow_up_date: e.target.value,
            }))
          }
          InputLabelProps={{ shrink: true }}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={
            submitLoader || !form?.lead_status_id || !form?.assign_to_id
          }
          onClick={handleSubmit}
          size="small"
          sx={{
            bgcolor: "#5792c9",
            py: 0.75,
            "&:hover": { bgcolor: "#4475a3" },
          }}
        >
          {submitLoader ? "Updating..." : "Update Lead"}
        </Button>
      </Stack>
    </Box>
  );
};

export default LeadUpdateCard;
