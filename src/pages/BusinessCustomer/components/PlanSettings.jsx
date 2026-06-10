import { Card, TextField, MenuItem, InputAdornment } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const PlanSettings = ({ formInputs, setFormInputs }) => {
  const handleFormInputsChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Card className="p-4 shadow-md border-0 rounded-4 mb-4 business-customer-tabs-card">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <label className="form-label mb-2 label-text d-flex align-items-center">
              <Icon
                icon="material-symbols:badge-outline"
                className="me-1 tabs-icon-color label-icon-setting"
              />
              Customer Access For
            </label>
            <TextField
              select
              fullWidth
              size="small"
              name="customer_access_for"
              value={formInputs?.customer_access_for ?? false}
              onChange={handleFormInputsChange}
              variant="outlined"
              required
            >
              {/* 
                Show Trial option if:
                - business_plan doesn't exist (new customer) OR
                - business_plan exists AND is_plan_free is true
              */}
              {(!formInputs?.business_plan ||
                formInputs?.business_plan?.is_plan_free === true) && (
                <MenuItem value={true}>Trial</MenuItem>
              )}
              <MenuItem value={false}>Paid</MenuItem>
            </TextField>
          </div>
          <>
            {formInputs?.customer_access_for ? (
              <div className="col-12 col-md-4">
                <label className="form-label mb-2 label-text d-flex align-items-center">
                  <Icon
                    icon="material-symbols:event-outline"
                    className="me-1 tabs-icon-color label-icon-setting"
                  />
                  Expiration Date
                </label>
                <DatePicker
                  value={formInputs?.expiration_date}
                  onChange={(newValue) => {
                    setFormInputs((prev) => ({
                      ...prev,
                      expiration_date: newValue,
                    }));
                  }}
                  format="DD-MM-YYYY"
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </div>
            ) : (
              <>
                <div className="col-12 col-md-4">
                  <label className="form-label mb-2 label-text d-flex align-items-center">
                    <Icon
                      icon="material-symbols:payments-outline"
                      className="me-1 tabs-icon-color label-icon-setting"
                    />
                    Upfront Amount
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="upfront_amount"
                    value={formInputs?.upfront_amount || ""}
                    onChange={handleFormInputsChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs</InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label mb-2 label-text d-flex align-items-center">
                    <Icon
                      icon="material-symbols:autorenew"
                      className="me-1 tabs-icon-color label-icon-setting"
                    />
                    Recurring Type
                  </label>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    name="recurring_type"
                    value={formInputs?.recurring_type || ""}
                    onChange={handleFormInputsChange}
                    variant="outlined"
                    required
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </TextField>
                </div>

                {/* Upfront Amount */}
                <div className="col-12 col-md-4">
                  <label className="form-label mb-2 label-text d-flex align-items-center">
                    <Icon
                      icon="material-symbols:account-balance-wallet-outline"
                      className="me-1 tabs-icon-color label-icon-setting"
                    />
                    Recurring Amount
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="recurring_amount"
                    value={formInputs?.recurring_amount || ""}
                    onChange={handleFormInputsChange}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">Rs</InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Gross Period Days */}
                <div className="col-12 col-md-4">
                  <label className="form-label mb-2 label-text d-flex align-items-center">
                    <Icon
                      icon="material-symbols:calendar-month-outline"
                      className="me-1 tabs-icon-color label-icon-setting"
                    />
                    Grace Period Days
                  </label>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    name="grace_period_days"
                    value={formInputs?.grace_period_days || ""}
                    onChange={handleFormInputsChange}
                    variant="outlined"
                    required
                  />
                </div>
              </>
            )}
          </>
        </div>
      </LocalizationProvider>
    </Card>
  );
};

export default PlanSettings;
