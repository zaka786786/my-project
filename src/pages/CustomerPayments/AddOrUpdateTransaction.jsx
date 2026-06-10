import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { _business_customers_list } from "../../DAL/BusinessCustomers/business_customers";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import {
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { AttachFile as AttachFileIcon } from "@mui/icons-material";
import CustomAutocomplete from "../../components/CustomeAutoComplete/CustomAutoComplete";
import { useAdminContext } from "../../Hooks/AdminContext";
import { _get_common_business_categories } from "../../DAL/BusinessCategories/business_categories";
import {
  _add_payment,
  _update_payment,
  _get_payment,
} from "../../DAL/Payments/Payments";
import { uploadImage } from "../../utils/constant";
import { imageBaseUrl } from "../../config/config";

const initialFormData = {
  business: null,
  status: "pending",
  plan: {
    _id: "",
    name: "",
  },
  upfront_price: 0,
  total_paid_amount: 0,
  payment_reference: "",
  payment_method: "cash",
  attachment: null,
  note: "",
};

const AddOrUpdateTransaction = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);
  const [formInputs, setFormInputs] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const { id } = useParams();
  const location = useLocation();
  const rowData = location.state || {};
  const navigate = useNavigate();

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
  ];

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    if (name === "status") {
      setFormInputs((prev) => ({
        ...prev,
        status: value,
      }));
    } else if (name === "total_paid_amount" || name === "upfront_price") {
      setFormInputs((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormInputs((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar("File size should be less than 5MB", {
          variant: "error",
        });
        return;
      }

      setFormInputs((prev) => ({
        ...prev,
        attachment: file,
      }));
    }
  };

  const handleCustomerChange = (selectedCustomer) => {
    if (selectedCustomer) {
      setFormInputs((prev) => ({
        ...prev,
        business: selectedCustomer,
      }));
    } else {
      setFormInputs((prev) => ({
        ...prev,
        business: initialFormData.business,
        plan: initialFormData.plan,
        upfront_price: 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitButtonLoader(true);

    try {
      // Basic validation
      if (!formInputs?.business?.user_id) {
        enqueueSnackbar("Please select a customer", { variant: "error" });
        setSubmitButtonLoader(false);
        return;
      }

      // Check if it's a free plan
      const isFreePlan =
        formInputs?.business?.plan_settings?.plan?.is_plan_free;

      // if (
      //   !isFreePlan &&
      //   (!formInputs.total_paid_amount || formInputs.total_paid_amount <= 0)
      // ) {
      //   enqueueSnackbar("Please enter a valid amount", { variant: "error" });
      //   setSubmitButtonLoader(false);
      //   return;
      // }

      // For free plans, set amount to 0 if not provided
      if (
        isFreePlan &&
        (!formInputs.total_paid_amount || formInputs.total_paid_amount <= 0)
      ) {
        formInputs.total_paid_amount = 0;
      }

      // For upfront payments, amount cannot exceed upfront price
      if (
        formInputs.total_paid_amount >
        formInputs.business?.plan_settings?.plan?.upfront_price
      ) {
        enqueueSnackbar(
          `Payment amount cannot exceed upfront price (Rs ${formInputs.business?.plan_settings?.plan?.upfront_price})`,
          { variant: "error" },
        );
        setSubmitButtonLoader(false);
        return;
      }

      if (!formInputs.business?.plan_settings?.plan?._id) {
        enqueueSnackbar("Please select a plan", { variant: "error" });
        setSubmitButtonLoader(false);
        return;
      }

      let imageUrl;
      if (formInputs.attachment instanceof File) {
        imageUrl = await uploadImage(formInputs.attachment);
      } else {
        imageUrl = formInputs.attachment;
      }

      // Prepare payload according to API requirements
      const payload = {
        business: {
          user_id: formInputs.business?.user_id?._id,
          first_name: formInputs.business.first_name,
          last_name: formInputs.business.last_name,
          email: formInputs.business?.user_id?.email,
          phone_number: formInputs.business?.phone_number,
          image: formInputs.business?.image,
        },
        status: formInputs.status,
        plan: {
          _id: formInputs.business?.plan_settings?.plan?._id,
          name: formInputs.business?.plan_settings?.plan?.name,
          plan_type: formInputs.business?.plan_settings?.plan?.plan_type,
        },
        total_paid_amount:
          formInputs.business?.plan_settings?.plan?.upfront_price,
        transaction_id: formInputs.payment_reference,
        payment_method: formInputs.payment_method,
        note: formInputs.note,
        invoice_url: imageUrl,
      };

      const update_payload = {
        transaction_id: formInputs.payment_reference,
        payment_method: formInputs.payment_method,
        note: formInputs.note,
        invoice_url: imageUrl,
        status: formInputs.status,
      };

      let response;
      if (id) {
        // Update existing payment
        response = await _update_payment(id, update_payload);
      } else {
        // Add new payment
        response = await _add_payment(payload);
      }

      if (response.code === 200) {
        enqueueSnackbar(
          id ? "Payment updated successfully!" : "Payment added successfully!",
          { variant: "success" },
        );
        navigate(-1); // Go back to previous page
      } else {
        enqueueSnackbar(response.message || "Failed to save payment", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      enqueueSnackbar("An error occurred while saving payment", {
        variant: "error",
      });
    } finally {
      setSubmitButtonLoader(false);
    }
  };

  const initializeData = async (paymentId) => {
    setLoading(true);
    const response = await _get_payment(paymentId);
    if (response.code === 200) {
      const payment = response.payments;

      setFormInputs({
        business: {
          ...payment.business,
          value: payment.business._id,
          label: payment.business.first_name + " " + payment.business.last_name,
        },
        status: payment.status,
        plan: {
          _id: payment.business?.plan_settings?.plan?._id,
          name: payment.business?.plan_settings?.plan?.name,
          plan_type: payment.plan_settings?.plan?.plan_type,
        },
        upfront_price: payment.plan_settings?.plan?.upfront_price || 0,
        total_paid_amount: payment.total_paid_amount || 0,
        payment_reference: payment.transaction_id || "",
        payment_method: payment.payment_method || "",
        attachment: payment.invoice_url || null,
        note: payment.note || "",
      });
    } else {
      enqueueSnackbar(response.message || "Failed to fetch payment", {
        variant: "error",
      });
      setFormInputs(initialFormData);
    }
    setLoading(false);
  };

  const isDisabled =
    rowData?.status === "paid" || rowData?.state === "Paid" || id;

  useEffect(() => {
    setNavBarTitle(id ? "Edit Payment" : "Add Payment");
    setIsBackButton(true);
    if (id) {
      initializeData(id);
    }
  }, []);

  // Breadcrumb items
  const breadcrumbItems = [
    {
      title: "Paid Payments",
      navigation: "/payments",
      active: false,
    },
    {
      title: rowData?._id ? "Edit Payment" : "Add Payment",
      navigation: "",
      active: true,
    },
  ];

  if (loading) {
    return (
      <div className="container-fluid new-memories mt-3">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid new-memories mt-3">
      <div className="row mt-3">
        <div className="col-12 my-3">
          <ActiveLastBreadcrumb breadCrumbMenu={breadcrumbItems} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="spacing mt-3">
          {/* Business Customer and Plan */}
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <CustomAutocomplete
                label="Business Customer"
                value={formInputs.business}
                onChange={handleCustomerChange}
                options={null}
                getOptionLabel={(customer) => customer.label}
                placeholder="Select Business customer"
                required={true}
                type="business"
                disabled={isDisabled}
              />
            </div>
            {formInputs?.business?.user_id && (
              <div className="col-12 col-md-6 mb-3">
                <TextField
                  fullWidth
                  label="Upfront Price"
                  type="number"
                  value={
                    formInputs?.business?.plan_settings?.plan?.upfront_price
                  }
                  onChange={handleChange}
                  name="upfront_price"
                  className="text-field-border"
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  placeholder="Upfront price will appear when customer is selected"
                />
              </div>
            )}

            {/* Payment Details Section */}
            <div className="col-12 mb-3">
              <h6 className="text-muted mb-3">Payment Details</h6>
            </div>

            {/* Reference Field */}
            <div className="col-12 col-md-6 mb-3">
              <TextField
                fullWidth
                label="Reference"
                value={formInputs.payment_reference}
                onChange={handleChange}
                name="payment_reference"
                className="text-field-border"
                placeholder="Enter payment reference number"
              />
            </div>

            {/* Payment Method */}
            <div className="col-12 col-md-6 mb-3">
              <FormControl fullWidth className="text-field-border" required>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formInputs.payment_method}
                  onChange={handleChange}
                  required
                  name="payment_method"
                  label="Payment Method"
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method.value} value={method.value}>
                      {method.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Attachment Field */}
            <div className="col-12 mb-3">
              <label className="form-label text-muted mb-2">
                Attachment (Optional)
              </label>
              <div
                className="border border-2 border-dashed rounded p-4 text-center"
                style={{
                  cursor: "pointer",
                  borderColor: "#dee2e6",
                  transition: "all 0.3s ease",
                }}
                onClick={() =>
                  document.getElementById("attachment-input").click()
                }
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#0d6efd";
                  e.target.style.backgroundColor = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#dee2e6";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <input
                  id="attachment-input"
                  type="file"
                  hidden
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />

                {formInputs.attachment ? (
                  <div>
                    <img
                      alt="Attachment preview"
                      src={
                        typeof formInputs.attachment === "string"
                          ? imageBaseUrl + formInputs.attachment
                          : URL.createObjectURL(formInputs.attachment)
                      }
                      className="img-fluid rounded mb-2"
                      style={{
                        maxHeight: "150px",
                        maxWidth: "200px",
                      }}
                    />
                    <p className="mb-1 text-muted">
                      {formInputs.attachment.name}
                    </p>
                    <small className="text-muted">
                      Click to change attachment
                    </small>
                  </div>
                ) : (
                  <div>
                    <AttachFileIcon
                      sx={{ fontSize: 40, color: "#6c757d", mb: 1 }}
                    />
                    <p className="mb-1 text-muted">
                      Click to upload attachment (Max 5MB)
                    </p>
                    <small className="text-muted">
                      Supported formats: Images, PDF, DOC, DOCX
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 text-end">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitButtonLoader}
            className="mt-3"
            startIcon={
              submitButtonLoader ? <CircularProgress size={20} /> : null
            }
          >
            {id ? "Update Payment" : "Add Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOrUpdateTransaction;
