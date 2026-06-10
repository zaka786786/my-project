import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

const getDateRange = (period) => {
  let start_date, end_date;

  switch (period) {
    case "today":
      start_date = dayjs();
      end_date = dayjs();
      break;

    case "yesterday":
      start_date = dayjs().subtract(1, "day");
      end_date = dayjs().subtract(1, "day");
      break;

    case "this_week":
      start_date = dayjs().startOf("week");
      end_date = dayjs();
      break;

    case "last_week":
      start_date = dayjs().subtract(1, "week").startOf("week");
      end_date = dayjs().subtract(1, "week").endOf("week");
      break;

    case "last_7_days":
      start_date = dayjs().subtract(7, "day");
      end_date = dayjs().subtract(1, "day");
      break;

    case "current_month":
      start_date = dayjs().startOf("month");
      end_date = dayjs().endOf("month");
      break;

    case "last_30_days":
      start_date = dayjs().subtract(30, "day");
      end_date = dayjs().subtract(1, "day");
      break;

    case "last_90_days":
      start_date = dayjs().subtract(90, "day");
      end_date = dayjs().subtract(1, "day");
      break;

    case "last_12_months":
      start_date = dayjs().subtract(1, "year");
      end_date = dayjs().subtract(1, "day");
      break;

    case "last_calendar_year":
      start_date = dayjs().subtract(1, "year").startOf("year");
      end_date = dayjs().subtract(1, "year").endOf("year");
      break;

    case "this_year":
      start_date = dayjs().startOf("year");
      end_date = dayjs();
      break;

    case "current_full_year":
      start_date = dayjs().startOf("year");
      end_date = dayjs().endOf("year");
      break;

    default:
      return { start_date: null, end_date: null };
  }

  return { start_date, end_date };
};

const menuItems = [
  {
    label: "Current Full Year",
    value: "current_full_year",
    dates: getDateRange("current_full_year"),
  },
  { label: "Today", value: "today", dates: getDateRange("today") },
  { label: "Yesterday", value: "yesterday", dates: getDateRange("yesterday") },
  {
    label: "Last week",
    value: "last_week",
    dates: getDateRange("last_week"),
  },
  {
    label: "This week",
    value: "this_week",
    dates: getDateRange("this_week"),
  },
  {
    label: "Last 7 days",
    value: "last_7_days",
    dates: getDateRange("last_7_days"),
  },
  {
    label: "Current Month",
    value: "current_month",
    dates: getDateRange("current_month"),
  },
  {
    label: "Last 30 days",
    value: "last_30_days",
    dates: getDateRange("last_30_days"),
  },
  {
    label: "Last 90 days",
    value: "last_90_days",
    dates: getDateRange("last_90_days"),
  },
  {
    label: "Last 12 Months",
    value: "last_12_months",
    dates: getDateRange("last_12_months"),
  },
  {
    label: "Last calendar year",
    value: "last_calendar_year",
    dates: getDateRange("last_calendar_year"),
  },
  {
    label: "This year (Jan – Today)",
    value: "this_year",
    dates: getDateRange("this_year"),
  },
  {
    label: "Custom",
    value: "custom",
    dates: { start_date: null, end_date: null },
  },
];

const weekDays = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const CustomDateFilter = ({ filterData, setFilterData }) => {
  const [selectedStartDay, setSelectedStartDay] = useState(0);
  const [selectedEndDay, setSelectedEndDay] = useState(6);

  const getWeekDays = (range_type, day_type) => {
    if (range_type === "last_week") {
      if (day_type === "start") return weekDays;
      return weekDays.filter((day) => day.value >= selectedStartDay);
    }
    const today = new Date().getDay();
    if (day_type === "start") {
      return weekDays.filter((day) => day.value <= today);
    }
    return weekDays.filter(
      (day) => day.value >= selectedStartDay && day.value <= today,
    );
  };

  const handleChange = (event) => {
    const { value } = event.target;
    let find_type = menuItems.find((item) => item.value === value);
    if (find_type) {
      const { dates } = find_type;
      setFilterData((old) => ({ ...old, ...dates, range_type: value }));
    }
  };

  const handleSelectOther = (name, value) => {
    setFilterData((values) => ({ ...values, [name]: value }));
  };

  const handleSelectedStartDay = (event) => {
    const { value } = event.target;
    setSelectedStartDay(value);
    let start_date = dayjs().startOf("week");

    if (filterData.range_type === "last_week") {
      start_date = dayjs().subtract(1, "week").startOf("week");
    }

    start_date = start_date.add(value, "day");
    setFilterData((values) => ({ ...values, start_date: start_date }));
  };

  const handleSelectedEndDay = (event) => {
    const { value } = event.target;
    setSelectedEndDay(value);
    let end_date = dayjs().startOf("week");

    if (filterData.range_type === "last_week") {
      end_date = dayjs().subtract(1, "week").startOf("week");
    }

    end_date = end_date.add(value, "day");
    setFilterData((values) => ({ ...values, end_date: end_date }));
  };

  useEffect(() => {
    setSelectedStartDay(0);
    setSelectedEndDay(getWeekDays(filterData.range_type).length - 1);
    //eslint-disable-next-line
  }, [filterData.range_type]);

  return (
    <>
      <div className="col-12 mt-3">
        <FormControl fullWidth sx={{ width: "100%" }}>
          <InputLabel id="demo-simple-select-label">Range Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="range_type"
            value={filterData.range_type}
            label="Range Type"
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            {menuItems.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {(filterData.range_type === "this_week" ||
        filterData.range_type === "last_week") && (
        <>
          <div className="col-12 col-md-12 mt-3">
            <FormControl fullWidth sx={{ width: "100%" }}>
              <InputLabel>Start Day</InputLabel>
              <Select
                value={selectedStartDay}
                label="Start Day"
                onChange={handleSelectedStartDay}
                sx={{ width: "100%" }}
              >
                {getWeekDays(filterData.range_type, "start").map((day) => (
                  <MenuItem key={day.value} value={day.value}>
                    {day.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="col-12 col-md-12 mt-3">
            <FormControl fullWidth sx={{ width: "100%" }}>
              <InputLabel>End Day</InputLabel>
              <Select
                value={selectedEndDay}
                label="End Day"
                onChange={handleSelectedEndDay}
                sx={{ width: "100%" }}
              >
                {getWeekDays(filterData.range_type).map((day) => (
                  <MenuItem key={day.value} value={day.value}>
                    {day.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </>
      )}
      {filterData.range_type === "custom" && (
        <div className="col-12 col-md-12 mt-3">
          <TextField
            type="date"
            label="Start Date"
            name="start_date"
            value={
              filterData.start_date
                ? dayjs(filterData.start_date).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) =>
              handleSelectOther(
                "start_date",
                e.target.value ? dayjs(e.target.value) : null,
              )
            }
            required={true}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              max: filterData.end_date
                ? dayjs(filterData.end_date).format("YYYY-MM-DD")
                : undefined,
            }}
          />
        </div>
      )}
      {filterData.range_type === "custom" && (
        <div className="col-12 col-md-12 mt-3">
          <TextField
            type="date"
            label="End Date"
            name="end_date"
            value={
              filterData.end_date
                ? dayjs(filterData.end_date).format("YYYY-MM-DD")
                : ""
            }
            onChange={(e) =>
              handleSelectOther(
                "end_date",
                e.target.value ? dayjs(e.target.value) : null,
              )
            }
            required={true}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: filterData.start_date
                ? dayjs(filterData.start_date).format("YYYY-MM-DD")
                : undefined,
            }}
          />
        </div>
      )}
    </>
  );
};

export default CustomDateFilter;
