import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import ImageUploadField from "../../../components/ImageUploadField";
import CustomAutocomplete from "../../../components/CustomeAutoComplete/CustomAutoComplete";
import { uploadImage } from "../../../utils/constant";
import { _get_customer_business_plan } from "../../../DAL/CustomerPlans/CustomerBusinessPlan";
import { _get_business_customer_for_admin } from "../../../DAL/BusinessCustomers/business_customers";

const DefaultFormState = {
  customer: null,
  payment_type: "upfront",
  amount: "",
  payment_note: "",
  payment_receipt: null,
};
const AddPaymentModal = ({
  open,
  onClose,
  onSubmit,
  loading,
  setLoading,
  showCustomerSelect = false,
  customerDetails,
}) => {
  const [formData, setFormData] = useState(DefaultFormState);

  const paymentTypes = [
    { value: "upfront", label: "Upfront Amount" },
    { value: "recurring", label: "Recurring Amount" },
  ];

  // Filter payment types based on customer's payment history
  const availablePaymentTypes = useMemo(() => {
    const hasUpfrontPayment =
      formData?.customer?.added_upfront_payment === true ||
      formData?.customer?.added_upfront_payment === "true";

    if (hasUpfrontPayment) {
      return paymentTypes.filter((type) => type.value !== "upfront");
    }
    return paymentTypes;
  }, [formData?.customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start loading before file upload
    if (setLoading) setLoading(true);

    let receiptUrl = null;
    if (formData.payment_receipt) {
      receiptUrl = await uploadImage(formData.payment_receipt);
    }
    const data = {
      business: {
        user_id: formData?.customer?.user_id?._id,
        first_name:
          formData?.customer?.first_name || customerDetails?.first_name,
        last_name: formData?.customer?.last_name || customerDetails?.last_name,
        email:
          formData?.customer?.email ||
          formData?.customer?.user_id?.email ||
          customerDetails?.email ||
          null,
        phone_number:
          formData?.customer?.phone_number ||
          customerDetails?.phone_number ||
          null,
        image:
          formData?.customer?.profile_image ||
          customerDetails?.profile_image ||
          null,
      },
      payment_for: formData?.payment_type,
      note: formData?.payment_note,
      invoice_url: receiptUrl,
      total_paid_amount:
        formData?.payment_type === "upfront"
          ? formData?.customer?.plan_settings?.plan?.upfront_price || 0
          : formData?.customer?.plan_settings?.plan?.price || 0,
    };
    onSubmit(data);
    setFormData(DefaultFormState);
    onClose();
  };

  const handleClose = () => {
    setFormData(DefaultFormState);
    onClose();
  };

  const handleCustomerChange = (selectedCustomer) => {
    console.log("Selected Customer", selectedCustomer);
    setFormData((prev) => ({
      ...prev,
      customer: selectedCustomer,
    }));
  };
  useEffect(() => {
    const hasUpfrontPayment =
      formData?.customer?.added_upfront_payment === true ||
      formData?.customer?.added_upfront_payment === "true";
    if (hasUpfrontPayment && formData.payment_type === "upfront") {
      setFormData((prev) => ({ ...prev, payment_type: "recurring" }));
    }
  }, [formData?.customer?.added_upfront_payment, formData.payment_type]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, customer: customerDetails }));
  }, [customerDetails]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <h5 className="mb-0 fw-bold">Add Payment</h5>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <div className="row g-3 mt-1">
            {/* Customer Select */}
            {showCustomerSelect && (
              <div className="col-6">
                <CustomAutocomplete
                  label="Customer"
                  value={formData.customer}
                  onChange={handleCustomerChange}
                  getOptionLabel={(customer) => customer?.label || ""}
                  placeholder="Search for customer..."
                  required={true}
                  type="business"
                  disabled={loading}
                  size="small"
                />
              </div>
            )}
            {/* Payment Type Dropdown */}
            <div className="col-12 col-md-6">
              <FormControl size="small" fullWidth required>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={formData.payment_type}
                  onChange={handleInputChange}
                  label="Payment Type"
                  name="payment_type"
                >
                  {availablePaymentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/*Payment Amount*/}
            <div className="col-12 col-md-6">
              <TextField
                label="Amount"
                value={Number(
                  formData?.payment_type === "upfront"
                    ? formData?.customer?.plan_settings?.plan?.upfront_price ||
                        0
                    : formData?.customer?.plan_settings?.plan?.price || 0
                ).toFixed(2)}
                size="small"
                fullWidth
                variant="outlined"
                disabled
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Rs</InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Payment Note */}
            <div className="col-12">
              <TextField
                label="Payment Note"
                value={formData.payment_note}
                onChange={handleInputChange}
                fullWidth
                size="small"
                variant="outlined"
                multiline
                name="payment_note"
                rows={3}
                placeholder="Enter any notes about this payment (optional)"
              />
            </div>

            {/* Payment Receipt - PDF or Image */}
            <div className="col-12">
              <ImageUploadField
                label="Payment Receipt"
                name="payment_receipt"
                accept="image/*, .pdf"
                formInputs={formData}
                handleFormInputsChange={handleInputChange}
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 120 }}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPaymentModal;
