import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, TextField, IconButton, Tooltip } from "@mui/material";
import { debounce } from "lodash";
import { AddCircleOutline } from "@mui/icons-material";
import { _get_common_business_categories } from "../../DAL/BusinessCategories/business_categories";
import { formatFullName } from "../../utils/domUtils";

const CustomAutocomplete = ({
  parent_category_id,
  customer,
  label,
  value,
  onChange,
  options = null,
  endpoint = "/api/app_api/type_base_data_for_business",
  queryParam = "q",
  getOptionLabel = (option) => option?.label || "",
  renderOption,
  disabled = false,
  placeholder = "search here for more...",
  type = "",
  isFieldEmpty = "",
  required = true,
  fullWidth = true,
  onAddClick,
  warehouse_id,
  AddButtonLabel,
  category_id,
  RunOnInitialRender,
  multiple = false,
  size = "medium",
  setSearch = () => {},
  sx = {},
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [fetchedOptions, setFetchedOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch options with debounce
  const fetchOptions = useCallback(
    debounce(async (query = "", category_id) => {
      if (!endpoint) {
        setFetchedOptions([]);
        setLoading(false);
        return;
      }

      // Clear previous options immediately when starting a new search
      // setFetchedOptions([]);  // Commented to prevent visual jerking
      setLoading(true);

      try {
        const response = await _get_common_business_categories({
          type: type,
          search: query,
          category_id: category_id || "",
        });

        if (response.code === 200 && Array.isArray(response.data)) {
          const arrangedData = response.data.map((item) => ({
            ...item,
            value: item?.user_id?._id || item?._id,
            label: item?.name || item?.first_name + " " + item?.last_name,
          }));

          // Remove duplicates based on value field to ensure unique options
          const uniqueData = arrangedData.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.value === item.value),
          );

          setFetchedOptions(uniqueData);
        } else {
          setFetchedOptions([]);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        setFetchedOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [type],
  );

  useEffect(() => {
    if (options) {
      setFetchedOptions(options || []);
    } else if (RunOnInitialRender) {
      fetchOptions("", parent_category_id);
    }

    return () => {
      fetchOptions.cancel && fetchOptions.cancel();
    };
  }, [fetchOptions, options, parent_category_id]);

  // Initial fetch on mount when no static options are provided
  // useEffect(() => {
  //   if (RunOnInitialRender) {
  //     if (!options) {
  //       fetchOptions("", parent_category_id);
  //     } else {
  //       setFetchedOptions(options || []);
  //     }
  //   }

  //   // Cleanup function to cancel pending debounced calls
  //   return () => {
  //     fetchOptions.cancel && fetchOptions.cancel();
  //   };
  // }, [fetchOptions, options]);

  useEffect(() => {
    if (RunOnInitialRender) {
      if (fetchedOptions?.length > 0 && !value) {
        if (multiple) {
          onChange([]);
        }
        // onChange(multiple ? [] : fetchedOptions[0]);
      }
    }
  }, [fetchedOptions]);

  return (
    <Autocomplete
      sx={{ ...sx }}
      slotProps={{
        popper: {
          sx: {
            zIndex: 9999999999999,
          },
        },
      }}
      className={className}
      fullWidth={fullWidth}
      multiple={multiple}
      disabled={disabled}
      value={value}
      inputValue={inputValue}
      options={fetchedOptions}
      loading={loading && !options}
      size={size}
      disableClearable={false}
      getOptionLabel={getOptionLabel}
      onBlur={() => setIsFocused(false)}
      onInputChange={(e, newInputValue, reason) => {
        setInputValue(newInputValue);
        setSearch(newInputValue);
        if (!options) {
          if (reason === "input") {
            fetchOptions(newInputValue, parent_category_id);
          } else if (reason === "clear") {
            setFetchedOptions([]);
            fetchOptions("", parent_category_id);
          }
        }
      }}
      onChange={(e, newVal) => onChange(newVal)}
      onFocus={() => {
        if (!options) {
          fetchOptions("", parent_category_id);
        }
        setIsFocused(true);
      }}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, val) => option?.value === val?.value}
      {...(renderOption && { renderOption })}
      renderInput={(params) => (
        <TextField
          // sx={{ ...sx }}
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {/* {loading && !options && (
                  <CircularProgress size={18} style={{ marginRight: 8 }} />
                )} */}
                {onAddClick && (
                  <Tooltip title={`Add ${AddButtonLabel}`}>
                    <IconButton
                      size="small"
                      disabled={disabled}
                      onClick={onAddClick}
                      sx={{ ml: 1, padding: 0 }}
                    >
                      <AddCircleOutline
                        fontSize="small"
                        sx={{ color: "primary.main" }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default CustomAutocomplete;
