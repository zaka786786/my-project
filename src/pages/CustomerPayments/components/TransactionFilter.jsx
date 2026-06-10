import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { useState } from "react";
import { _get_common_business_categories } from "../../../DAL/BusinessCategories/business_categories";
import { enqueueSnackbar } from "notistack";
import { formatFullName } from "../../../utils/domUtils";

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

const TransactionFilter = ({
  filterData,
  setFilterData,
  searchFunction,
  handleClearFilter,
}) => {
  const [selectedStartDay, setSelectedStartDay] = useState(0);
  const [selectedEndDay, setSelectedEndDay] = useState(6);
  const [businessList, setBusinessList] = useState([]);

  const FetchBusinessCustomers = async () => {
    const response = await _get_common_business_categories({
      type: "business",
    });
    if (response.code === 200) {
      let filteredData = response.data.map((item) => ({
        ...item,
        id: item._id,
        label: formatFullName(item.first_name, item.last_name),
      }));
      setBusinessList(filteredData);
    } else {
      enqueueSnackbar(response.message || "Failed to fetch data", {
        variant: "error",
      });
    }
  };

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
      (day) => day.value >= selectedStartDay && day.value <= today
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

  useEffect(() => {
    FetchBusinessCustomers();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid new-memories mt-3">
      <div className="row">
        <div className="col-12 mt-3">
          <Autocomplete
            fullWidth
            options={businessList || []}
            getOptionLabel={(customer) => (customer ? customer.label : "")}
            value={filterData.customer || null}
            onChange={(event, newValue) => {
              handleSelectOther("customer", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Business Customer"
                placeholder="Select Business customer"
                sx={{ width: "100%" }}
              />
            )}
          />
        </div>
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
                e.target.value ? dayjs(e.target.value) : null
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
                e.target.value ? dayjs(e.target.value) : null
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
      </div>
      <Box sx={{ py: 2 }}>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={searchFunction}
          startIcon={
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: 5 }}
            >
              <path
                d="M13.1165 0.25H0.883548C0.321452 0.25 0.0378205 0.932013 0.436097 1.33029L5.3125 6.20743V11.6406C5.3125 11.8471 5.41325 12.0406 5.58242 12.1591L7.69179 13.6351C8.10794 13.9264 8.6875 13.6312 8.6875 13.1167V6.20743L13.564 1.33029C13.9615 0.932804 13.6798 0.25 13.1165 0.25Z"
                // fill={get_root_value("--portal-theme-primary")}
              />
            </svg>
          }
        >
          Filter
        </Button>
      </Box>
      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="outlined"
        className="mb-3"
        onClick={handleClearFilter}
        startIcon={<Icon icon={roundClearAll} />}
      >
        Clear All
      </Button>
    </div>
  );
};

export default TransactionFilter;
