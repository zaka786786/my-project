import { TextField, Avatar, IconButton } from "@mui/material";
import {
  Close,
  PhotoCamera,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import MuiPhoneNumber from "material-ui-phone-number";
import { imageBaseUrl } from "../../../config/config";
import { useState } from "react";
import CustomAutocomplete from "../../../components/CustomeAutoComplete/CustomAutoComplete";
const AddOrUpdateComponent = ({
  formInputs,
  setFormInputs,
  handleFile,
  handleChange,
  handleRemoveImage,
  phoneNumber,
  setPhoneNumber,
  rolesList,
  setRoleSearch,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  console.log("rolesList  _rolesList", rolesList);
  const handleSelectOther = (name, value) => {
    setFormInputs((values) => ({ ...values, [name]: value }));
  };

  return (
    <div className="popover-mid-container pe-2">
      <div className="spacing">
        <div className="align-center">
          <div style={{ position: "relative" }}>
            <label htmlFor="image" style={{ cursor: "pointer" }}>
              {formInputs.profile_image ? (
                <Avatar
                  src={
                    typeof formInputs.profile_image === "string"
                      ? imageBaseUrl + formInputs.profile_image
                      : URL.createObjectURL(formInputs.profile_image)
                  }
                  sx={{ marginLeft: "25px", width: "70px", height: "70px" }}
                  variant="square"
                  className="table-image-with-name"
                />
              ) : (
                <Avatar
                  sx={{ marginLeft: "25px", width: "70px", height: "70px" }}
                  variant="square"
                  className="table-image-with-name"
                >
                  <PhotoCamera fontSize="large" />
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    hidden
                    onChange={handleFile}
                  />
                </Avatar>
              )}
            </label>

            {formInputs.profile_image && (
              <IconButton
                onClick={handleRemoveImage}
                className="image-remove-icon"
              >
                <Close />
              </IconButton>
            )}

            <IconButton component="label" htmlFor="image">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                hidden
                onChange={handleFile}
              />
            </IconButton>
          </div>
        </div>
        <p class="image-recommend-size">
          Recommended Size (670 X 1000) ( "png", "jpg", "jpeg", "webp","GIF" )
        </p>

        <div className="row-spacing">
          <TextField
            fullWidth
            label="First Name"
            value={formInputs.first_name}
            onChange={handleChange}
            name="first_name"
            className="text-field-border"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formInputs.last_name}
            onChange={handleChange}
            name="last_name"
            className="text-field-border"
            required
          />
          <TextField
            select
            fullWidth
            label="Enable Two Factor Authentication"
            value={formInputs.two_factor_auth ?? false}
            onChange={handleChange}
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
        <div className="row-spacing">
          <TextField
            fullWidth
            label="Email"
            value={formInputs.email}
            onChange={handleChange}
            name="email"
            className="text-field-border"
            type="email"
            required
          />
          {formInputs._id ? null : (
            <TextField
              fullWidth
              label={showPassword ? "Password" : "Password"}
              value={formInputs.password}
              onChange={handleChange}
              name="password"
              className="text-field-border"
              required
              type={showPassword ? "text" : "password"}
              autoComplete="new-password" // 👈 optional for better support
              InputProps={{
                endAdornment: (
                  <>
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </>
                ),
              }}
            />
          )}
          <MuiPhoneNumber
            label="Phone"
            defaultCountry={"pk"}
            fullWidth
            size="large"
            // required
            inputProps={{ min: 11 }}
            name="phoneNumber"
            value={phoneNumber}
            variant="outlined"
            onChange={(value) => {
              setPhoneNumber(value);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 56, // change height here
              },
              "& .MuiInputBase-input": {
                padding: "15px 14px", // controls text padding
              },
            }}
          />
        </div>

        <div className="row-spacing">
          <CustomAutocomplete
            label="Roles"
            value={formInputs?.role}
            onChange={(newValue) => {
              handleSelectOther("role", newValue);
            }}
            options={rolesList}
            getOptionLabel={(option) => option?.name || ""}
            RunOnInitialRender={true}
            // onInputChange={(e, value) => {
            //   setRoleSearch(value);
            //   console.log("value  __value", value);
            //   console.log("e  __value", e);
            // }}
            setSearch={setRoleSearch}
          />
        </div>

        <div className="row-spacing">
          <TextField
            fullWidth
            label="Address"
            value={formInputs.address}
            onChange={handleChange}
            name="address"
            className="text-field-border"
            type="text"
            rows={3}
            multiline
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrUpdateComponent;
