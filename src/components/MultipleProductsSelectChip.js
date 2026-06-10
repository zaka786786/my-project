import * as React from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

export default function MultipleProductsSelectChip({
  productsObject = [],
  selectedProducts = [],
  setSelectedProducts,
  label = "Products *",
  placeholder = "Add Product",
  disabled = false,
  nameUr = "name_ur",
  nameEn = "name_en",
  nameId = "_id",
}) {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const handleChange = (event, value) => {
    const uniqueProducts = Array.from(
      new Set(value.map((item) => item[nameId]))
    ).map((id) => {
      return value.find((item) => item[nameId] === id);
    });
    setSelectedProducts(uniqueProducts);
  };

  const filteredOptions = productsObject.filter(
    (product) =>
      !selectedProducts.some((selected) => selected[nameId] === product[nameId])
  );

  return (
    <div className="w-100">
      <Autocomplete
        fullWidth
        multiple
        id="tags-filled"
        options={filteredOptions}
        getOptionLabel={(option) =>
          option[nameUr] ? option[nameUr] : option[nameEn]
        }
        value={selectedProducts}
        onChange={handleChange}
        filterSelectedOptions
        sx={{
          fontFamily: "Alvi Nastaleeq Regular",
        }}
        ListboxProps={{
          sx: {
            fontFamily: "Alvi Nastaleeq Regular",
          },
        }}
        freeSolo={disabled}
        readOnly={disabled}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              sx={{
                color: "#5792c9",
                border: "1px solid #5792c9",
                backgroundColor: "#e5eef6",
                fontFamily: "Alvi Nastaleeq Regular",
                marginTop: "-120px",
              }}
              className="multi-category-select-chip font-family-urdu autocomplete-product-multi-select-chip"
              key={option[nameId]}
              label={option[nameUr] ? option[nameUr] : option[nameEn]}
              {...getTagProps({ index })}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
            placeholder={disabled ? "" : placeholder}
            inputProps={{ ...params.inputProps, readOnly: true }}
            sx={{
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              fontFamily: "Alvi Nastaleeq Regular",
            }}
            disabled={disabled}
          />
        )}
      />
    </div>
  );
}
