import React from "react";
import { Card, MenuItem, Select, TextField } from "@mui/material";
import CustomLabeledInput from "../../../components/CustomLabeledInput/CustomLabeledInput";
import Iconify from "../../../components/Iconify";
import MuiPhoneNumber from "material-ui-phone-number";
import ImageUploadField from "../../../components/ImageUploadField";
import { Icon } from "@iconify/react/dist/iconify.js";
import CustomAutocomplete from "../../../components/CustomeAutoComplete/CustomAutoComplete";

const BusinessBasicInfoTab = ({
  formInputs,
  handleFormInputsChange,
  user_id,
  isDemo = false,
}) => {
  return (
    <Card className="p-4  border-0 rounded-4 mb-4  business-customer-tabs-card">
      <div className="row gy-3">
        <div className="col-12 col-md-6">
          <label className="form-label mb-2 label-text d-flex align-items-center">
            <Icon
              icon={"mdi:account-outline"}
              width={22}
              height={22}
              className="me-1 tabs-icon-color"
            />
            Business Account Type
          </label>

          <TextField
            select
            fullWidth
            disabled={true}
            size="small"
            value={formInputs.business_account_type ?? "real"}
            name="business_account_type"
            className="text-field-border"
            SelectProps={{
              native: true,
            }}
          >
            <option value="real">General Account</option>
            <option value="demo">Demo Account</option>
          </TextField>
        </div>

        {formInputs.business_account_type === "demo" && (
          <div className="col-12 col-md-6">
            <label className="form-label mb-2 label-text d-flex align-items-center">
              <Icon
                icon={"mdi:content-copy"}
                width={22}
                height={22}
                className="me-1 tabs-icon-color"
              />
              Clone Data from
            </label>
            <CustomAutocomplete
              disabled={user_id ? true : false}
              size="small"
              label="Business Customer"
              value={formInputs.clone_from}
              onChange={(value) => {
                handleFormInputsChange({
                  target: {
                    name: "clone_from",
                    value: value,
                  },
                });
              }}
              options={null}
              getOptionLabel={(customer) => customer.label}
              placeholder="Select Business customer"
              required={true}
              type="business_filter"
            />
          </div>
        )}

        {formInputs.business_account_type === "demo" && !user_id && (
          <div className="col-12 col-md-6">
            <label className="form-label fw-medium mb-2">
              <Iconify
                icon="mdi:check-circle-outline"
                className="me-1 tabs-icon-color"
              />
              Clone Data*
            </label>
            <TextField
              select
              // disabled={user_id ? true : false}
              name="clone_data"
              value={formInputs.clone_data}
              onChange={(e) =>
                handleFormInputsChange({
                  target: {
                    name: "clone_data",
                    value: e.target.value,
                  },
                })
              }
              required
              fullWidth
              size="small"
            >
              <MenuItem value={"settings_data"}>Settings & Data</MenuItem>
              <MenuItem value={"only_settings"}>Only Settings</MenuItem>
            </TextField>
          </div>
        )}

        {/* First Name */}
        <div className="col-12 col-md-6">
          <CustomLabeledInput
            label="First Name*"
            icon="mdi:account"
            name="first_name"
            value={formInputs.first_name}
            onChange={handleFormInputsChange}
            required
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div className="col-12 col-md-6">
          <CustomLabeledInput
            label="Last Name*"
            icon="mdi:account"
            name="last_name"
            value={formInputs.last_name}
            onChange={handleFormInputsChange}
            required
            placeholder="Enter last name"
          />
        </div>

        {/* Username */}
        {/* <div className="col-12 col-md-6">
          <CustomLabeledInput
            label="Username*"
            icon="mdi:at"
            name="user_name"
            value={formInputs.user_name}
            onChange={handleFormInputsChange}
            required
            placeholder="Enter username"
            error={isUserNameCheckError && !isDebounce}
            helperText={helperText}
            // autoComplete="new-password"
            InputProps={{
              endAdornment: isDebounce ? (
                <InputAdornment position="end">
                  <CircularProgress size={18} />
                </InputAdornment>
              ) : null,
            }}
          
          />
          {suggested_user_names?.length > 0 && (
            <>
            <div className="suggested-user-names d-flex gap-2 align-items-center">
            <h6> Suggestions</h6>
              {suggested_user_names?.map((item) => (
                <div
                  className="suggested-user-name"
                  onClick={() => {
                    handleSuggestedUserName(item);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            </>
          )}
        </div> */}

        {/* Email */}
        <div className="col-12 col-md-6">
          <CustomLabeledInput
            label="Email*"
            icon="mdi:email"
            name="email"
            type="email"
            value={formInputs.email}
            onChange={handleFormInputsChange}
            required
            placeholder="Enter email"
          />
        </div>

        {formInputs.business_account_type === "real" && (
          <div className="col-12 col-md-6">
            <label className="form-label mb-2 label-text d-flex align-items-center">
              <Icon
                icon={"material-symbols:domain-verification-outline"}
                width={22}
                height={22}
                className="me-1 tabs-icon-color"
              />
              Enable Two Factor Authentication
            </label>
            <TextField
              select
              fullWidth
              size="small"
              value={formInputs.two_factor_auth ?? false}
              onChange={handleFormInputsChange}
              name="two_factor_auth"
              className="text-field-border"
              SelectProps={{
                native: true,
              }}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>
        )}

        {/* Password */}
        {!formInputs?.user_id && (
          <div className="col-12 col-md-6">
            <CustomLabeledInput
              label="Password*"
              icon="mdi:lock-outline"
              name="password"
              type="password"
              value={formInputs.password}
              onChange={handleFormInputsChange}
              placeholder="Enter password"
              autoComplete="new-password"
              required
            />
          </div>
        )}

        <div className="col-12 col-md-6">
          <label className="form-label fw-medium mb-2">
            <Iconify icon="mdi:phone" className="me-1 tabs-icon-color" />
            Phone Number*
          </label>
          <MuiPhoneNumber
            // label="Phone"
            size="small"
            defaultCountry={"pk"}
            fullWidth
            required
            // inputProps={{ min: 11 }}
            name="phoneNumber"
            value={formInputs.phone_number}
            variant="outlined"
            onChange={(value) => {
              handleFormInputsChange({
                target: {
                  name: "phone_number",
                  value: value,
                },
              });
            }}
            placeholder="Enter phone number"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-medium mb-2">
            <Iconify
              icon="mdi:check-circle-outline"
              className="me-1 tabs-icon-color"
            />
            Status*
          </label>
          <TextField
            select
            name="status"
            value={formInputs.status}
            onChange={(e) =>
              handleFormInputsChange({
                target: {
                  name: "status",
                  value: e.target.value,
                },
              })
            }
            required
            fullWidth
            size="small"
          >
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </TextField>
        </div>

        <ImageUploadField
          label="Upload Profile Image"
          name="profile_image"
          helperText='Image Size (32 X 32) ("JPG", "JPEG", "PNG", "WEBP")'
          previewSize={{ width: 80, height: 80 }}
          formInputs={formInputs}
          handleFormInputsChange={handleFormInputsChange}
        />
      </div>

      {/* Profile Image Upload */}
    </Card>
  );
};

export default BusinessBasicInfoTab;
