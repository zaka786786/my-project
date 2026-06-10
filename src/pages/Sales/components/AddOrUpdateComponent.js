import { TextField, MenuItem } from "@mui/material";
const AddOrUpdateComponent = ({ formInputs, handleChange }) => {
  return (
    <div className="popover-mid-container">
      <div className="spacing">
        <div className="row-spacing">
          <TextField
            fullWidth
            label="Business Customer"
            select
            value={formInputs.customerName}
            onChange={handleChange}
            name="customerName"
            className="text-field-border"
            required
          >
            <MenuItem value="Ali Traders">Ali Traders</MenuItem>
            <MenuItem value="Al Madina Mart">Al Madina Mart</MenuItem>
            <MenuItem value="BuildPro Supplies">BuildPro Supplies</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Payment Method"
            select
            value={formInputs.paymentMethod}
            onChange={handleChange}
            name="paymentMethod"
            className="text-field-border"
            required
          >
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
          </TextField>
        </div>
        <div className="row-spacing">
          <TextField
            fullWidth
            label="Items"
            value={formInputs.itemCount}
            onChange={handleChange}
            name="itemCount"
            className="text-field-border"
            required
            type="number"
            inputProps={{ min: 0 }}
          />

          <TextField
            fullWidth
            label="Total Qty"
            value={formInputs.totalQty}
            onChange={handleChange}
            name="totalQty"
            className="text-field-border"
            required
            type="number"
            inputProps={{ min: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrUpdateComponent;
