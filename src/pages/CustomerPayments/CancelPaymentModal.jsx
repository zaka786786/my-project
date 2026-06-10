import { useState } from "react";
import { useSnackbar } from "notistack";
import CustomPopover from "../../components/CustomPopover";
import { TextField } from "@mui/material";

const CancelPaymentModal = ({ open, onClose, onSubmit }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({ note });
      setNote("");
      onClose();
    } catch (error) {
      enqueueSnackbar("Failed to cancel payment", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNote("");
    onClose();
  };

  return (
    <CustomPopover
      isOpenPop={open}
      isClosePop={handleCancel}
      title="Cancel Payment"
      submitButtonText="Submit"
      showStatus={false}
      handleSubmit={handleSubmit}
      submitButtonLoader={loading}
      componentToPassDown={
        <div className="popover-mid-container">
          <div className="spacing">
            <div className="row-spacing">
              <TextField
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter reason for cancellation"
                required
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default CancelPaymentModal;
