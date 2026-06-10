import { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Button,
} from "@mui/material";
import SelectionModal from "../SelectionModal";
import { Type_Base_Listing_FBR } from "../../DAL/GeneralApis/Details";

const FbrInfoGeneric = ({
  formInputs,
  handleChange,
  showTransactionType = true,
  showHsCode = true,
  showSchedule = false, // New prop to control schedule visibility
  showSroItemDescription = false, // New prop to control SRO item description visibility
  transactionTypeLabel = "Transaction Type",
  transactionTypePlaceholder = "Search and select Transaction Type",
  transactionTypeFieldClass = "",
  RateIdFieldClass = "",
  RateFieldClass = "",
  UomFieldClass = "",
  UomIdFieldClass = "",
  UOMDescriptionFieldClass = "",
  SroIdFieldClass = "",
  SroSerialNoFieldClass = "",
  SroDescriptionFieldClass = "",
  SroItemDescriptionFieldClass = "",
  hsCodeRequired = false,
  transactionTypeRequired = false,
  setProfile,
  from_core_state = false,
  user_id,
}) => {
  // State management
  const [transactionTypeOptions, setTransactionTypeOptions] = useState([]);
  const [hsCodeOptions, setHsCodeOptions] = useState([]);
  const [loadingTransactionType, setLoadingTransactionType] = useState(false);
  const [loadingHsCode, setLoadingHsCode] = useState(false);
  const [taxRateModalOpen, setTaxRateModalOpen] = useState(false);
  const [taxRateData, setTaxRateData] = useState([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  const [uomModalOpen, setUomModalOpen] = useState(false);
  const [selectedHsCode, setSelectedHsCode] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [loadingUomData, setLoadingUomData] = useState(false);
  const [loadingTaxRateData, setLoadingTaxRateData] = useState(false);

  // Schedule states
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [loadingScheduleData, setLoadingScheduleData] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  // SRO Item states
  const [sroItemOptions, setSroItemOptions] = useState([]);
  const [loadingSroItem, setLoadingSroItem] = useState(false);

  // API functions
  const fetchTransactionTypes = async (
    search = "",
    value = "",
    type = "transaction_type"
  ) => {
    if (type === "transaction_type_with_tax") {
      setLoadingTaxRateData(true);
    } else {
      setLoadingTransactionType(true);
    }

    try {
      const response = await Type_Base_Listing_FBR(
        {
          type: type || "transaction_type",
          search: search || "",
          id: value?.toString() || "",
        },
        user_id
      );

      if (response.code === 200) {
        if (type === "transaction_type_with_tax") {
          // For tax rates, transform the data
          const transformedData = response.data.map((item, index) => ({
            sr: index + 1,
            rateId: item?.transactioN_TYPE_ID,
            rateDescription: item?.tax_type || "0",
            rateValue: item?.tax_type || "0",
            transactionDesc: item?.transactioN_DESC,
          }));
          setTaxRateData(transformedData);
        } else {
          // For transaction types
          const transformedData = response.data.map((item) => ({
            code: item?.transactioN_TYPE_ID,
            description: item?.transactioN_DESC,
          }));
          setTransactionTypeOptions(transformedData);
        }
      }
    } catch (error) {
      console.error("Error fetching transaction types:", error);
    } finally {
      if (type === "transaction_type_with_tax") {
        setLoadingTaxRateData(false);
      } else {
        setLoadingTransactionType(false);
      }
    }
  };

  const fetchHsCodes = async (search = "", value = "", type = "hs_code") => {
    if (type === "hs_code_with_uom") {
      setLoadingUomData(true);
    } else {
      setLoadingHsCode(true);
    }

    try {
      const response = await Type_Base_Listing_FBR(
        {
          type: type,
          search: search || "",
          id: value?.toString() || "",
        },
        user_id
      );

      if (response.code === 200) {
        if (type === "hs_code_with_uom") {
          // For UOM data, transform differently
          const transformedData = response.data.map((item) => ({
            uom_id: item?.uom,
            uom_description: item?.uom_description,
            units: [item?.uom, item?.uom_description],
          }));
          setSelectedHsCode((prev) => ({
            ...prev,
            uom_options: transformedData,
          }));
        } else {
          // For HS codes
          const transformedData = response.data.map((item) => ({
            code: item?.hS_CODE,
            description: item?.description,
            uom_options: item?.uom_options || [],
          }));
          setHsCodeOptions(transformedData);
        }
      }
    } catch (error) {
      console.error("Error fetching HS codes:", error);
    } finally {
      if (type === "hs_code_with_uom") {
        setLoadingUomData(false);
      } else {
        setLoadingHsCode(false);
      }
    }
  };

  // Fetch schedule data
  const fetchScheduleData = async (transactionTypeCode, taxRateId) => {
    setLoadingScheduleData(true);
    try {
      const response = await Type_Base_Listing_FBR(
        {
          type: "sro_schedule",
          search: "",
          id: taxRateId,
        },
        user_id
      );

      if (response.code === 200) {
        // Transform schedule data
        const transformedData = response.data.map((item, index) => ({
          sr: index + 1,
          srO_ID: item?.srO_ID,
          serNo:
            String(item?.serNo) ||
            item?.serno ||
            item?.serialNo ||
            item?.serial_no ||
            "",
          srO_DESC: item?.srO_DESC,
        }));

        setScheduleData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setScheduleData([]);
    } finally {
      setLoadingScheduleData(false);
    }
  };

  // Fetch SRO Item data
  const fetchSroItems = async (search = "", sroId = "") => {
    setLoadingSroItem(true);
    try {
      const response = await Type_Base_Listing_FBR(
        {
          type: "sro_item",
          search: search || "",
          id: sroId || "",
        },
        user_id
      );
      if (response.code === 200) {
        // Transform SRO item data
        const transformedData = response.data.map((item) => ({
          srO_ITEM_ID:
            item?.srO_ITEM_ID || item?.sroItemId || item?.sro_item_id || "",
          srO_ITEM_DESC:
            item?.srO_ITEM_DESC ||
            item?.sroItemDesc ||
            item?.sro_item_desc ||
            "",
          description:
            item?.srO_ITEM_DESC ||
            item?.description ||
            item?.sroItemDesc ||
            item?.sro_item_desc ||
            "",
        }));
        setSroItemOptions(transformedData);
      }
    } catch (error) {
      console.error("Error fetching SRO items:", error);
      setSroItemOptions([]);
    } finally {
      setLoadingSroItem(false);
    }
  };

  // Debounced search functions
  const debouncedSearchTransactionTypes = useCallback(
    (searchValue, value) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        fetchTransactionTypes(searchValue, value, "transaction_type");
      }, 1000);
      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  const debouncedSearchHsCodes = useCallback(
    (searchValue, value) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        fetchHsCodes(searchValue, value);
      }, 1000);
      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  const debouncedSearchSroItems = useCallback(
    (searchValue, sroId) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        fetchSroItems(searchValue, sroId);
      }, 1000);
      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  // Event handlers
  const handleTransactionTypeChange = (event, newValue) => {
    handleChange({
      target: { name: "transaction_type", value: newValue },
    });

    if (newValue) {
      setSelectedTransactionType(newValue);
      fetchTransactionTypes("", newValue?.code, "transaction_type_with_tax");
      setTaxRateModalOpen(true);
    } else {
      // Clear tax rate fields when transaction type is cleared
      handleChange({ target: { name: "rate_id", value: "" } });
      handleChange({ target: { name: "rate_description", value: "" } });
      handleChange({ target: { name: "rate_value", value: "" } });
      setSelectedTransactionType(null);
      setTaxRateData([]);
    }
  };

  const handleHsCodeSelect = (event, selectedHsCode) => {
    if (selectedHsCode) {
      setSelectedHsCode(selectedHsCode);
      // Fetch UOM data for the selected HS Code
      fetchHsCodes("", selectedHsCode?.code, "hs_code_with_uom");
      setUomModalOpen(true);
    } else {
      // Handle clearing the HS Code selection
      handleChange({ target: { name: "hs_code", value: null } });
      handleChange({ target: { name: "uom_id", value: "" } });
      handleChange({ target: { name: "uom_description", value: "" } });
      setSelectedHsCode(null);
    }
  };

  const handleTaxRateSelect = (selectedRate) => {
    // Populate the rate fields with selected tax rate data
    handleChange({
      target: { name: "rate_id", value: selectedRate?.rateId },
    });
    handleChange({
      target: {
        name: "rate_description",
        value: selectedRate?.transactionDesc,
      },
    });
    handleChange({
      target: { name: "rate_value", value: selectedRate?.rateValue },
    });

    setTaxRateModalOpen(false);
  };

  const handleUomSelect = (selectedUom) => {
    // Set the HS Code with selected UOM
    const hsCodeWithUom = {
      ...selectedHsCode,
      uom_id: selectedUom?.uom_id,
      uom_description: selectedUom?.uom_description,
    };

    handleChange({ target: { name: "hs_code", value: hsCodeWithUom } });
    handleChange({ target: { name: "uom_id", value: selectedUom?.uom_id } });
    handleChange({
      target: { name: "uom_description", value: selectedUom?.uom_description },
    });

    setUomModalOpen(false);
    setSelectedHsCode(null);
  };

  const handleCloseTaxRateModal = () => {
    setTaxRateModalOpen(false);
  };

  // Handle schedule button click
  const handleScheduleButtonClick = () => {
    if (formInputs?.transaction_type && formInputs?.rate_id) {
      fetchScheduleData(formInputs.transaction_type.code, formInputs.rate_id);
      setScheduleModalOpen(true);
    }
  };

  // Handle schedule selection
  const handleScheduleSelect = (selectedSchedule) => {
    if (selectedSchedule) {
      setSelectedSchedule(selectedSchedule);

      if (from_core_state) {
        setProfile((prev) => ({
          ...prev,
          sro_id: selectedSchedule.srO_ID,
          sro_serial_no: selectedSchedule.serNo,
          sro_description: selectedSchedule.srO_DESC,
          sro_item_description: null,
        }));
      } else {
        // Set the schedule fields
        handleChange({
          target: {
            name: "sro_id",
            value: selectedSchedule.srO_ID,
          },
        });
        handleChange({
          target: {
            name: "sro_serial_no",
            value: selectedSchedule.serNo,
          },
        });
        handleChange({
          target: {
            name: "sro_description",
            value: selectedSchedule.srO_DESC,
          },
        });
        handleChange({
          target: {
            name: "sro_item_description",
            value: null,
          },
        });
      }
    }

    setScheduleModalOpen(false);
  };

  const handleCloseScheduleModal = () => {
    setScheduleModalOpen(false);
  };

  // Handle SRO item selection
  const handleSroItemSelect = (event, newValue) => {
    handleChange({
      target: {
        name: "sro_item_description",
        value: newValue,
      },
    });
  };

  // Initialize data on component mount
  useEffect(() => {
    if (showTransactionType) {
      fetchTransactionTypes("", "", "transaction_type");
    }
    if (showHsCode) {
      fetchHsCodes("", "", "hs_code");
    }
  }, [showTransactionType, showHsCode]);

  return (
    <>
      {/* Transaction Type Section */}
      {showTransactionType && (
        <>
          <div className={transactionTypeFieldClass || "col-12 col-md-4"}>
            <Autocomplete
              fullWidth
              options={transactionTypeOptions}
              getOptionLabel={(option) => option.description}
              value={formInputs?.transaction_type || null}
              onChange={handleTransactionTypeChange}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === "input") {
                  debouncedSearchTransactionTypes(
                    newInputValue,
                    formInputs?.transaction_type?.code
                  );
                } else if (reason === "clear") {
                  debouncedSearchTransactionTypes("", "");
                }
              }}
              loading={loadingTransactionType}
              clearOnBlur={false}
              clearOnEscape={true}
              selectOnFocus={true}
              handleHomeEndKeys={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={transactionTypeRequired}
                  label={transactionTypeLabel}
                  placeholder={transactionTypePlaceholder}
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingTransactionType ? null : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>

          {/* Tax Rate Fields */}
          <div className={RateIdFieldClass || "col-12 col-md-2"}>
            <TextField
              disabled
              fullWidth
              label="Tax Rate ID"
              value={formInputs?.rate_id || ""}
              size="small"
              placeholder={loadingTaxRateData ? "Loading..." : "Tax Rate ID"}
              InputProps={{
                endAdornment: loadingTaxRateData ? (
                  <CircularProgress size={16} />
                ) : null,
              }}
            />
          </div>
          <div className={RateFieldClass || "col-12 col-md-2"}>
            <TextField
              disabled
              fullWidth
              label="Tax Rate Value"
              value={formInputs?.rate_value >= 0 ? formInputs?.rate_value : ""}
              size="small"
              placeholder={loadingTaxRateData ? "Loading..." : "Rate Value"}
              type="number"
              InputProps={{
                endAdornment: loadingTaxRateData ? (
                  <CircularProgress size={16} />
                ) : (
                  "%"
                ),
              }}
            />
          </div>

          {/* Search Schedule Button - Only show if schedule is enabled */}
          {showSchedule && (
            <div className="col-12 col-md-4 d-flex align-items-end">
              <Button
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                onClick={handleScheduleButtonClick}
                // startIcon={<SearchIcon size={14} />}
                disabled={!formInputs?.transaction_type || !formInputs?.rate_id}
              >
                Search Schedule
              </Button>
            </div>
          )}

          {/* SRO Fields - Show when schedule is enabled */}
          {showSchedule && (
            <>
              <div className={SroIdFieldClass || "col-12 col-md-2"}>
                <TextField
                  disabled
                  fullWidth
                  label="SRO ID"
                  value={formInputs?.sro_id || ""}
                  size="small"
                />
              </div>
              <div className={SroSerialNoFieldClass || "col-12 col-md-2"}>
                <TextField
                  disabled
                  fullWidth
                  label="SRO Serial No"
                  value={formInputs?.sro_serial_no || ""}
                  size="small"
                />
              </div>
              <div className={SroDescriptionFieldClass || "col-12 col-md-2"}>
                <TextField
                  disabled
                  fullWidth
                  label="SRO Description"
                  value={formInputs?.sro_description || ""}
                  size="small"
                />
              </div>
              {/* SRO Item Description - Only show if enabled */}
              {showSroItemDescription && showSchedule && (
                <div
                  className={SroItemDescriptionFieldClass || "col-12 col-md-2"}
                >
                  <Autocomplete
                    fullWidth
                    onFocus={() =>
                      debouncedSearchSroItems("", formInputs?.sro_id)
                    }
                    disabled={!formInputs.sro_id}
                    options={sroItemOptions}
                    name="sro_item_description"
                    getOptionLabel={(option) => option.description}
                    value={formInputs.sro_item_description || null}
                    onChange={handleSroItemSelect}
                    onInputChange={(event, newInputValue, reason) => {
                      if (reason === "input") {
                        // Only search when user is actually typing
                        debouncedSearchSroItems(
                          newInputValue,
                          formInputs.sro_id
                        );
                      }
                    }}
                    loading={loadingSroItem}
                    clearOnBlur={false}
                    clearOnEscape={true}
                    selectOnFocus={true}
                    handleHomeEndKeys={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        disabled={!formInputs.sro_id}
                        label="SRO Item Description"
                        placeholder="Search and select SRO Item Description"
                        size="small"
                        name="sro_item_description"
                        InputProps={params.InputProps}
                      />
                    )}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* HS Code Section */}
      {showHsCode && (
        <>
          <div className={UomFieldClass || "col-12 col-md-4"}>
            <Autocomplete
              fullWidth
              options={hsCodeOptions}
              getOptionLabel={(option) => option.code}
              value={formInputs?.hs_code || null}
              onChange={handleHsCodeSelect}
              onInputChange={(event, newInputValue, reason) => {
                if (reason === "input") {
                  debouncedSearchHsCodes(
                    newInputValue,
                    formInputs?.hs_code?.code
                  );
                } else if (reason === "clear") {
                  setSelectedHsCode(null);
                  setUomModalOpen(false);
                }
              }}
              loading={loadingHsCode}
              clearOnBlur={false}
              clearOnEscape={true}
              selectOnFocus={true}
              handleHomeEndKeys={true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="HS Code"
                  required={hsCodeRequired}
                  placeholder="Search and select HS Code"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingHsCode ? null : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{option.code}</div>
                    <div style={{ fontSize: "0.8em", color: "#666" }}>
                      {option.description}
                    </div>
                  </div>
                </li>
              )}
            />
          </div>

          <div className={UomIdFieldClass || "col-12 col-md-2"}>
            <TextField
              fullWidth
              label="UOM ID"
              value={formInputs?.uom_id || ""}
              disabled
              size="small"
              variant="outlined"
              placeholder={loadingUomData ? "Loading..." : "UOM ID"}
              InputProps={{
                endAdornment: loadingUomData ? (
                  <CircularProgress size={16} />
                ) : null,
              }}
            />
          </div>

          <div className={UOMDescriptionFieldClass || "col-12 col-md-2"}>
            <TextField
              fullWidth
              label="UOM Description"
              value={formInputs?.uom_description || ""}
              disabled
              size="small"
              variant="outlined"
              placeholder={loadingUomData ? "Loading..." : "UOM Description"}
              InputProps={{
                endAdornment: loadingUomData ? (
                  <CircularProgress size={16} />
                ) : null,
              }}
            />
          </div>

          {/* HS Description - Show when HS Code is selected */}
          {formInputs?.hs_code && (
            <div className="col-12">
              <TextField
                fullWidth
                label="HS Description"
                value={formInputs?.hs_code.description || ""}
                disabled
                multiline
                rows={5}
                size="small"
                variant="outlined"
              />
            </div>
          )}
        </>
      )}

      {/* Loading Indicators */}
      {loadingUomData && (
        <div className="col-12">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              border: "1px dashed #ccc",
            }}
          >
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading UOM options for selected HS Code...
            </Typography>
          </Box>
        </div>
      )}

      {loadingTaxRateData && (
        <div className="col-12">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              border: "1px dashed #ccc",
            }}
          >
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading tax rates for selected Transaction Type...
            </Typography>
          </Box>
        </div>
      )}

      {loadingScheduleData && (
        <div className="col-12">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              border: "1px dashed #ccc",
            }}
          >
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading schedule data...
            </Typography>
          </Box>
        </div>
      )}

      {/* UOM Selection Modal */}
      <SelectionModal
        open={uomModalOpen}
        onClose={() => {
          setUomModalOpen(false);
          setSelectedHsCode(null);
        }}
        title={`Select UOM for ${selectedHsCode?.code || "HS Code"}`}
        data={selectedHsCode?.uom_options || []}
        loading={loadingUomData}
        columns={[
          { header: "UOM ID", accessor: "uom_id" },
          { header: "UOM Description", accessor: "uom_description" },
          {
            header: "Available Units",
            accessor: "units",
            renderOption: (item, column) => {
              return (
                <div style={{ fontSize: "0.8em", color: "#888" }}>
                  {item.units?.join(", ") || ""}
                </div>
              );
            },
          },
        ]}
        onSelect={handleUomSelect}
        searchable={true}
        searchFields={["uom_id", "uom_description", "units"]}
        searchPlaceholder="Search UOM ID, Description, or Units..."
        emptyMessage="No UOM options available for this HS Code"
      />

      {/* FBR Tax Rate Selection Modal */}
      <SelectionModal
        open={taxRateModalOpen}
        onClose={handleCloseTaxRateModal}
        title={`Select Tax Rate for ${
          selectedTransactionType?.description || "Transaction Type"
        }`}
        data={taxRateData}
        loading={loadingTaxRateData}
        columns={[
          { header: "#", accessor: "sr" },
          { header: "Rate ID", accessor: "rateId" },
          { header: "Tax Rate", accessor: "rateDescription" },
          { header: "Rate Value", accessor: "rateValue" },
          { header: "Description", accessor: "transactionDesc" },
        ]}
        onSelect={handleTaxRateSelect}
        searchable={true}
        searchFields={["rateDescription", "rateId", "transactionDesc"]}
        searchPlaceholder="Search Tax Rate..."
        emptyMessage="No Tax Rates available for this Transaction Type"
      />

      {/* Schedule Selection Modal */}
      {showSchedule && (
        <SelectionModal
          open={scheduleModalOpen}
          onClose={handleCloseScheduleModal}
          title={`Select Schedule for ${
            formInputs?.transaction_type?.description || "Transaction Type"
          }`}
          data={scheduleData}
          loading={loadingScheduleData}
          columns={[
            { header: "#", accessor: "sr" },
            { header: "SRO ID", accessor: "srO_ID" },
            { header: "SRO Serial No", accessor: "serNo" },
            { header: "SRO Description", accessor: "srO_DESC" },
          ]}
          onSelect={handleScheduleSelect}
          searchable={true}
          searchFields={["srO_ID", "serNo", "srO_DESC"]}
          searchPlaceholder="Search Schedule..."
          emptyMessage="No Schedule data available for this Transaction Type"
        />
      )}
    </>
  );
};

export default FbrInfoGeneric;
