import React from "react";
import Chip from "@mui/material/Chip";
import moment from "moment";
import { show_proper_words } from "../../utils/constant";
import { get_root_value } from "../../utils/domUtils";

/**
 * FilteredChip
 *
 * This component renders a list of chips representing the filters applied to the data.
 * Each chip corresponds to a key-value pair from the `data` prop, where the key is the filter name
 * and the value is the filter value. Chips can represent different types of data including strings, booleans,
 * dates, arrays, and objects. The component allows for deleting individual chips and clearing all filters.
 *
 * Props:
 * - data (object): The data to filter and display chips for. Each key represents a filter and its corresponding value.
 * - tempState (object): The current state used for filtering.
 * - EMPTY_FILTER (object): The default state used to reset filters.
 * - ALTER_FILTER (object): A state that can modify filters when applicable.
 * - onDeleteChip (function): Callback function to update state after a chip is deleted.
 * - onClear (function): Callback function to clear all filters when the "Clear All" link is clicked.
 */

const FilteredChip = ({
  data,
  tempState,
  EMPTY_FILTER,
  ALTER_FILTER,
  onDeleteChip,
  onClear,
}) => {
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (error) {
      return false;
    }
  }
  const hanlde_delete = (item) => {
    let value = item.value;
    let key = item.key;
    let item_type = typeof data[key];

    let temp_state = { ...tempState };
    if (item_type === "object" && Array.isArray(data[key])) {
      let new_array = data[key].filter((array) =>
        array.chip_value ? array.chip_value !== value : array !== value
      );
      temp_state[key] = new_array;
    } else {
      if (ALTER_FILTER) {
        let alter_value = ALTER_FILTER[key];
        if (alter_value !== undefined) {
          temp_state[key] = ALTER_FILTER[key];
        } else {
          temp_state[key] = EMPTY_FILTER[key];
        }
      } else {
        temp_state[key] = EMPTY_FILTER[key];
      }
    }
    onDeleteChip(temp_state);
  };

  let STATUS = {
    true: "Active",
    false: "Inactive",
    all: "All",
  };
  // console.log(data, "chips____data");
  let chips_array = [];
  // eslint-disable-next-line
  Object.keys(data).map((keyName, i) => {
    let key_value = data[keyName];
    let key_type = typeof key_value;
    const push_date = () => {
      chips_array.push({
        value: key_value,
        key: keyName,
        label:
          show_proper_words(keyName) +
          " " +
          moment(key_value).format("DD-MM-YYYYY"),
      });
    };

    if (keyName === "status" && key_value !== "") {
      chips_array.push({
        key: keyName,
        value: key_value,
        label: STATUS[key_value],
      });
    } else if (key_value && key_value !== "0") {
      switch (key_type) {
        case "string":
          if (moment(key_value).isValid()) {
            push_date();
          } else {
            chips_array.push({
              key: keyName,
              value: key_value,
              label: isValidUrl(key_value)
                ? key_value
                : show_proper_words(key_value),
            });
          }
          break;
        case "boolean":
          chips_array.push({
            key: keyName,
            value: key_value,
            label: show_proper_words(keyName),
          });
          break;
        case "object":
          if (key_value) {
            if (Array.isArray(key_value)) {
              key_value.map((item) => {
                let item_type = typeof item;
                if (item_type === "string") {
                  chips_array.push({
                    key: keyName,
                    value: item,
                    label: show_proper_words(item),
                  });
                } else {
                  chips_array.push({
                    key: keyName,
                    value: item.chip_value,
                    label: item.chip_label,
                  });
                }
              });
            } else if (moment(key_value).isValid()) {
              if (key_value.chip_value) {
                chips_array.push({
                  key: keyName,
                  value: key_value.chip_value,
                  label: key_value.chip_label,
                });
              } else {
                push_date();
              }
            } else {
              chips_array.push({
                key: keyName,
                value: key_value.chip_value,
                label: key_value.chip_label,
              });
            }
          }
          break;
        default:
      }
    }
  });

  // console.log(chips_array, "chips_array");

  return (
    <>
      {chips_array.length > 0 && (
        <div className="col-lg-12 col-sm-12">
          <b className="me-3 pt-1 ms-2">Filtered By:</b>
          {chips_array.map((item, index) => {
            return (
              <>
                {item.label && (
                  <>
                    {onDeleteChip ? (
                      <Chip
                        key={index}
                        label={item.label}
                        className="Chip_Main mb-0 mt-0 me-2"
                        onDelete={() => hanlde_delete(item)}
                        sx={{
                          fontFamily: "inherit",
                          fontSize: "16px",
                        }}
                      />
                    ) : (
                      <Chip
                        key={index}
                        label={item.label}
                        className="Chip_Main mb-0 mt-0 me-2"
                        sx={{
                          color: "white",
                        }}
                      />
                    )}
                  </>
                )}
              </>
            );
          })}
          {onClear && (
            <span
              className="anchor-style ms-2 pt-1"
              onClick={onClear}
              style={{
                color: get_root_value("--portal-theme-primary"),
              }}
            >
              Clear All
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default FilteredChip;
