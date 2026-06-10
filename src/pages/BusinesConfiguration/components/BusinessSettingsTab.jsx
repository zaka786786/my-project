import {
  Card,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import Editor from "../../../components/editor/Editor";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useState } from "react";
import TemplatePreviewModal from "../TemplatePreviewModal";
import {
  digitalStyle1,
  digitalStyle2,
  digitalStyle3,
  posStyle1,
  posStyle2,
  posStyle3,
  praStyle1,
  praStyle2,
  praStyle3,
  digitalStyle4,
  digitalStyle5,
  posStyle4,
  posStyle5,
  praStyle4,
  praStyle5,
} from "../../../assets";
import InvoiceTemplateSelect from "./InvoiceTemplateSelect";

const digitalTemplateImages = {
  "invoice-receipt-v1": digitalStyle1,
  "invoice-receipt-v2": digitalStyle2,
  "invoice-receipt-v3": digitalStyle3,
  "invoice-receipt-v4": digitalStyle4,
  "invoice-receipt-v5": digitalStyle5,
};

const posTemplateImages = {
  "invoice-receipt-v1": posStyle1,
  "invoice-receipt-v2": posStyle2,
  "invoice-receipt-v3": posStyle3,
  "invoice-receipt-v4": posStyle4,
  "invoice-receipt-v5": posStyle5,
};
const praTemplateImages = {
  "invoice-receipt-v1": praStyle1,
  "invoice-receipt-v2": praStyle2,
  "invoice-receipt-v3": praStyle3,
  "invoice-receipt-v4": praStyle4,
  "invoice-receipt-v5": praStyle5,
};

const templateOptions = [
  { label: "Select Template", value: "", slug: "", image: null },
  {
    label: "General Invoice Receipt Template",
    value: "invoice-receipt-v1",
    slug: "invoice-receipt-v1",
  },
  {
    label: "Doctors Invoice Receipt Template",
    value: "invoice-receipt-v2",
    slug: "invoice-receipt-v2",
  },
  {
    label: "Restaurant Invoice Receipt Template",
    value: "invoice-receipt-v3",
    slug: "invoice-receipt-v3",
  },
  {
    label: "Garments Invoice Receipt Template",
    value: "invoice-receipt-v4",
    slug: "invoice-receipt-v4",
  },
  {
    label: "Pharmacy Invoice Receipt Template",
    value: "invoice-receipt-v5",
    slug: "invoice-receipt-v5",
  },
];

const BusinessSettingsTab = ({
  formInputs,
  setFormInputs,
  handleFormInputsChange,
}) => {
  const [previewModal, setPreviewModal] = useState({
    open: false,
    image: null,
    title: "",
  });

  const handleOpenPreview = (slug, title) => {
    if (slug) {
      setPreviewModal({ open: true, image: slug, title });
    }
  };
  const handleClosePreview = () => {
    setPreviewModal({ open: false, image: null, title: "" });
  };

  const handleDateChange = (name, value) => {
    let formattedValue = value ? value.format("MMM") : "";

    let startMonth = formattedValue;
    let endMonth = formattedValue;

    if (value) {
      if (name === "business_year_start" && value) {
        endMonth = value.subtract(1, "month").format("MMM");
      } else {
        startMonth = value.add(1, "month").format("MMM");
      }
    }

    setFormInputs((prev) => ({
      ...prev,
      business_year_start: startMonth,
      business_year_end: endMonth,
    }));
  };

  return (
    <Card className="p-4 shadow-md border-0 rounded-4 mb-4 business-customer-tabs-card">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="row gy-3">
          {/* ===================== Access & Limits ===================== */}
          <div className="col-12 mt-2">
            <div className="d-flex align-items-center mb-0">
              <h6 className="mb-0 fbr-heading">Access & Limits (Allowances)</h6>
            </div>

            <hr className="mt-3 mb-0" />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:description-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Monthly Invoices Allowed*
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="monthly_invoices_allowed"
              value={formInputs?.monthly_invoices_allowed}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:group-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Staff Login Allowed*
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="staff_login_allowed"
              value={formInputs?.staff_login_allowed}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:storefront-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Branches Allowed*
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="branches_allowed"
              value={formInputs?.branches_allowed}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:warehouse-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Warehouses Allowed*
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="warehouses_allowed"
              value={formInputs?.warehouses_allowed}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-3">
            {/* <label className="form-label-new mb-2 label-text d-flex align-items-center"> */}
            <label className="form-label-new mb-2 label-text d-flex align-items-center text-nowrap">
              <Icon
                icon="material-symbols:database-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Yearly Storage Records Allowed*
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="yearly_storage_records_allowed"
              value={formInputs?.yearly_storage_records_allowed}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="codicon:type-hierarchy"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Software Type*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="software_type"
              value={formInputs?.software_type}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={"cloud"}>Cloud Base</option>
              <option value={"offline"}>Offline</option>
            </TextField>
          </div>
          {formInputs?.software_type === "offline" && (
            <>
              <div className="col-12 col-md-3">
                <label className="form-label-new mb-2 label-text d-flex align-items-center">
                  <Icon
                    icon="ix:version-history"
                    className="me-1 tabs-icon-color label-icon-setting"
                  />
                  Software Version*
                </label>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  name="offline_version"
                  value={formInputs?.offline_version}
                  onChange={handleFormInputsChange}
                  variant="outlined"
                  required={true}
                  placeholder="Enter the software version for offline software"
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label-new mb-2 label-text d-flex align-items-center">
                  <Icon
                    icon="material-symbols:settings-backup-restore"
                    className="me-1 tabs-icon-color label-icon-setting"
                  />
                  Allow offline software updates*
                </label>
                <TextField
                  select
                  fullWidth
                  size="small"
                  name="allow_offline_software_update"
                  value={formInputs?.allow_offline_software_update ?? false}
                  onChange={handleFormInputsChange}
                  SelectProps={{ native: true }}
                  required
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </TextField>
              </div>
            </>
          )}

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:settings-backup-restore"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              BackUp Years Allowed*
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="backup_of_years"
              value={formInputs?.backup_of_years}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          {/*  Business & Accounts Setup */}
          <div className="col-12 mt-4">
            <div className="d-flex align-items-center mb-0">
              <h6 className="mb-0 fbr-heading">Business & Accounts Setup</h6>
            </div>

            <hr className="mt-3 mb-0" />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:calendar-month-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Business Year Start*
            </label>

            <DatePicker
              views={["month"]}
              value={
                formInputs?.business_year_start
                  ? dayjs(formInputs?.business_year_start, "MMM")
                  : null
              }
              onChange={(newValue) => {
                if (newValue) {
                  handleDateChange("business_year_start", newValue);
                }
              }}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:calendar-month-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Business Year End*
            </label>

            <DatePicker
              views={["month"]}
              value={
                formInputs?.business_year_end
                  ? dayjs(formInputs?.business_year_end, "MMM")
                  : null
              }
              onChange={(value) => handleDateChange("business_year_end", value)}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="emojione-monotone:ledger"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Allow Ledger Creation*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="allow_ledger_creation"
              value={formInputs?.allow_ledger_creation ?? false}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center text-nowrap">
              <Icon
                icon="tabler:cash-banknote-move"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Shipment Base Withholding Amount Type*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="withholding_base_amount_type"
              value={formInputs?.withholding_base_amount_type}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={"sales_value"}>Sales Value (Excl. Tax)</option>
              <option value={"gross_amount"}>
                Gross Amount (All taxes included)
              </option>
              <option value={"tax_amount"}>
                Sales Tax (Only sales tax, no other taxes)
              </option>
            </TextField>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center text-nowrap">
              <Icon
                icon="tabler:cash-banknote-move"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Sale Base Withholding Amount Type*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="sale_withholding_base_amount_type"
              value={formInputs?.sale_withholding_base_amount_type}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={"sales_value"}>Sales Value (Excl. Tax)</option>
              <option value={"gross_amount"}>
                Gross Amount (All taxes included)
              </option>
              <option value={"tax_amount"}>
                Sales Tax (Only sales tax, no other taxes)
              </option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center text-nowrap">
              <Icon
                icon="material-symbols:add-box-outline-rounded"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Do you want additional service fee*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="additional_services_fee"
              value={formInputs?.additional_services_fee ?? false}
              onChange={(e) => {
                console.log(
                  e.target.value,
                  "e.target.valuee.target.valuee.target.valuee.target.value",
                );

                setFormInputs((prev) => ({
                  ...prev,
                  additional_services_fee:
                    e.target.value === "true" ? true : false,
                  label_for_additional_services: "",
                  percentage_for_additional_services: "5",
                }));
              }}
              SelectProps={{ native: true }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>
          {formInputs?.additional_services_fee && (
            <div className="col-12 col-md-3">
              <label className="form-label-new mb-2 label-text d-flex align-items-center">
                <Icon
                  icon="icon-park-outline:label"
                  className="me-1 tabs-icon-color label-icon-setting"
                />
                Label for additional service fee*
              </label>
              <TextField
                type="text"
                fullWidth
                placeholder="write the label for the service fee field"
                size="small"
                name="label_for_additional_services"
                value={formInputs?.label_for_additional_services || ""}
                onChange={handleFormInputsChange}
                required
              />
            </div>
          )}
          {formInputs?.additional_services_fee && (
            <div className="col-12 col-md-3">
              <label className="form-label-new mb-2 label-text d-flex align-items-center">
                <Icon
                  icon="tabler:circle-dashed-percentage"
                  className="me-1 tabs-icon-color label-icon-setting"
                />
                Default Percentage*
              </label>
              <TextField
                type="number"
                fullWidth
                placeholder="write the default percentage for the additional service fee"
                size="small"
                name="percentage_for_additional_services"
                value={formInputs?.percentage_for_additional_services}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (Number(value) >= 0 && Number(value) <= 100)
                  ) {
                    handleFormInputsChange(e);
                  }
                }}
                required
                InputProps={{
                  endAdornment: "%",
                }}
                inputProps={{
                  min: 1,
                  max: 100,
                }}
              />
            </div>
          )}

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon={"material-symbols:domain-verification-outline"}
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Default Sales Filter*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              value={formInputs?.filter_date_type}
              onChange={handleFormInputsChange}
              name="filter_date_type"
              className="text-field-border"
              SelectProps={{
                native: true,
              }}
              required
            >
              <option value="invoice_date">Invoice Date</option>
              <option value="created_at">Created At </option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon={"material-symbols:domain-verification-outline"}
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Default Shipment Filter*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              value={formInputs?.filter_shipment_date_type}
              onChange={handleFormInputsChange}
              name="filter_shipment_date_type"
              className="text-field-border"
              SelectProps={{
                native: true,
              }}
              required
            >
              <option value="shipment_date">Shipment Date</option>
              <option value="created_at">Created At </option>
            </TextField>
          </div>

          {/*  Invoice & Operations Settings */}
          <div className="col-12 mt-4">
            <div className="d-flex align-items-center mb-0">
              <h6 className="mb-0 fbr-heading">
                Invoice & Operations Settings
              </h6>
            </div>

            <hr className="mt-3 mb-0" />
          </div>

          {/* Digital Invoice Receipt Layout */}
          <InvoiceTemplateSelect
            title="Digital Invoice Receipt Layout"
            name="digital_invoice_template_slug"
            value={formInputs?.digital_invoice_template_slug}
            handleFormInputsChange={handleFormInputsChange}
            handleOpenPreview={handleOpenPreview}
            templateOptions={templateOptions}
            imagesObject={digitalTemplateImages}
          />

          {/* POS Invoice Receipt Layout */}
          <InvoiceTemplateSelect
            title="POS Invoice Receipt Layout"
            name="pos_invoice_template_slug"
            value={formInputs?.pos_invoice_template_slug}
            handleFormInputsChange={handleFormInputsChange}
            handleOpenPreview={handleOpenPreview}
            templateOptions={templateOptions}
            imagesObject={posTemplateImages}
          />

          {/* PRA Invoice Receipt Layout */}
          <InvoiceTemplateSelect
            title="PRA Invoice Receipt Layout"
            name="pra_invoice_template_slug"
            value={formInputs?.pra_invoice_template_slug}
            handleFormInputsChange={handleFormInputsChange}
            handleOpenPreview={handleOpenPreview}
            templateOptions={templateOptions}
            imagesObject={praTemplateImages}
          />

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="line-md:link"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Feedback Link
            </label>
            <TextField
              fullWidth
              size="small"
              type="text"
              name="invoice_feedback_url"
              value={formInputs?.invoice_feedback_url}
              onChange={handleFormInputsChange}
              variant="outlined"
              required={false}
              placeholder="Enter the link where the users for this business can give feedback"
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon={"material-symbols:domain-verification-outline"}
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Show Products*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              value={formInputs?.show_products}
              onChange={handleFormInputsChange}
              name="show_products"
              className="text-field-border"
              SelectProps={{
                native: true,
              }}
              required
            >
              <option value="all">All</option>
              <option value="in_stock">In Stock </option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center text-nowrap">
              <Icon
                icon="streamline-ultimate:barcode"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Allow barcode generation and scanning*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="barcode_generation_and_scanning"
              value={formInputs?.barcode_generation_and_scanning ?? false}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="streamline-ultimate:warehouse-storage-2"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Allow godown management*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="godown_management_allowed"
              value={formInputs?.godown_management_allowed ?? false}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center text-nowrap">
              <Icon
                icon="streamline-ultimate:warehouse-storage-2"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Allow Partial Shipment Receiving*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="allow_partial_shipment_received"
              value={formInputs?.allow_partial_shipment_received ?? false}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center text-nowrap">
              <Icon
                icon={"material-symbols:domain-verification-outline"}
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Remaining Amount In Next Invoice*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              value={formInputs?.remaining_amount_in_next_invoice ?? false}
              onChange={handleFormInputsChange}
              name="remaining_amount_in_next_invoice"
              className="text-field-border"
              SelectProps={{
                native: true,
              }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:info-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Allow Action Info View*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="show_action_info"
              value={formInputs?.show_action_info ?? false}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon="codicon:type-hierarchy"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Pos Version*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="pos_version"
              value={formInputs?.pos_version}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={"pos_one"}>Pos Version 1</option>
              <option value={"pos_two"}>Pos Version 2</option>
            </TextField>
          </div>

          <div className="mt-4 mb-3">
            <label className="form-label-new mb-2 label-text d-flex align-items-center">
              <Icon
                icon={"material-symbols:domain-verification-outline"}
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Terms Description For Invoice
            </label>

            <div className="col-12">
              <Editor
                value={formInputs?.business_terms_description_for_invoice}
                onChange={(value) =>
                  handleFormInputsChange({
                    target: {
                      name: "business_terms_description_for_invoice",
                      value,
                    },
                  })
                }
                name="business_terms_description_for_invoice"
                placeholder="Enter Terms Description For Invoice"
              />
            </div>
          </div>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
        </div>
      </LocalizationProvider>

      <TemplatePreviewModal
        open={previewModal.open}
        onClose={handleClosePreview}
        image={previewModal.image}
        title={previewModal.title}
      />
    </Card>
  );
};

export default BusinessSettingsTab;
