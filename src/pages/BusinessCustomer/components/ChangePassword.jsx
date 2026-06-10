import { useState } from "react";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import CustomPopover from "../../../components/CustomPopover";
import CustomPasswordField from "../../../components/CustomPasswordField";
import { _change_password_by_admin } from "../../../DAL/BusinessCustomers/business_customers";

import { FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { encryptPassword } from "../../../utils/constant_new";

const ChangePassword = ({ rowData, modalState, setModalState }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const handleRefresh = () => {
    setPassword("");
    setconfirmPassword("");
    setSelectedValue("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      enqueueSnackbar("Password is required", { variant: "error" });
      return;
    }

    if (password.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters long", {
        variant: "error",
      });
      return;
    }
    if (confirmPassword.length < 8) {
      enqueueSnackbar("Confirm Password must be at least 8 characters long", {
        variant: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    const EncryptedPassword = encryptPassword(password?.trim());
    setSubmitButtonLoader(true);
    const data = {
      new_password: EncryptedPassword,
      confirm_password: EncryptedPassword,
      logout_from: selectedValue ? "all" : "none",
    };

    const response = await _change_password_by_admin(data, rowData.business_id);
    if (response.code === 200) {
      handleRefresh();
      enqueueSnackbar(response.message, { variant: "success" });
      setSubmitButtonLoader(false);
      setModalState(false);
    } else {
      enqueueSnackbar(response.message, { variant: "error" });
    }
    setSubmitButtonLoader(false);
  };

  useEffect(() => {
    if (!modalState) {
      handleRefresh();
    }
  }, [modalState]);

  return (
    <CustomPopover
      isOpenPop={modalState}
      isClosePop={setModalState}
      title="Change Password"
      submitButtonText="Update"
      showStatus={false}
      handleSubmit={handleSubmit}
      submitButtonLoader={submitButtonLoader}
      componentToPassDown={
        <div className="popover-mid-container">
          <div className="spacing">
            <div className="row-spacing">
              <CustomPasswordField
                passwordVariable={password}
                setPasswordVariable={setPassword}
                passwordLabel="Password"
                Required={true}
                show={true}
              />
            </div>
            <div className="row-spacing">
              <CustomPasswordField
                passwordVariable={confirmPassword}
                setPasswordVariable={setconfirmPassword}
                passwordLabel="Confirm Password"
                Required={true}
                show={true}
              />
            </div>
            <div className="col-12 mt-3 radio_button">
              <p>For security reasons, would you like to:</p>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedValue}
                      onChange={(e) => setSelectedValue(e.target.checked)}
                      name="logoutAllDevices"
                      color="primary"
                    />
                  }
                  label="Logout from all devices"
                />
              </FormControl>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ChangePassword;
