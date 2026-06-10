import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useAdminContext } from "../../Hooks/AdminContext";
import Iconify from "../../components/Iconify";
import {
  get_invoice_reporting_settings,
  set_invoice_reporting_settings,
} from "../../DAL/Settings/Settings";
import { enqueueSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import TooltipShowing from "../../components/TooltipShowing";
import { permission_string } from "../../utils/constant";

// Constants for repeated labels - reused across all sections
const FIELD_LABELS = {
  SANDBOX_URL: "Sandbox Url*",
  PRODUCTION_URL: "Production Url*",
  VALIDATION_SANDBOX_URL: "Validation Sandbox Url*",
  VALIDATION_PRODUCTION_URL: "Validation Production Url*",
};

const CustomTextFieldTypePassword = ({ name, value, onChange }) => {
  return (
    <TextField
      fullWidth
      name={name}
      value={value}
      onChange={onChange}
      size="small"
    />
  );
};

const icon = (
  <Iconify
    icon="material-icon-theme:url"
    className="me-1 text-primary"
    sx={{ fontSize: "1.2rem" }}
  />
);

const MainWrapperDiv = ({
  s_FIELD_LABELS,
  p_FIELD_LABELS,
  s_FIELD_NAME,
  p_FIELD_NAME,
  s_PLACEHOLDER,
  p_PLACEHOLDER,
  s_VALUE,
  p_VALUE,
  title,
  handleChange,
  v_s_FIELD_LABELS,
  v_p_FIELD_LABELS,
  v_s_FIELD_NAME,
  v_p_FIELD_NAME,
  v_s_PLACEHOLDER,
  v_p_PLACEHOLDER,
  v_s_VALUE,
  v_p_VALUE,
}) => {
  return (
    <div className="col-12">
      <h4 className="mb-2 fbr-heading">{title}</h4>
      <div className="row gy-3">
        <div className="col-12 col-md-6">
          <label className="form-label fw-medium mb-2">
            {icon}
            {s_FIELD_LABELS}
          </label>
          <CustomTextFieldTypePassword
            name={s_FIELD_NAME}
            placeholder={s_PLACEHOLDER}
            value={s_VALUE}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-medium mb-2">
            {icon}
            {p_FIELD_LABELS}
          </label>
          <CustomTextFieldTypePassword
            name={p_FIELD_NAME}
            placeholder={p_PLACEHOLDER}
            value={p_VALUE}
            onChange={handleChange}
          />
        </div>
        {title === "FBR Digital Invoice" && (
          <>
            <div className="col-12 col-md-6">
              <label className="form-label fw-medium mb-2">
                {icon}
                {v_s_FIELD_LABELS}
              </label>
              <CustomTextFieldTypePassword
                name={v_s_FIELD_NAME}
                placeholder={v_s_PLACEHOLDER}
                value={v_s_VALUE}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-medium mb-2">
                {icon}
                {v_p_FIELD_LABELS}
              </label>
              <CustomTextFieldTypePassword
                name={v_p_FIELD_NAME}
                placeholder={v_p_PLACEHOLDER}
                value={v_p_VALUE}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const InvoiceReportingSettings = ({ screen_path }) => {
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fbr_invoice_sandbox_url: "",
    fbr_invoice_production_url: "",
    fbr_invoice_validation_sandbox_url: "",
    fbr_invoice_validation_production_url: "",
    fbr_pos_sandbox_url: "",
    fbr_pos_production_url: "",
    pra_sandbox_url: "",
    pra_production_url: "",
  });
  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getInvoiceReportingSettings = async () => {
    setLoading(true);
    const data = {
      type: "invoice_reporting_settings",
    };
    const response = await get_invoice_reporting_settings(data);
    if (response.code === 200) {
      const { pra_invoicing, fbr_pos_invoicing, fbr_invoicing } =
        response.settings;
      setFormData({
        pra_sandbox_url: pra_invoicing.sandbox_url,
        pra_production_url: pra_invoicing.production_url,
        fbr_pos_sandbox_url: fbr_pos_invoicing.sandbox_url,
        fbr_pos_production_url: fbr_pos_invoicing.production_url,
        fbr_invoice_sandbox_url: fbr_invoicing.sandbox_url,
        fbr_invoice_production_url: fbr_invoicing.production_url,
        fbr_invoice_validation_sandbox_url:
          fbr_invoicing.validation_sandbox_url,
        fbr_invoice_validation_production_url:
          fbr_invoicing.validation_production_url,
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

    const data = {
      type: "invoice_reporting_settings",
      invoice_reporting_settings: {
        fbr_invoicing: {
          sandbox_url: formData.fbr_invoice_sandbox_url,
          production_url: formData.fbr_invoice_production_url,
          validation_sandbox_url: formData.fbr_invoice_validation_sandbox_url,
          validation_production_url:
            formData.fbr_invoice_validation_production_url,
        },
        fbr_pos_invoicing: {
          sandbox_url: formData.fbr_pos_sandbox_url,
          production_url: formData.fbr_pos_production_url,
        },
        pra_invoicing: {
          sandbox_url: formData.pra_sandbox_url,
          production_url: formData.pra_production_url,
        },
      },
    };
    setLoading(true);
    const response = await set_invoice_reporting_settings(data);
    if (response.code === 200) {
      getInvoiceReportingSettings();
      enqueueSnackbar(response.message || "Something went wrong", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(response.message || "Something went wrong", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setNavBarTitle("Invoice Reporting Settings");
    setIsBackButton(false);
    getInvoiceReportingSettings();
  }, []);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <div className="container-fluid py-4">
      <form onSubmit={handleSubmit}>
        <div className="row gy-4">
          <MainWrapperDiv
            s_FIELD_LABELS={FIELD_LABELS.SANDBOX_URL}
            p_FIELD_LABELS={FIELD_LABELS.PRODUCTION_URL}
            s_FIELD_NAME="fbr_invoice_sandbox_url"
            p_FIELD_NAME="fbr_invoice_production_url"
            s_PLACEHOLDER="Enter Sandbox Url"
            p_PLACEHOLDER="Enter Production Url"
            s_VALUE={formData.fbr_invoice_sandbox_url}
            p_VALUE={formData.fbr_invoice_production_url}
            v_s_FIELD_LABELS={FIELD_LABELS.VALIDATION_SANDBOX_URL}
            v_p_FIELD_LABELS={FIELD_LABELS.VALIDATION_PRODUCTION_URL}
            v_s_FIELD_NAME="fbr_invoice_validation_sandbox_url"
            v_p_FIELD_NAME="fbr_invoice_validation_production_url"
            v_s_PLACEHOLDER="Enter Validation Sandbox Url"
            v_p_PLACEHOLDER="Enter Validation Production Url"
            v_s_VALUE={formData.fbr_invoice_validation_sandbox_url}
            v_p_VALUE={formData.fbr_invoice_validation_production_url}
            title="FBR Digital Invoice"
            handleChange={handleChange}
          />

          <MainWrapperDiv
            s_FIELD_LABELS={FIELD_LABELS.SANDBOX_URL}
            p_FIELD_LABELS={FIELD_LABELS.PRODUCTION_URL}
            s_FIELD_NAME="fbr_pos_sandbox_url"
            p_FIELD_NAME="fbr_pos_production_url"
            s_PLACEHOLDER="Enter Sandbox Url"
            p_PLACEHOLDER="Enter Production Url"
            s_VALUE={formData.fbr_pos_sandbox_url}
            p_VALUE={formData.fbr_pos_production_url}
            title="FBR POS Invoice"
            handleChange={handleChange}
          />

          <MainWrapperDiv
            s_FIELD_LABELS={FIELD_LABELS.SANDBOX_URL}
            p_FIELD_LABELS={FIELD_LABELS.PRODUCTION_URL}
            s_FIELD_NAME="pra_sandbox_url"
            p_FIELD_NAME="pra_production_url"
            s_PLACEHOLDER="Enter Sandbox Url"
            p_PLACEHOLDER="Enter Production Url"
            s_VALUE={formData.pra_sandbox_url}
            p_VALUE={formData.pra_production_url}
            title="PRA Invoice"
            handleChange={handleChange}
          />
        </div>

        <div
          className="col-12 d-flex justify-content-end position-fixed"
          style={{ bottom: 20, right: 20 }}
        >
          <TooltipShowing
            accessType={accessType}
            component={
              <Button
                type="submit"
                variant="contained"
                className="capitalized button-in-listing d-flex align-items-center ms-2"
                disabled={show}
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

export default InvoiceReportingSettings;
