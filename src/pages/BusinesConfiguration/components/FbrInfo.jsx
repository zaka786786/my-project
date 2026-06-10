import { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Card,
  ListItemText,
  Checkbox,
  Select,
  FormControl,
} from "@mui/material";
import Iconify from "../../../components/Iconify";
import { Icon } from "@iconify/react/dist/iconify.js";
import CustomTextFieldTypePassword from "./CustomTextFieldTypePassword";
import FbrInfoGeneric from "../../../components/FbrInfoGeneric/FbrInfoGeneric";

const FbrInfo = ({
  fbrData,
  onChange,
  setFormInputs,
  formInputs,
  handleFormInputsChange,
  isShowDigital = false,
  isShowPOS = false,
  isShowProvincePOS = false,
  user_id,
}) => {
  const handleMultiSelectChange = (event) => {
    const { value } = event.target;
    const selectedValues = typeof value === "string" ? value.split(",") : value;

    setFormInputs((prev) => {
      const currentDefault = prev.default_invoice_reporting_method;
      const newDefault = selectedValues.includes(currentDefault)
        ? currentDefault
        : selectedValues[0] || "";

      return {
        ...prev,
        invoice_reporting_method: selectedValues,
        default_invoice_reporting_method: newDefault,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...fbrData, [name]: value });
  };
  useEffect(() => {}, [formInputs]);

  return (
    <Card className="p-4 shadow-md border-0 rounded-4 mb-4 business-customer-tabs-card">
      <div className="row gy-3">
        {/* Enable FBR Invoice System */}
        <div className="col-12 col-md-4">
          <label className="form-label fw-medium mb-2">
            <Iconify
              icon="mdi:settings-outline"
              className="me-1 text-primary"
              sx={{
                fontSize: "1.2rem",
              }}
            />
            Enable FBR Invoicing System*?
          </label>
          <TextField
            select
            fullWidth
            required
            label=""
            name="want_to_use_fbr_invoice"
            value={fbrData.want_to_use_fbr_invoice}
            onChange={(e) => {
              handleChange(e);
              // Reset related fields when disabling FBR system
              if (!e.target.value) {
                setFormInputs((prev) => ({
                  ...prev,
                  use_fbr_invoice: false,
                  fbr_secret_token: "",
                  show_fbr_info_in_settings_and_payments: false,
                }));
              }
            }}
            size="small"
            variant="outlined"
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
        </div>

        {/* FBR Invoice */}
        {fbrData.want_to_use_fbr_invoice && (
          <div className="col-12 col-md-4">
            <label className="form-label fw-medium mb-2">
              <Iconify
                icon="bitcoin-icons:invoice-filled"
                className="me-1 text-primary"
                sx={{
                  fontSize: "1.2rem",
                }}
              />
              Allow Use Of FBR Invoicing System*?
            </label>
            <TextField
              select
              fullWidth
              required
              label=""
              name="use_fbr_invoice"
              value={formInputs.use_fbr_invoice}
              onChange={(e) => {
                handleChange(e);
                setFormInputs((prev) => ({
                  ...prev,
                  fbr_secret_token: !formInputs?.use_fbr_invoice
                    ? ""
                    : formInputs?.fbr_secret_token,
                  show_fbr_info_in_settings_and_payments: false,
                }));
              }}
              size="small"
              variant="outlined"
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          </div>
        )}

        {formInputs.use_fbr_invoice && (
          <div className="col-12 col-md-4">
            <label className="form-label mb-2 d-flex align-items-center">
              <Icon
                icon={"material-symbols:domain-verification-outline"}
                width={22}
                height={22}
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Show FBR info in Settings/Payments*
            </label>

            <TextField
              select
              fullWidth
              required
              label=""
              name="show_fbr_info_in_settings_and_payments"
              value={
                formInputs?.show_fbr_info_in_settings_and_payments ?? false
              }
              onChange={(e) => {
                handleChange(e);
                // setFormInputs((prev) => ({
                //   ...prev,
                //   fbr_secret_token: !formInputs?.use_fbr_invoice && null,
                // }));
              }}
              size="small"
              variant="outlined"
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>

            {/* <TextField
            select
            fullWidth
            size="small"
            value={formInputs?.show_fbr_info_in_settings_and_payments ?? false}
            onChange={(e) => {
              handleChange(e);
            }}
            name="show_fbr_info_in_settings_and_payments"
            className="text-field-border"
            SelectProps={{
              native: true,
            }}
            required
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField> */}
          </div>
        )}

        {formInputs?.want_to_use_fbr_invoice && (
          <>
            <div className="col-12 col-md-4">
              <label className="form-label mb-2 d-flex align-items-center">
                <Icon
                  icon="fluent-mdl2:report-warning"
                  className="me-1 tabs-icon-color label-icon-setting"
                />
                Invoice Reporting Method*
              </label>
              <FormControl fullWidth size="small">
                <Select
                  multiple
                  name="invoice_reporting_method"
                  value={formInputs?.invoice_reporting_method || []}
                  onChange={handleMultiSelectChange}
                  renderValue={(selected) => {
                    const labels = {
                      pos_invoicing: "FBR POS Invoicing",
                      province_pos_invoicing: "Province POS Invoicing",
                      digital_invoicing: "Digital Invoicing",
                    };
                    return selected.map((val) => labels[val] || val).join(", ");
                  }}
                  className="multiple-selection-field"
                  required
                >
                  <MenuItem value="pos_invoicing">
                    <Checkbox
                      checked={
                        (formInputs?.invoice_reporting_method || []).indexOf(
                          "pos_invoicing",
                        ) > -1
                      }
                    />
                    <ListItemText primary="FBR POS Invoicing" />
                  </MenuItem>
                  <MenuItem value="province_pos_invoicing">
                    <Checkbox
                      checked={
                        (formInputs?.invoice_reporting_method || []).indexOf(
                          "province_pos_invoicing",
                        ) > -1
                      }
                    />
                    <ListItemText primary="Province POS Invoicing" />
                  </MenuItem>
                  <MenuItem value="digital_invoicing">
                    <Checkbox
                      checked={
                        (formInputs?.invoice_reporting_method || []).indexOf(
                          "digital_invoicing",
                        ) > -1
                      }
                    />
                    <ListItemText primary="Digital Invoicing" />
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label mb-2 d-flex align-items-center">
                <Icon
                  icon="mdi:cursor-default-click-outline"
                  className="me-1 tabs-icon-color label-icon-setting"
                />
                Choose Default Invoice Method*
                {/* Validate Option Allowed* */}
              </label>
              <TextField
                select
                fullWidth
                size="small"
                name="default_invoice_reporting_method"
                value={formInputs?.default_invoice_reporting_method || ""}
                onChange={handleFormInputsChange}
                className="text-field-border"
                SelectProps={{ native: true }}
                disabled={!formInputs?.invoice_reporting_method?.length}
                required
              >
                <option value="" disabled>
                  Select Default
                </option>
                {formInputs?.invoice_reporting_method?.map((option) => (
                  <option key={option} value={option}>
                    {option === "pos_invoicing"
                      ? "FBR POS Invoicing"
                      : option === "province_pos_invoicing"
                        ? "Province POS Invoicing"
                        : "Digital Invoicing"}
                  </option>
                ))}
              </TextField>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label mb-2 d-flex align-items-center">
                <Icon
                  icon={"hugeicons:security-validation"}
                  className="me-1 tabs-icon-color label-icon-setting"
                />
                Validate FBR Data Allowed*
              </label>
              <TextField
                select
                fullWidth
                size="small"
                value={formInputs?.validate_fbr_data || "false"}
                onChange={handleFormInputsChange}
                name="validate_fbr_data"
                className="text-field-border"
                SelectProps={{
                  native: true,
                }}
                required
              >
                <option value={"true"}>Yes</option>
                <option value={"false"}>No</option>
              </TextField>
            </div>
            {(formInputs?.invoice_reporting_method?.includes("pos_invoicing") ||
              formInputs?.invoice_reporting_method?.includes(
                "province_pos_invoicing",
              )) && (
              <>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-medium mb-2">
                    <Icon
                      icon={"mdi:printer-pos-cog-outline"}
                      className="me-1 tabs-icon-color label-icon-setting"
                    />
                    POS Service Fee*
                  </label>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    name="pos_service_fee"
                    type="number"
                    value={formInputs?.pos_service_fee}
                    onChange={handleFormInputsChange}
                    variant="outlined"
                    inputProps={{
                      min: 0,
                      inputMode: "numeric",
                    }}
                  />
                </div>
                {/* <div className="col-12 col-md-4 mb-3">
                  <label className="form-label fw-medium mb-2">
                    <Iconify
                      icon="mdi:server"
                      className="me-1 text-primary"
                      sx={{
                        fontSize: "1.2rem",
                      }}
                    />
                    Allow Pos Service Fee*
                  </label>
                  <TextField
                    select
                    fullWidth
                    required
                    label=""
                    name="add_pos_service_fee"
                    value={fbrData.add_pos_service_fee}
                    onChange={handleChange}
                    size="small"
                    variant="outlined"
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </TextField>
                </div> */}
              </>
            )}
          </>
        )}
        {fbrData.want_to_use_fbr_invoice && (
          <div className="col-12 col-md-4 mb-3">
            <label className="form-label fw-medium mb-2">
              <Iconify
                icon="ic:outline-medical-information"
                className="me-1 tabs-icon-color label-icon-setting"
                sx={{
                  fontSize: "1.2rem",
                }}
              />
              Tax Formation*
            </label>
            <TextField
              fullWidth
              required
              label=""
              name="tax_formation"
              value={formInputs?.tax_formation}
              onChange={handleFormInputsChange}
              size="small"
              variant="outlined"
              placeholder="Enter Tax Formation"
            />
          </div>
        )}
      </div>

      {fbrData?.use_fbr_invoice &&
        formInputs.want_to_use_fbr_invoice &&
        isShowDigital && (
          <div className="row mt-4">
            <>
              <h4 className="mb-3 fbr-heading">Digital Invoicing</h4>
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:server"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Environment*
                </label>
                <TextField
                  select
                  fullWidth
                  required
                  label=""
                  name="fbr_environment"
                  value={fbrData.fbr_environment}
                  onChange={handleChange}
                  size="small"
                  variant="outlined"
                >
                  <MenuItem value="sandbox">Sandbox</MenuItem>
                  <MenuItem value="production">Production</MenuItem>
                </TextField>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-medium mb-2">
                  <Icon
                    icon={"material-symbols:domain-verification-outline"}
                    className="me-1 tabs-icon-color label-icon-setting"
                  />
                  Digital Invoicing Service Fee*
                </label>
                <TextField
                  fullWidth
                  required
                  size="small"
                  name="digital_invoicing_service_fee"
                  type="number"
                  value={formInputs?.digital_invoicing_service_fee}
                  onChange={handleFormInputsChange}
                  variant="outlined"
                  inputProps={{
                    min: 0,
                    inputMode: "numeric",
                  }}
                />
              </div>
              {/* <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:server"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Allow Digital Invoicing Service Fee*
                </label>
                <TextField
                  select
                  fullWidth
                  required
                  label=""
                  name="add_digital_invoicing_service_fee"
                  value={fbrData.add_digital_invoicing_service_fee}
                  onChange={handleChange}
                  size="small"
                  variant="outlined"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </TextField>
              </div> */}
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Sandbox Secret Key*
                </label>

                <CustomTextFieldTypePassword
                  name="fbr_secret_token"
                  placeholder="Enter Sandbox Secret Key"
                  value={fbrData.fbr_secret_token || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Production Secret Key*
                </label>

                <CustomTextFieldTypePassword
                  name="fbr_production_secret_key"
                  placeholder="Enter Production Secret Key"
                  value={fbrData.fbr_production_secret_key || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          </div>
        )}
      {/* FBR POS Invoicing */}
      {fbrData?.use_fbr_invoice &&
        formInputs.want_to_use_fbr_invoice &&
        isShowPOS && (
          <div className="row mt-4">
            <>
              <h4 className="mb-3 fbr-heading">FBR POS Invoicing</h4>
              {/* <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:account-cog-outline"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Use As*
                </label>
                <TextField
                  select
                  fullWidth
                  required
                  label=""
                  name="use_as"
                  placeholder="Select Use As"
                  value={fbrData.use_as}
                  onChange={handleChange}
                  size="small"
                  variant="outlined"
                >
                  <MenuItem value="province">Province</MenuItem>
                  <MenuItem value="federal">Federal</MenuItem>
                </TextField>
              </div> */}

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:server"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Environment*
                </label>
                <TextField
                  select
                  fullWidth
                  required
                  label=""
                  name="pos_environment"
                  value={fbrData.pos_environment || "sandbox"}
                  onChange={handleChange}
                  size="small"
                  variant="outlined"
                >
                  <MenuItem value="sandbox">Sandbox</MenuItem>
                  <MenuItem value="production">Production</MenuItem>
                </TextField>
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Sandbox FBR POS ID*
                </label>

                <CustomTextFieldTypePassword
                  name="pos_id_for_sandbox"
                  placeholder="Enter Sandbox POS ID"
                  value={fbrData.pos_id_for_sandbox || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Sandbox Token*
                </label>

                <CustomTextFieldTypePassword
                  name="pos_secret_key_for_sandbox"
                  placeholder="Enter Sandbox Token"
                  value={fbrData.pos_secret_key_for_sandbox || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Production FBR POS ID*
                </label>

                <CustomTextFieldTypePassword
                  name="pos_id_for_production"
                  placeholder="Enter Production POS ID"
                  value={fbrData.pos_id_for_production || ""}
                  onChange={handleChange}
                />
              </div>

              {/* FBR Production Secret Key */}
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Production Token*
                </label>

                <CustomTextFieldTypePassword
                  name="pos_secret_key_for_production"
                  placeholder="Enter Production Token"
                  value={fbrData.pos_secret_key_for_production || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          </div>
        )}

      {/* Province POS Invoicing */}
      {fbrData?.use_fbr_invoice &&
        formInputs.want_to_use_fbr_invoice &&
        isShowProvincePOS && (
          <div className="row mt-4">
            <>
              <h4 className="mb-3 fbr-heading">Province POS Invoicing</h4>
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:server"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Environment*
                </label>
                <TextField
                  select
                  fullWidth
                  required
                  label=""
                  name="province_pos_environment"
                  value={fbrData.province_pos_environment || "sandbox"}
                  onChange={handleChange}
                  size="small"
                  variant="outlined"
                >
                  <MenuItem value="sandbox">Sandbox</MenuItem>
                  <MenuItem value="production">Production</MenuItem>
                </TextField>
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Sandbox Province POS ID*
                </label>

                <CustomTextFieldTypePassword
                  name="province_pos_id_for_sandbox"
                  placeholder="Enter Sandbox POS ID"
                  value={fbrData.province_pos_id_for_sandbox || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Sandbox Token*
                </label>

                <CustomTextFieldTypePassword
                  name="province_pos_secret_key_for_sandbox"
                  placeholder="Enter Sandbox Token"
                  value={fbrData.province_pos_secret_key_for_sandbox || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Production Province POS ID*
                </label>

                <CustomTextFieldTypePassword
                  name="province_pos_id_for_production"
                  placeholder="Enter Production POS ID"
                  value={fbrData.province_pos_id_for_production || ""}
                  onChange={handleChange}
                />
              </div>

              {/* FBR Production Secret Key */}
              <div className="col-12 col-md-4 mb-3">
                <label className="form-label fw-medium mb-2">
                  <Iconify
                    icon="mdi:key"
                    className="me-1 text-primary"
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                  Production Token*
                </label>

                <CustomTextFieldTypePassword
                  name="province_pos_secret_key_for_production"
                  placeholder="Enter Production Token"
                  value={fbrData.province_pos_secret_key_for_production || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          </div>
        )}
      {formInputs?.show_fbr_info_in_settings_and_payments && (
        <>
          <div className="row gy-3 mt-3">
            <div className="col-12">
              <h4 className="mb-3 fbr-heading">FBR Transaction Details</h4>
            </div>

            <FbrInfoGeneric
              formInputs={{
                transaction_type: fbrData.transaction_type,
                rate_id: fbrData.rate_id,
                rate_description: fbrData.rate_description,
                rate_value: fbrData.rate_value,
                hs_code: fbrData.hs_code,
                uom_id: fbrData.uom_id,
                uom_description: fbrData.uom_description,
                sro_id: formInputs.sro_id ?? "",
                sro_serial_no: formInputs.sro_serial_no ?? "",
                sro_description: formInputs.sro_description ?? "",
                sro_item_description: formInputs.sro_item_description ?? null,
              }}
              handleChange={(e) => {
                const name = e.target.name;
                const value = e.target.value;
                setFormInputs((prev) => ({
                  ...prev,
                  [name]: value,
                }));
              }}
              setProfile={setFormInputs}
              from_core_state={true}
              showTransactionType={true}
              showHsCode={true}
              showSchedule={true}
              showSroItemDescription={true}
              transactionTypeLabel="Transaction Type"
              transactionTypePlaceholder="Search and select Transaction Type"
              hsCodeRequired={true}
              transactionTypeRequired={true}
              user_id={user_id}
            />
          </div>
        </>
      )}
    </Card>
  );
};

export default FbrInfo;
