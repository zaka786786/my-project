import { Card, TextField } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const PaymentSettingsTab = ({
  formInputs,
  setFormInputs,
  handleFormInputsChange,
}) => {
  const handleDateChange = (name, value) => {
    let formattedValue = value ? value.format("MMM") : "";

    let startMonth = formattedValue;
    let endMonth = formattedValue;

    if (name === "business_year_start" && value) {
      endMonth = value.subtract(1, "month").format("MMM");
    } else {
      startMonth = value.add(1, "month").format("MMM");
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
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
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
              name="monthly_invoice_allowed"
              value={formInputs?.monthly_invoice_allowed}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
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
              name="number_of_backup_year"
              value={formInputs?.number_of_backup_year}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:group-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Staff Users Allowed*
            </label>
            <TextField
              fullWidth
              size="small"
              type="number"
              name="staff_users_allowed"
              value={formInputs?.staff_users_allowed}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
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
          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
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

          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
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
              name="no_of_branches"
              value={formInputs?.no_of_branches}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
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
              name="no_of_warehouses"
              value={formInputs?.no_of_warehouses}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
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
              name="no_of_storage_records"
              value={formInputs?.no_of_storage_records}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            />
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:barcode-scanner"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              BarCode Generation And Scanning*
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="barcode_generation_scanning"
              value={formInputs?.barcode_generation_scanning ?? false}
              onChange={handleFormInputsChange}
              SelectProps={{ native: true }}
              required
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </TextField>
          </div>
        </div>
      </LocalizationProvider>
    </Card>
  );
};

export default PaymentSettingsTab;
