import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Avatar, Chip } from "@mui/material";
import { useSnackbar } from "notistack";
import CustomTable from "../../components/customTable/CustomTable";
import { _list_lead_history } from "../../DAL/Leads/leads";
import { useAdminContext } from "../../Hooks/AdminContext";
import CircularLoader from "../../components/loaders/CircularLoader";
import { show_proper_words } from "../../utils/constant_new";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import { imageBaseUrl } from "../../config/config";

const getEventConfig = (event) => {
  switch (event) {
    case "created":
      return { label: "Created", color: "success" };

    case "updated":
      return { label: "Updated", color: "primary" };

    case "note_added":
      return { label: "Note Added", color: "info" };

    case "note_updated":
      return { label: "Note Updated", color: "warning" };

    case "note_deleted":
      return { label: "Note Deleted", color: "error" };

    default:
      return {
        label: show_proper_words(event) || "Unknown",
        color: "default",
      };
  }
};

const LeadHistory = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [lead, setLead] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchLeadHistory = useCallback(async () => {
    try {
      setIsLoading(true);

      const payload = { lead_id: id };

      const response = await _list_lead_history(page, rowsPerPage, payload);

      if (response?.code === 200) {
        setList(response?.history_list || []);
        setLead(response?.lead || null);
        setTotalCount(response?.total_count || 0);
      } else {
        enqueueSnackbar(response?.message || "Failed to load history", {
          variant: "error",
        });
        setList([]);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [id, page, rowsPerPage]);

  useEffect(() => {
    setNavBarTitle("Lead History");
    setIsBackButton(true);
    if (id) fetchLeadHistory();
  }, [id, fetchLeadHistory]);

  const TABLE_HEAD = [
    { id: "number", label: "#", type: "number" },
    {
      id: "message",
      label: "Message",
      renderData: (row) => (
        <div style={{ minWidth: "250px" }}>
          <p style={{ margin: 0, fontSize: 13 }}>{row?.message || "-"}</p>
        </div>
      ),
    },
    {
      id: "event",
      label: "Event",
      renderData: (row) => {
        const config = getEventConfig(row?.event);

        return <Chip size="small" label={config.label} color={config.color} />;
      },
    },
    {
      id: "date",
      label: "Date",
      renderData: (row) =>
        row?.date ? moment(row?.date).format("DD MMM YYYY, hh:mm A") : "-",
    },
    {
      id: "user",
      label: "Action By",
      renderData: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            src={imageBaseUrl + row?.action_info?.profile_image}
            alt={row?.action_info?.first_name}
            sx={{ width: 32, height: 32 }}
          />

          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {row?.action_info?.first_name} {row?.action_info?.last_name}
            </div>
            <div style={{ fontSize: 11, color: "#777" }}>
              {row?.action_info?.email || "-"}
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (isLoading) return <CircularLoader />;

  const breadCrumbMenu = [
    {
      title: "Leads",
      navigation: "/leads",
    },
    {
      title: lead
        ? `Lead History (${lead?.name || "-"}${lead?.phone_number ? ` - ${lead.phone_number}` : ""})`
        : "Lead History",
      active: true,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="mt-2 mb-3">
        <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
      </div>
      <div className="popover-mid-container">
        <CustomTable
          data={list}
          TABLE_HEAD={TABLE_HEAD}
          MENU_OPTIONS={[]}
          pagePagination={true}
          custom_pagination={{
            total_count: totalCount,
            rows_per_page: rowsPerPage,
            page: page,
            handleChangePage: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
          is_hide={true}
        />
      </div>
    </div>
  );
};

export default LeadHistory;
