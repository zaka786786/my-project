import { useEffect, useState } from "react";
import { useAdminContext } from "../../Hooks/AdminContext";
import CircularLoader from "../../components/loaders/CircularLoader";
import {
  get_invoice_reporting_settings,
  set_invoice_reporting_settings,
} from "../../DAL/Settings/Settings";
import Iconify from "../../components/Iconify";
import Editor from "../../components/editor/Editor";
import { enqueueSnackbar } from "notistack";
import { Button } from "@mui/material";
import { permission_string } from "../../utils/constant";
import TooltipShowing from "../../components/TooltipShowing";

const PaymentAlertSettings = ({ screen_path }) => {
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [formInputs, setFormInputs] = useState({
    days_before_trial_ends: "",
    days_before_subscription_ends: "",
    alert_content_trial_users: "",
    alert_content_paid_users: "",
    popup_content_trial_users: "",
    popup_content_subscription_expiry: "",
  });

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const getPaymentAlertSettings = async () => {
    const data = { type: "alert_settings" };
    setLoading(true);
    const response = await get_invoice_reporting_settings(data);
    if (response.code === 200) {
      const data = response.settings;
      setFormInputs({
        ...formInputs,
        days_before_trial_ends: data?.days_before_show_trial_content,
        days_before_subscription_ends: data?.days_before_show_paid_content,
        alert_content_trial_users: data?.trial_alert_content,
        alert_content_paid_users: data?.paid_alert_content,
        popup_content_trial_users: data?.trial_expired_content,
        popup_content_subscription_expiry: data?.subscription_expired_content,
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (show) {
      enqueueSnackbar(permission_string, {
        variant: "error",
      });
      return;
    }

    if (
      !formInputs.days_before_trial_ends ||
      !formInputs.days_before_subscription_ends ||
      !formInputs.alert_content_trial_users ||
      !formInputs.alert_content_paid_users ||
      !formInputs.popup_content_trial_users ||
      !formInputs.popup_content_subscription_expiry
    ) {
      enqueueSnackbar("Please fill all the fields", {
        variant: "error",
      });
      return;
    }
    const data = {
      type: "alert_settings",
      alert_settings: {
        days_before_show_trial_content: formInputs.days_before_trial_ends,
        days_before_show_paid_content: formInputs.days_before_subscription_ends,
        trial_alert_content: formInputs.alert_content_trial_users,
        paid_alert_content: formInputs.alert_content_paid_users,
        trial_expired_content: formInputs.popup_content_trial_users,
        subscription_expired_content:
          formInputs.popup_content_subscription_expiry,
      },
    };
    setLoading(true);
    const response = await set_invoice_reporting_settings(data);
    if (response.code === 200) {
      getPaymentAlertSettings();
      enqueueSnackbar(response.message, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(response.message, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setNavBarTitle("Payment Alert Settings");
    setIsBackButton(false);
    getPaymentAlertSettings();
  }, []);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <div className="container-fluid mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3 gy-3">
          {/* Alert Days Before Trial Ends */}
          <div className="col-12 col-md-6 ">
            <label className="form-label fs-18">
              Alert Days Before Trial Ends*
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control custom-input"
                name="days_before_trial_ends"
                value={formInputs.days_before_trial_ends}
                onChange={handleChange}
                placeholder="Enter number of days"
                min="0"
                required
              />
              <span className="input-group-text">Days</span>
            </div>
          </div>

          {/* Alert Days Before Subscription Ends */}
          <div className="col-12 col-md-6">
            <label className="form-label fs-18">
              Alert Days Before Subscription Ends*
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control custom-input"
                name="days_before_subscription_ends"
                value={formInputs.days_before_subscription_ends}
                onChange={handleChange}
                placeholder="Enter number of days"
                min="0"
                required
              />
              <span className="input-group-text">Days</span>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Alert Content for Trial Users */}
        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label fs-18">
              Alert Content for Trial Users*
            </label>
            <Editor
              value={formInputs.alert_content_trial_users}
              onChange={(value) =>
                handleChange({
                  target: { name: "alert_content_trial_users", value },
                })
              }
              placeholder="Enter alert message for trial users..."
            />
          </div>
        </div>

        {/* Alert Content for Paid Users */}
        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label fs-18">
              Alert Content for Paid Users*
            </label>
            <Editor
              value={formInputs.alert_content_paid_users}
              onChange={(value) =>
                handleChange({
                  target: { name: "alert_content_paid_users", value },
                })
              }
              placeholder="Enter alert message for paid users..."
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label fs-18">
              Popup Content for Trial Expiry*
            </label>
            <Editor
              value={formInputs.popup_content_trial_users}
              onChange={(value) =>
                handleChange({
                  target: { name: "popup_content_trial_users", value },
                })
              }
              placeholder="Enter alert message for trial expiry..."
            />
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <label className="form-label fs-18">
              Popup Content for Subscription Expiry*
            </label>
            <Editor
              value={formInputs.popup_content_subscription_expiry}
              onChange={(value) =>
                handleChange({
                  target: { name: "popup_content_subscription_expiry", value },
                })
              }
              placeholder="Enter alert message for subscription expiry..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div
          className="col-12 d-flex justify-content-end position-fixed"
          style={{ bottom: 20, right: 20 }}
        >
          <TooltipShowing
            accessType={accessType}
            component={
              <Button
                disabled={show}
                type="submit"
                variant="contained"
                className="capitalized button-in-listing d-flex align-items-center ms-2"
              >
                Submit
                <Iconify
                  className="ms-1"
                  icon="material-symbols:exit-to-app"
                  fontSize={16}
                />
              </Button>
            }
          />
        </div>
      </form>
    </div>
  );
};

export default PaymentAlertSettings;
