import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import moment from "moment";
import Iconify from "../../../components/Iconify";

const dateRanges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 28 Days", value: "last_28_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Custom", value: "custom" },
];

export const FilterDrawer = ({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  handleFilter,
  rangeType,
  setRangeType,
  handleClearAllFilter,
}) => {
  const handleRangeChange = (value) => {
    setRangeType(value);

    const today = moment();
    let start, end;

    switch (value) {
      case "today":
        start = end = today.clone();
        break;
      case "yesterday":
        start = end = today.clone().subtract(1, "day");
        break;
      case "this_week":
        start = today.clone().startOf("week");
        end = today.clone().endOf("week");
        break;
      case "last_week":
        start = today.clone().subtract(1, "week").startOf("week");
        end = today.clone().subtract(1, "week").endOf("week");
        break;
      case "last_7_days":
        start = today.clone().subtract(6, "days");
        end = today.clone();
        break;
      case "last_28_days":
        start = today.clone().subtract(27, "days");
        end = today.clone();
        break;
      case "last_30_days":
        start = today.clone().subtract(29, "days");
        end = today.clone();
        break;
      default:
        return;
    }

    setStartDate(start.format("YYYY-MM-DD"));
    setEndDate(end.format("YYYY-MM-DD"));
  };

  return (
    <div className="col-12 mt-3">
      <Box
        className="d-flex flex-wrap align-items-center gap-2 p-3 rounded shadow-sm"
        sx={{ backgroundColor: "#f9f9f9" }}
      >
        <FormControl size="small" className="col-12">
          <InputLabel>Date Range</InputLabel>
          <Select
            value={rangeType}
            onChange={(e) => handleRangeChange(e.target.value)}
            label="Date Range"
          >
            {dateRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {rangeType === "custom" && (
          <>
            <div className="d-flex flex-column col-12">
              <label className="form-label fw-semibold small text-muted mb-1">
                Start Date
              </label>
              <TextField
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="d-flex flex-column col-12">
              <label className="form-label fw-semibold small text-muted mb-1">
                End Date
              </label>
              <TextField
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </>
        )}

        <Button
          variant="contained"
          size="medium"
          className="ms-auto mt-3"
          sx={{ height: 40, minWidth: 100 }}
          onClick={handleFilter}
          disabled={!startDate || !endDate}
          startIcon={<FilterListIcon />}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          size="medium"
          className="mt-3"
          sx={{ height: 40, minWidth: 100, ml: 1 }}
          onClick={handleClearAllFilter}
          startIcon={<Iconify icon="ic:round-clear" />}
        >
          Clear Filter
        </Button>
      </Box>
    </div>
  );
};
