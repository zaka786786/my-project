import { useState } from "react";
import { Typography, Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import CustomTable from "../../components/customTable/CustomTable";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate, permission_string } from "../../utils/constant";

const Sessions = ({
  sessions,
  setSessions,
  totalPages,
  pageCount,
  totalCount,
  rowsPerPage,
  page,
  handleChangePages,
  handleChangeRowsPerPage,
  handleChangePage,
  show,
}) => {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Format login sessions data for the table
  const formattedSessions = sessions?.map((session, index) => ({
    ...session,
    id: index,
    device: `${session.login_info?.os || "N/A"} - ${
      session.login_info?.browser || "N/A"
    }`,
    ip: session?.login_info?.ip || "N/A",
    country: session.login_info?.country || "N/A",
    is_current_session: session.is_current_session || false,
  }));

  const handleLogoutSession = (session) => {
    if (show) {
      enqueueSnackbar(permission_string, {
        variant: "error",
      });
      return;
    }

    if (session.is_current_session) {
      enqueueSnackbar("Cannot logout from current session", {
        variant: "error",
      });
      return;
    }
    setSelectedSession(session);
    setOpenLogoutDialog(true);
  };

  const SESSIONS_TABLE_HEAD = [
    {
      id: "number",
      label: "#",
      type: "number",
      className: "typography-color-in-table",
    },
    {
      id: "device",
      label: "Device (OS + Browser)",
      className: "typography-color-in-table",
      renderData: (row) => (
        <Typography variant="body2" className="typography-color-in-table">
          {row.device}
          <div>
            <span
              className={`badge rounded-pill px-2 py-1 fs-10 text-white ${
                row?.is_login ? "bg-success" : "bg-danger"
              }`}
            >
              {row?.is_login ? "Active" : "Inactive"}
            </span>
          </div>
        </Typography>
      ),
    },
    { id: "ip", label: "IP", className: "typography-color-in-table" },
    { id: "country", label: "Country", className: "typography-color-in-table" },
    {
      id: "actions",
      label: "Actions",
      className: "typography-color-in-table",
      renderData: (row) => (
        <Button
          type="button"
          variant="outlined"
          size="small"
          color="error"
          className="btn btn-outline-primary btn-sm on-hover-bg-danger on-hover-text-white border-danger-subtle"
          onClick={() => handleLogoutSession(row)}
          disabled={row.is_current_session || !row.is_login}
        >
          Sign Out
        </Button>
      ),
    },
    {
      id: "createdAt",
      label: "Created At",
      className: "typography-color-in-table",
      renderData: (row) => (
        <Typography variant="body2" className="typography-color-in-table">
          {formatDate(row.createdAt)}
        </Typography>
      ),
    },
  ];

  return (
    <div className="row">
      {openLogoutDialog && (
        <LogoutConfirmationModal
          show={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
          session={selectedSession}
          setSessions={setSessions}
          sessions={sessions}
        />
      )}
      <div className="col-12">
        <CustomTable
          TABLE_HEAD={SESSIONS_TABLE_HEAD || []}
          data={formattedSessions || []}
          rows_per_page_count={50}
          is_hide={true}
          custom_pagination={{
            total_count: totalCount,
            rows_per_page: rowsPerPage,
            page: page,
            handleChangePage: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
          pageCount={pageCount}
          totalPages={totalPages}
          handleChangePages={handleChangePages}
          pagePagination={true}
        />
      </div>
    </div>
  );
};

export default Sessions;
