import { MenuItem, Box, IconButton, Tooltip, TextField } from "@mui/material";
import { Icon } from "@iconify/react";

const InvoiceTemplateSelect = ({
  title,
  name,
  value,
  handleFormInputsChange,
  handleOpenPreview,
  templateOptions,
  imagesObject,
}) => {
  return (
    <div className="col-12 col-md-4">
      <label className="form-label-new mb-2 label-text d-flex align-items-center justify-content-between">
        <span className="d-flex align-items-center">
          <Icon
            icon="akar-icons:reciept"
            className="me-1 tabs-icon-color label-icon-setting"
          />
          {title}
        </span>

        {/* {value && (
          <Tooltip title="Preview Template">
            <IconButton
              size="small"
              onClick={() => handleOpenPreview(value, `${title} Preview`)}
            >
              <Icon
                icon="material-symbols:visibility-outline"
                width={18}
                height={18}
              />
            </IconButton>
          </Tooltip>
        )} */}
      </label>

      <TextField
        placeholder={`Select ${title}`}
        select
        fullWidth
        size="small"
        value={value || ""}
        onChange={handleFormInputsChange}
        name={name}
        className="text-field-border"
        required={false}
        SelectProps={{
          displayEmpty: true,
        }}
      >
        {templateOptions?.map((option) => (
          <MenuItem key={option.slug} value={option.slug}>
            <Box className="d-flex align-items-center justify-content-between w-100">
              <span>{option.label}</span>

              {option.value && (
                <Tooltip title="Preview Template">
                  <IconButton
                    size="small"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPreview(
                        imagesObject[option.slug],
                        `${title} Preview`,
                      );
                    }}
                  >
                    <Icon
                      icon="material-symbols:visibility-outline"
                      width={18}
                      height={18}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default InvoiceTemplateSelect;
