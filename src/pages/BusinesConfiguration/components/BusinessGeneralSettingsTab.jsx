import React from "react";
import {
  Card,
  TextField,
  Autocomplete,
  InputAdornment,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import CustomLabeledInput from "../../../components/CustomLabeledInput/CustomLabeledInput";
import Iconify from "../../../components/Iconify";
import Select from "react-select/creatable";
import currencyCodes from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";
import ImageUploadField from "../../../components/ImageUploadField";
import FbrInfo from "./FbrInfo";
import { Icon } from "@iconify/react/dist/iconify.js";
import Editor from "../../../components/editor/Editor";

const currencies = currencyCodes.data.map((c) => ({
  code: c.code,
  name: c.currency,
  symbol: getSymbolFromCurrency(c.code),
}));

const productTypeOptions = [
  { value: "standard", label: "Standard" },
  { value: "service", label: "Service" },
  { value: "variant", label: "Variant" },
];

// NTN/CNIC validation helper function
const validateNTNCNIC = (value) => {
  if (!value) return false;

  // Remove any dashes or spaces for validation
  const cleanValue = value.replace(/[- ]/g, "");

  // Check if all characters are numeric
  if (!/^\d+$/.test(cleanValue)) {
    return false;
  }

  // CNIC validation (13 digits) or Business NTN validation (7-8 digits)
  return (
    cleanValue.length === 13 ||
    cleanValue.length === 7 ||
    cleanValue.length === 8
  );
};

const BusinessGeneralSettingsTab = ({
  formInputs,
  handleFormInputsChange,
  businessTypeList,
  setFormInputs,
  paymentsPlansList,
}) => {
  console.log(
    formInputs.payment_plan,
    "formInputs.payment_planformInputs.payment_planformInputs.payment_plan"
  );

  return (
    <Card className="p-4 shadow-md border-0 rounded-4 mb-4 business-customer-tabs-card">
      <div className="row gy-3">
        {/* Business Name */}
        <div className="col-12 col-md-4">
          <CustomLabeledInput
            label="Business Name*"
            icon="mdi:office-building"
            name="business_name"
            value={formInputs.business_name}
            onChange={handleFormInputsChange}
            placeholder="Enter business name"
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-medium mb-2">
            <Iconify
              icon="tdesign:location-1"
              className="me-1 text-primary"
              sx={{
                fontSize: "1.2rem",
              }}
            />
            NTN / CNIC
          </label>
          <TextField
            fullWidth
            size="small"
            name="ntn_cnic"
            type="text"
            value={formInputs.ntn_cnic}
            onChange={handleFormInputsChange}
            variant="outlined"
            placeholder="Please Enter your CNIC / NTN (7-8 digits for NTN, 13 digits for CNIC)"
            inputProps={{
              maxLength: 13,
              inputMode: "numeric",
            }}
            error={formInputs.ntn_cnic && !validateNTNCNIC(formInputs.ntn_cnic)}
            helperText={
              formInputs.ntn_cnic && !validateNTNCNIC(formInputs.ntn_cnic)
                ? "NTN/CNIC must be 7-8 digits (business NTN) or 13 digits (CNIC)"
                : ""
            }
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-medium mb-2">
            <Iconify
              icon="tdesign:location-1"
              className="me-1 text-primary"
              sx={{
                fontSize: "1.2rem",
              }}
            />
            Province*
          </label>

          <Select
            options={[
              { value: "punjab", label: "Punjab" },
              { value: "sindh", label: "Sindh" },
              { value: "khyber-pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
              { value: "balochistan", label: "Balochistan" },
              {
                value: "islamabad-capital-territory",
                label: "Islamabad Capital Territory",
              },
              { value: "gilgit-baltistan", label: "Gilgit-Baltistan" },
              {
                value: "azad-jammu-and-kashmir",
                label: "Azad Jammu and Kashmir",
              },
            ]}
            value={
              formInputs.province
                ? {
                    value: formInputs.province,
                    label:
                      formInputs.province === "punjab"
                        ? "Punjab"
                        : formInputs.province === "sindh"
                        ? "Sindh"
                        : formInputs.province === "khyber-pakhtunkhwa"
                        ? "Khyber Pakhtunkhwa"
                        : formInputs.province === "balochistan"
                        ? "Balochistan"
                        : formInputs.province === "islamabad-capital-territory"
                        ? "Islamabad Capital Territory"
                        : formInputs.province === "gilgit-baltistan"
                        ? "Gilgit-Baltistan"
                        : formInputs.province === "azad-jammu-and-kashmir"
                        ? "Azad Jammu and Kashmir"
                        : formInputs.province,
                  }
                : null
            }
            onChange={(selectedOption) => {
              handleFormInputsChange({
                target: {
                  name: "province",
                  value: selectedOption ? selectedOption.value : "",
                },
              });
            }}
            placeholder="Select province"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "38px",
                fontSize: "0.875rem",
                borderColor: state.isFocused ? "#5792C9" : "#ced4da",
                boxShadow: state.isFocused
                  ? "0 0 0 0.2rem rgba(87, 146, 201, 0.25)"
                  : null,
                "&:hover": {
                  borderColor: "#5792C9",
                },
              }),
            }}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-medium mb-2">
            <Iconify
              icon="tdesign:location-1"
              className="me-1 text-primary"
              sx={{
                fontSize: "1.2rem",
              }}
            />
            City*
          </label>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            name="city"
            value={formInputs.city}
            onChange={handleFormInputsChange}
          />
        </div>

        {/* Supplier Address */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-medium mb-2">
            <Iconify
              icon="streamline-cyber:location-map"
              className="me-1 text-primary"
              sx={{
                fontSize: "1.2rem",
              }}
            />
            Address*
          </label>
          <TextField
            fullWidth
            required
            size="small"
            variant="outlined"
            name="address"
            value={formInputs.address}
            onChange={handleFormInputsChange}
          />
        </div>

        {/* Currency Selector */}
        <div className="col-12 col-md-4">
          <label className="form-label label-text d-flex align-items-center mb-2">
            <Iconify
              icon="mdi:currency-usd"
              width={22}
              height={22}
              className="me-1 tabs-icon-color"
            />
            Currency*
          </label>
          <Autocomplete
            fullWidth
            options={currencies}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            value={formInputs.currency || null}
            onChange={(event, newValue) => {
              handleFormInputsChange({
                target: {
                  name: "currency",
                  value: newValue ?? null,
                },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                placeholder="Select currency"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {formInputs.currency?.symbol && (
                        <InputAdornment position="end">
                          {formInputs.currency.symbol}
                        </InputAdornment>
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </div>

        {/* Product Types */}
        <div className="col-12 col-md-4">
          <label className="form-label  mb-2 label-text d-flex align-items-center">
            <Iconify
              icon="mdi:shape-outline"
              width={22}
              height={22}
              className="me-1 tabs-icon-color"
            />
            Product Types*
          </label>
          <Select
            isMulti
            options={productTypeOptions}
            value={(formInputs.product_types || []).map((type) => ({
              label: type?.label || type,
              value: type?.value || type,
            }))}
            onChange={(selectedOptions) => {
              const types = selectedOptions
                ? selectedOptions.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                  }))
                : [];
              handleFormInputsChange({
                target: {
                  name: "product_types",
                  value: types,
                },
              });
            }}
            placeholder="Select or type to add product types"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: "38px",
                fontSize: "0.875rem",
                borderColor: state.isFocused ? "#5792C9" : "#ced4da",
                boxShadow: state.isFocused
                  ? "0 0 0 0.2rem rgba(87, 146, 201, 0.25)"
                  : null,
                "&:hover": {
                  borderColor: "#5792C9",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#5792C9",
                borderRadius: "0.375rem",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
                fontWeight: 500,
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "white",
                ":hover": {
                  // backgroundColor: "white",
                  color: "red",
                  cursor: "pointer",
                },
              }),
            }}
          />
        </div>

        <div className="col-12 col-md-4 ">
          <label className="form-label fw-medium mb-2">
            <Iconify
              icon="mdi:domain"
              className="me-1 tabs-icon-color"
              width={22}
              height={22}
            />
            Business Category*
          </label>
          <Autocomplete
            fullWidth
            options={businessTypeList}
            getOptionLabel={(option) => option.title || ""}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={formInputs.category || null}
            onChange={(event, newValue) => {
              handleFormInputsChange({
                target: {
                  name: "category",
                  value: newValue || {
                    _id: "",
                    title: "",
                    alias_title: "",
                  },
                },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                placeholder="Select business category"
                required
              />
            )}
          />
        </div>

        {/* <div className="col-12">
          <hr />
        </div> */}

        {/* <div className="row mt-2 plan-details-container ">
          <h4 className="mb-3">Plan Details</h4>
          <div className="col-12 col-md-4">
            <label className="form-label label-text d-flex align-items-center mb-2">
              <Iconify
                icon="mdi:credit-card-outline"
                width={22}
                height={22}
                className="me-1 tabs-icon-color"
              />
              Payment Plan*
            </label>
            <Autocomplete
              fullWidth
              options={paymentsPlansList}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={formInputs?.payment_plan || null}
              onChange={(event, newValue) => {
                handleFormInputsChange({
                  target: {
                    name: "payment_plan",
                    value: newValue || null,
                  },
                });
              }}
              renderOption={(props, option) => (
                <Box
                  {...props}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    padding: "6px 8px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: "#333",
                      }}
                    >
                      {option.label || "Unnamed Plan"}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexShrink: 0,
                      }}
                    >
                      {option.price > 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666",
                            fontWeight: 500,
                            fontSize: "0.7rem",
                          }}
                        >
                          Rs {option.price}
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            option.plan_type === "yearly" || !option.plan_type
                              ? "#7b1fa2"
                              : "#f57c00",
                          fontWeight: 600,
                          fontSize: "0.65rem",
                          textTransform: "capitalize",
                          backgroundColor:
                            option.plan_type === "yearly" || !option.plan_type
                              ? "rgba(156, 39, 176, 0.08)"
                              : "rgba(255, 152, 0, 0.08)",
                          padding: "1px 6px",
                          borderRadius: "8px",
                        }}
                      >
                        {option.plan_type ? option.plan_type : "Free Plan"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  variant="outlined"
                  placeholder="Select payment plan"
                  required
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.87)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--primary-color)",
                      },
                    },
                  }}
                />
              )}
            />
          </div>

          {!formInputs?.payment_plan?.is_plan_free &&
            formInputs?.payment_plan && (
              <div className="col-12 col-md-4">
                <CustomLabeledInput
                  label="Invoice Start Date*"
                  icon="mdi:calendar-start"
                  name="invoice_start_date"
                  type="date"
                  value={formInputs.invoice_start_date}
                  onChange={handleFormInputsChange}
                  placeholder="Select invoice start date"
                  required
                />
              </div>
            )}
        </div> */}

        <div className="col-12">
          <hr />
        </div>

        {/* Upfront Payment */}

        {/* Business Logo Upload */}

        <ImageUploadField
          label="Upload Business Logo"
          name="business_logo"
          helperText='Image Size (300 X 300) ("JPG", "JPEG", "PNG", "WEBP")'
          previewSize={{ width: 80, height: 80 }}
          formInputs={formInputs}
          handleFormInputsChange={handleFormInputsChange}
        />

        {/* Favicon Upload */}

        <ImageUploadField
          label="Upload Business Favicon"
          name="favicon"
          helperText='Image Size (32 X 32) ("JPG", "JPEG", "PNG", "WEBP")'
          previewSize={{ width: 80, height: 80 }}
          formInputs={formInputs}
          handleFormInputsChange={handleFormInputsChange}
        />

        {/* <div className="mt-4 mb-3">
          <label className="form-label mb-2 label-text d-flex align-items-center">
            <Icon
              icon={"material-symbols:domain-verification-outline"}
              className="me-1 tabs-icon-color label-icon-setting"
            />
            Terms Description For Invoice
          </label>

          <div className="col-12">
            <Editor
              value={formInputs?.terms_description_for_invoice}
              onChange={(value) =>
                handleFormInputsChange({
                  target: { name: "terms_description_for_invoice", value },
                })
              }
              name="description"
              placeholder="Enter Terms Description For Invoice"
            />
          </div>
        </div> */}

        {/* Payment Plan Selection */}
      </div>
    </Card>
  );
};

export default BusinessGeneralSettingsTab;
