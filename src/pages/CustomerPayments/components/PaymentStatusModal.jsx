import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { ToLocalString } from "../../../utils/constant";

const PaymentStatusModal = ({
  open,
  onClose,
  onSubmit,
  paymentData,
  loading,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    ref: "",
    payment_method: "",
    attachment: null,
    note: "",
  });

  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setAttachmentPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation

    if (!formData.payment_method) {
      enqueueSnackbar("Payment method is required", { variant: "error" });
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      ref: "",
      payment_method: "",
      attachment: null,
      note: "",
    });
    setAttachmentPreview(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        overflowY: "hidden",
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
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
          <h5 className="mb-0 fw-bold">Mark Payment as Paid</h5>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <div
            style={{
              paddingRight: "10px",
              height: "60vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {paymentData && (
              <div className="mb-3 p-3 bg-light rounded">
                <h6 className="text-muted mb-2">Payment Details</h6>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <p className="mb-1">
                      <strong>Amount:</strong> Rs{" "}
                      {ToLocalString(paymentData.total_paid_amount)}
                    </p>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="mb-1 text-capitalize">
                      <strong>Business:</strong>{" "}
                      {paymentData.business?.first_name}{" "}
                      {paymentData.business?.last_name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="row g-3">
              {/* Reference Field */}
              <div className="col-12 col-md-6">
                <TextField
                  label="Reference"
                  value={formData.ref}
                  onChange={(e) => handleInputChange("ref", e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter payment reference number"
                />
              </div>

              {/* Payment Method */}
              <div className="col-12 col-md-6">
                <FormControl fullWidth required>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.payment_method}
                    onChange={(e) =>
                      handleInputChange("payment_method", e.target.value)
                    }
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
              <div className="col-12">
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

                  {attachmentPreview ? (
                    <div>
                      <img
                        src={attachmentPreview}
                        alt="Attachment preview"
                        className="img-fluid rounded mb-2"
                        style={{
                          maxHeight: "150px",
                          maxWidth: "200px",
                        }}
                      />
                      <p className="mb-1 text-muted">
                        {formData.attachment.name}
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

              {/* Note Field */}
              <div className="col-12">
                <TextField
                  label="Note"
                  value={formData.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Enter any additional notes about this payment"
                />
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
            type="submit"
            startIcon={loading ? <CircularProgress /> : null}
          >
            {loading ? "Processing..." : "Mark as Paid"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentStatusModal;
