import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Iconify from "../../components/Iconify";
import Button from "@mui/material/Button";

const ExpiryDateModal = ({
  openExpiryModal,
  handleCloseExpiryModal,
  prevExpiryDate,
  nextExpiryDate,
  setNextExpiryDate,
  nextInvoiceDate,
  setNextInvoiceDate,
  otpLoading,
  handleSendOtpForExpiryDate,
}) => {
  return (
    <Dialog
      open={openExpiryModal}
      onClose={handleCloseExpiryModal}
      PaperProps={{
        style: {
          borderRadius: "20px",
          width: 500,
        },
      }}
    >
      <DialogTitle>
        <div className="text-center p-2 pt-3 pb-3">
          <h5 className="mb-0 fw-bold">Manage Expiry Date</h5>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="d-flex flex-column gap-3">
          <div className="d-flex flex-column">
            <label className="form-label fw-semibold">
              Previous Expiry Date
            </label>
            <TextField
              type="date"
              value={prevExpiryDate ? prevExpiryDate?.split("T")[0] : ""}
              disabled
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="d-flex flex-column">
            <label className="form-label fw-semibold">Expiry Date</label>
            <TextField
              type="date"
              value={nextExpiryDate}
              onChange={(e) => setNextExpiryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="d-flex flex-column">
            <label className="form-label fw-semibold">Next Invoice Date</label>
            <TextField
              type="date"
              value={nextInvoiceDate}
              onChange={(e) => setNextInvoiceDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="p-3 pt-1">
        <Button variant="outlined" onClick={handleCloseExpiryModal}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          loading={otpLoading}
          onClick={handleSendOtpForExpiryDate}
          disabled={otpLoading}
          startIcon={<Iconify icon={"mdi:calendar-check"} />}
        >
          Extend Expiry
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ExpiryDateModal;
