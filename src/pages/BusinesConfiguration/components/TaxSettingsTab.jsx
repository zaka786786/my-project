import React, { useEffect } from "react";
import {
  Card,
  FormControlLabel,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";
import Iconify from "../../../components/Iconify";

const TaxSettingsTab = ({ formInputs, handleFormInputsChange }) => {
  // Auto-enable FBR tax and calculate value based on province and federal tax
  useEffect(() => {
    // Auto-enable FBR if either province or federal tax is enabled
    if (formInputs.province_tax_enabled || formInputs.federal_tax_enabled) {
      // Enable FBR tax
      handleFormInputsChange({
        target: {
          name: "fbr_tax_enabled",
          value: true,
        },
      });

      // Calculate FBR value based on enabled taxes
      let fbrValue = 0;
      let fbrType = "percentage";

      if (formInputs.province_tax_enabled && formInputs.federal_tax_enabled) {
        // Both are enabled - add them
        if (
          formInputs.province_tax_type === "percentage" &&
          formInputs.federal_tax_type === "percentage"
        ) {
          fbrValue =
            formInputs.province_tax_value + formInputs.federal_tax_value;
          fbrType = "percentage";
        } else if (
          formInputs.province_tax_type === "fixed" &&
          formInputs.federal_tax_type === "fixed"
        ) {
          fbrValue =
            formInputs.province_tax_value + formInputs.federal_tax_value;
          fbrType = "fixed";
        } else {
          // Mixed types - convert to fixed amount
          fbrValue =
            formInputs.province_tax_value + formInputs.federal_tax_value;
          fbrType = "fixed";
        }
      } else if (formInputs.province_tax_enabled) {
        // Only province tax is enabled
        fbrValue = formInputs.province_tax_value;
        fbrType = formInputs.province_tax_type;
      } else if (formInputs.federal_tax_enabled) {
        // Only federal tax is enabled
        fbrValue = formInputs.federal_tax_value;
        fbrType = formInputs.federal_tax_type;
      }

      // Set FBR tax type
      handleFormInputsChange({
        target: {
          name: "fbr_tax_type",
          value: fbrType,
        },
      });

      // Set FBR tax value
      handleFormInputsChange({
        target: {
          name: "fbr_tax_value",
          value: fbrValue,
        },
      });
    } else {
      // Disable FBR tax if neither province nor federal tax is enabled
      handleFormInputsChange({
        target: {
          name: "fbr_tax_enabled",
          value: false,
        },
      });
    }
  }, [
    formInputs.province_tax_value,
    formInputs.federal_tax_value,
    formInputs.province_tax_type,
    formInputs.federal_tax_type,
    formInputs.province_tax_enabled,
    formInputs.federal_tax_enabled,
  ]);

  // const handleTaxChange = (taxType, field, value) => {
  //   handleFormInputsChange({
  //     target: {
  //       name: `${taxType}_${field}`,
  //       value: value,
  //     },
  //   });
  // };
  const handleTaxChange = (taxType, field, value) => {
    handleFormInputsChange({
      target: {
        name: `${taxType}_${field}`,
        value: value,
      },
    });

    // Keep tax types in sync
    if (field === "type") {
      const otherTaxType =
        taxType === "province_tax" ? "federal_tax" : "province_tax";
      handleFormInputsChange({
        target: {
          name: `${otherTaxType}_type`,
          value: value,
        },
      });
    }
  };

  // Helper function to handle tax value changes with percentage validation
  const handleTaxValueChange = (taxType, value, taxTypeValue) => {
    const inputValue = parseFloat(value);

    // Allow empty string
    if (value === "") {
      handleTaxChange(taxType, "value", "");
      return;
    }

    // Check if input is a valid number and non-negative
    if (inputValue >= 0) {
      // If it's a percentage, ensure it doesn't exceed 100
      if (taxTypeValue === "percentage" && inputValue > 100) {
        handleTaxChange(taxType, "value", 100);
      } else {
        handleTaxChange(taxType, "value", inputValue);
      }
    }
  };

  return (
    <Card className="p-4 shadow-md border-0 rounded-4 mb-4 business-customer-tabs-card">
      <div className="row gy-3">
        {/* Enable Taxation System */}
        <div className="col-12">
          <FormControlLabel
            control={
              <Checkbox
                checked={formInputs.taxation_enabled}
                onChange={(e) =>
                  handleFormInputsChange({
                    target: {
                      name: "taxation_enabled",
                      value: e.target.checked,
                    },
                  })
                }
                icon={
                  <Iconify
                    icon="mdi:checkbox-blank-outline"
                    width={22}
                    height={22}
                  />
                }
                checkedIcon={
                  <Iconify icon="mdi:checkbox-marked" width={22} height={22} />
                }
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                Do you Want to enable taxation system
              </Box>
            }
          />
        </div>

        {formInputs.taxation_enabled && (
          <>
            {/* Province Tax */}
            <div className="col-12">
              <Typography variant="h6" className="mb-2 label-text">
                <Iconify icon="mdi:map" className="me-2 tabs-icon-color" />
                Provincial Sales Tax
              </Typography>

              <div className="row gy-3 align-items-end">
                <div className="col-md-4">
                  <FormControl fullWidth size="small">
                    <Select
                      value={
                        formInputs.province_tax_enabled ? "Enabled" : "Disabled"
                      }
                      onChange={(e) =>
                        handleTaxChange(
                          "province_tax",
                          "enabled",
                          e.target.value === "Enabled"
                        )
                      }
                    >
                      <MenuItem value="Enabled">Enabled</MenuItem>
                      <MenuItem value="Disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {formInputs.province_tax_enabled && (
                  <>
                    <div className="col-md-4">
                      <FormControl fullWidth size="small">
                        <InputLabel>Tax Type *</InputLabel>
                        <Select
                          value={formInputs.province_tax_type}
                          label="Tax Type *"
                          onChange={(e) =>
                            handleTaxChange(
                              "province_tax",
                              "type",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="percentage">Percentage</MenuItem>
                          <MenuItem value="fixed">Fixed Amount</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className="col-md-4">
                      <TextField
                        fullWidth
                        size="small"
                        label={
                          formInputs.province_tax_type === "percentage"
                            ? "Percentage *"
                            : "Amount *"
                        }
                        type="number"
                        value={formInputs.province_tax_value}
                        onChange={(e) =>
                          handleTaxValueChange(
                            "province_tax",
                            e.target.value,
                            formInputs.province_tax_type
                          )
                        }
                        onKeyDown={(e) => {
                          // Block typing of "-" and "e" and "+"
                          if (
                            e.key === "-" ||
                            e.key === "e" ||
                            e.key === "+" ||
                            e.key === "E"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {formInputs.province_tax_type === "percentage"
                                ? "%"
                                : "Rs"}
                            </InputAdornment>
                          ),
                        }}
                        // helperText={
                        //   formInputs.province_tax_type === "percentage"
                        //     ? "Maximum 100%"
                        //     : ""
                        // }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Federal Tax */}
            <div className="col-12">
              <Typography variant="h6" className="mb-2 label-text">
                <Iconify icon="mdi:flag" className="me-2 tabs-icon-color" />
                Federal Sales Tax
              </Typography>

              <div className="row gy-3 align-items-end">
                <div className="col-md-4">
                  <FormControl fullWidth size="small">
                    <Select
                      value={
                        formInputs.federal_tax_enabled ? "Enabled" : "Disabled"
                      }
                      onChange={(e) =>
                        handleTaxChange(
                          "federal_tax",
                          "enabled",
                          e.target.value === "Enabled"
                        )
                      }
                    >
                      <MenuItem value="Enabled">Enabled</MenuItem>
                      <MenuItem value="Disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {formInputs.federal_tax_enabled && (
                  <>
                    <div className="col-md-4">
                      <FormControl fullWidth size="small">
                        <InputLabel>Tax Type *</InputLabel>
                        <Select
                          value={formInputs.federal_tax_type}
                          label="Tax Type *"
                          onChange={(e) =>
                            handleTaxChange(
                              "federal_tax",
                              "type",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="percentage">Percentage</MenuItem>
                          <MenuItem value="fixed">Fixed Amount</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className="col-md-4">
                      <TextField
                        fullWidth
                        size="small"
                        label={
                          formInputs.federal_tax_type === "percentage"
                            ? "Percentage *"
                            : "Amount *"
                        }
                        type="number"
                        value={formInputs.federal_tax_value}
                        onChange={(e) =>
                          handleTaxValueChange(
                            "federal_tax",
                            e.target.value,
                            formInputs.federal_tax_type
                          )
                        }
                        onKeyDown={(e) => {
                          // Block typing of "-" and "e" and "+"
                          if (
                            e.key === "-" ||
                            e.key === "e" ||
                            e.key === "+" ||
                            e.key === "E"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {formInputs.federal_tax_type === "percentage"
                                ? "%"
                                : "Rs"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* FBR Tax */}
            <div className="col-12">
              <Typography variant="h6" className="mb-2 label-text">
                <Iconify icon="mdi:receipt" className="me-2 tabs-icon-color" />
                FBR Tax{" "}
                {(formInputs.province_tax_enabled ||
                  formInputs.federal_tax_enabled) && (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ color: "text.secondary", ml: 1 }}
                  >
                    (Auto-enabled when Province or Federal tax is enabled)
                  </Typography>
                )}
              </Typography>

              <div className="row gy-3 align-items-end">
                <div className="col-md-4">
                  <FormControl fullWidth size="small">
                    <Select
                      value={
                        formInputs.fbr_tax_enabled ? "Enabled" : "Disabled"
                      }
                      // disabled={formInputs.province_tax_enabled || formInputs.federal_tax_enabled}
                      disabled={true}
                      onChange={(e) =>
                        handleTaxChange(
                          "fbr_tax",
                          "enabled",
                          e.target.value === "Enabled"
                        )
                      }
                    >
                      <MenuItem value="Enabled">Enabled</MenuItem>
                      <MenuItem value="Disabled">Disabled</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {formInputs.fbr_tax_enabled && (
                  <>
                    <div className="col-md-4">
                      <FormControl fullWidth size="small">
                        <InputLabel>Tax Type *</InputLabel>
                        <Select
                          value={formInputs.fbr_tax_type}
                          label="Tax Type *"
                          disabled
                        >
                          <MenuItem value="percentage">Percentage</MenuItem>
                          <MenuItem value="fixed">Fixed Amount</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className="col-md-4">
                      <TextField
                        fullWidth
                        size="small"
                        label={
                          formInputs.fbr_tax_type === "percentage"
                            ? "Percentage *"
                            : "Amount *"
                        }
                        value={formInputs.fbr_tax_value}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Iconify icon="mdi:lock" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              {formInputs.fbr_tax_type === "percentage"
                                ? "%"
                                : "Rs"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* FBR Invoice Settings */}
            {formInputs.fbr_tax_enabled === true && (
              <div className="col-12">
                <Typography variant="h6" className="mb-2 label-text ">
                  <Iconify
                    icon="mdi:file-document"
                    className="me-2 tabs-icon-color"
                  />
                  Do you want to use FBR Invoice?
                </Typography>
                <div className="row"></div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default TaxSettingsTab;
