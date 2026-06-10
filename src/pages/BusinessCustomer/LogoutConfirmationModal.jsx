import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { enqueueSnackbar } from "notistack";
import { _Logout_Session } from "../../DAL/BusinessConfiguration/business_settings";

const LogoutConfirmationModal = ({
  show,
  onClose,
  session,
  setSessions,
  sessions,
}) => {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const confirmLogoutSession = async () => {
    if (!session) return;

    setLogoutLoading(true);
    try {
      const response = await _Logout_Session(session._id);
      if (response.code === 200) {
        // Remove the session from the list
        const updatedSessions = sessions.filter((s) => s._id !== session._id);
        setSessions(() => {
          return [...updatedSessions];
        });
        enqueueSnackbar(response.message || "Logged out successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(response.message || "Failed to logout session", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while logging out", {
        variant: "error",
      });
    } finally {
      setLogoutLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      style={{
        zIndex: 9999999999999999999,
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Sign Out</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          zIndex: 999999999999,
        }}
      >
        <p>Are you sure you want to sign out from this session?</p>
        <div className="bg-light p-3 rounded">
          <p className="mb-1">
            <strong>Device:</strong> {session?.login_info?.os} -{" "}
            {session?.login_info?.browser}
          </p>
          <p className="mb-1">
            <strong>IP:</strong> {session?.ip}
          </p>
          <p className="mb-0">
            <strong>Country:</strong> {session?.login_info?.country || "N/A"}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={confirmLogoutSession}
          disabled={logoutLoading}
        >
          {logoutLoading ? "Confirm..." : "Confirm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutConfirmationModal;
