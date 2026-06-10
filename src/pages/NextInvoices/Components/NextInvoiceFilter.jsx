import React, { useEffect } from "react";
import { Box, Button, TextField, Autocomplete } from "@mui/material";
import { Icon } from "@iconify/react";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import { useState } from "react";
import { _get_common_business_categories } from "../../../DAL/BusinessCategories/business_categories";
import { enqueueSnackbar } from "notistack";
import { formatFullName } from "../../../utils/domUtils";
import CustomAutocomplete from "../../../components/CustomeAutoComplete/CustomAutoComplete";

const NextInvoiceFilter = ({
  filterData,
  setFilterData,
  searchFunction,
  handleClearFilter,
}) => {
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

  const handleSelectOther = (name, value) => {
    setFilterData((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    FetchBusinessCustomers();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid new-memories mt-3">
      <div className="row">
        <div className="col-12 mt-3">
          <CustomAutocomplete
            label="Business Customer"
            placeholder="Select Business Customer"
            value={filterData.customer}
            onChange={(newValue) => {
              handleSelectOther("customer", newValue);
            }}
            options={null}
            type="business_filter"
            required={true}
          />
        </div>
        <div className="col-12 mt-3">
          <CustomAutocomplete
            label="Plan"
            placeholder="Select Plan"
            value={filterData.plan}
            onChange={(newValue) => {
              handleSelectOther("plan", newValue);
            }}
            options={null}
            type="plan_filter"
            required={true}
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

export default NextInvoiceFilter;
