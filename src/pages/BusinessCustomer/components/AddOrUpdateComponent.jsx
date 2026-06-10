import {
  TextField,
  Avatar,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Close, PhotoCamera } from "@mui/icons-material";
import CustomPhoneInput from "../../../components/CustomPhoneInput/CustomPhoneInput";
import MuiPhoneNumber from "material-ui-phone-number";
import { imageBaseUrl } from "../../../config/config";
const AddOrUpdateComponent = ({
  businessTypeList,
  formInputs,
  handleFile,
  handleChange,
  handleRemoveImage,
  phoneNumber,
  setPhoneNumber,
  handleLastNameBlur,
  handleAutocompleteChange,
  handleUserNameExist,
  isUserNameCheckError,
  isDebounce,
}) => {
  return (
    <div className="popover-mid-container">
      <div className="spacing">
        <div className="align-center">
          <div style={{ position: "relative" }}>
            <label htmlFor="image" style={{ cursor: "pointer" }}>
              {formInputs?.profile_image ? (
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
                    onChange={(e) => {
                      handleFile(e);
                    }}
                  />
                </Avatar>
              )}
            </label>

            {formInputs?.profile_image && (
              <IconButton
                onClick={() => {
                  handleRemoveImage();
                  handleChange({
                    target: {
                      name: "profile_image",
                      value: null,
                    },
                  });
                }}
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
            // onBlur={handleLastNameBlur}
            name="last_name"
            className="text-field-border"
            required
          />
        </div>
        <div className="row-spacing ">
          <TextField
            fullWidth
            error={isUserNameCheckError && !isDebounce}
            label="User Name"
            name="user_name"
            value={formInputs.user_name || ""}
            onChange={handleChange}
            className="text-field-border"
            required
            autoComplete="off"
            helperText={
              isDebounce ? "Checking username ..." : isUserNameCheckError  || "Use A-Z, 0-9, or _ only"
            }
            InputProps={{
              endAdornment: isDebounce ? (
                <InputAdornment position="end">
                  <CircularProgress size={18} />
                </InputAdornment>
              ) : null,
            }}
          />
          <TextField
            fullWidth
            label="Email"
            value={formInputs.email}
            onChange={handleChange}
            name="email"
            className="text-field-border"
            type="email"
          />
        </div>
        <div className="row-spacing">
          {formInputs._id ? null : (
            <TextField
              fullWidth
              label="Password"
              value={formInputs.password}
              autoComplete="new-password" // 👈 optional for better support
              onChange={handleChange}
              name="password"
              className="text-field-border"
              required
              type="password"
            />
          )}
          <MuiPhoneNumber
            label="Phone"
            defaultCountry={"pk"}
            fullWidth
            required
            inputProps={{ min: 11 }}
            name="phoneNumber"
            value={phoneNumber}
            variant="outlined"
            onChange={(value) => {
              setPhoneNumber(value);
            }}
          />
        </div>
        {/* <CustomPhoneInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            country="pk"
            // disabled={disabled}
          /> */}

        <div className="row-spacing">
          <Autocomplete
            fullWidth
            options={businessTypeList}
            getOptionLabel={(option) => option.title}
            onChange={(e, newValue) => {
              handleAutocompleteChange("category", newValue); // 👈 use custom handler
            }}
            renderInput={(params) => (
              <TextField {...params} label="Business Type" />
            )}
            autoComplete="new-password"
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrUpdateComponent;
