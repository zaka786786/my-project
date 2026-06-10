// components/ImageUploadField.jsx
import React from "react";
import { Button, FormHelperText } from "@mui/material";
import { Icon } from "@iconify/react";
import Iconify from "../components/Iconify"; // if you have your own icon component
import { imageBaseUrl } from "../config/config"; // update as per your project
import styled from "styled-components";
const Input = styled("input")({
  display: "none",
});

const ImageUploadField = ({
  label,
  name,
  helperText,
  previewSize = { width: 80, height: 80 },
  formInputs,
  handleFormInputsChange,
  accept = "image/*",
}) => {
  const imageValue = formInputs?.[name];

  const handleImageDelete = () => {
    handleFormInputsChange({
      target: {
        name,
        value: null,
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFormInputsChange({
      target: {
        name,
        value: file,
      },
    });
  };

  const isImageFile = (file) => {
    if (!file) return false;
    if (file.type) {
      return file.type.startsWith("image/");
    }
    if (typeof file === "string") {
      return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(file);
    }
    return false;
  };

  const imagePreviewSrc =
    typeof imageValue === "string"
      ? imageBaseUrl + imageValue
      : imageValue
      ? URL.createObjectURL(imageValue)
      : null;

  const shouldShowPreview = imageValue && isImageFile(imageValue);

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
      <div className="row w-100 div-style ms-0 pt-0">
        <div className="col-lg-5 col-md-5 col-sm-12">
          <p className="">{label}</p>
          {helperText && (
            <FormHelperText className="pt-0 text-muted">
              {helperText}
            </FormHelperText>
          )}
        </div>

        <div className="col-lg-2 col-md-2 col-6">
          <div className="position-relative d-inline-block">
            {shouldShowPreview && (
              <>
                <img
                  className="img-thumbnail"
                  src={imagePreviewSrc}
                  alt="Uploaded Preview"
                  width={previewSize.width}
                  height={previewSize.height}
                />
                <div
                  className="d-flex align-items-center justify-content-center image-delete-icon position-absolute top-0"
                  onClick={handleImageDelete}
                  style={{
                    background: "#fff",
                    borderRadius: "50%",
                    cursor: "pointer",
                    padding: "2px",
                  }}
                >
                  <Icon icon="mdi:close" width="14" height="14" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-5 col-md-5 col-6 text-end pt-2 my-auto">
          <label htmlFor={`${name}-file`}>
            <Input
              accept={accept}
              id={`${name}-file`}
              type="file"
              name={name}
              onChange={handleFileChange}
            />
            <Button
              className="small-contained-button"
              startIcon={
                <Iconify
                  icon="ic:baseline-upload"
                  className="me-1 tabs-icon-color"
                />
              }
              component="span"
            >
              Upload
            </Button>
          </label>
        </div>
      </div>

      {imageValue?.name && (
        <p className="text-secondary mb-0">{imageValue.name}</p>
      )}
    </div>
  );
};

export default ImageUploadField;
