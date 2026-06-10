import { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import moment from "moment";
import { useAdminContext } from "../../Hooks/AdminContext";
import {
  Button,
  Chip,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import Iconify from "../../components/Iconify";
import { useSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import LeadStats from "./components/LeadStats";
import { _delete_lead_by_id, _list_leads } from "../../DAL/Leads/leads";
import { LEADS_PRIVILEGE, show_proper_words } from "../../utils/constant_new";
import TooltipShowing from "../../components/TooltipShowing";
import { LEAD_SOURCES, permission_string } from "../../utils/constant";
import LeadStatusChip from "./components/LeadStatusChip";
import AssignLeadModal from "./components/AssignLeadModal";
import MUICustomButton from "../../components/MUICustomButton";
import GeneralPopUpModel from "../../components/GeneralComponent/GeneralPopUpModel/GeneralPopUpModel";
import GeneralRequestForCsv from "../../components/GeneralComponent/GeneralPopUpModel/GeneralRequestForCsv";
import CustomImageAvatar from "../../components/CustomImageAvatar";
import { imageBaseUrl } from "../../config/config";
import CustomAutocomplete from "../../components/CustomeAutoComplete/CustomAutoComplete";
import { CSVLink } from "react-csv";

const options_array = [
  {
    label: "Name",
    value: "name",
    is_disabled: true,
    is_checked: true,
  },
  {
    label: "Phone Number",
    value: "phone_number",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Email",
    value: "email",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Lead Status",
    value: "lead_status",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Assigned To",
    value: "assigned_to",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Follow Up Date",
    value: "follow_up_date",
    is_disabled: false,
    is_checked: false,
  },

  {
    label: "Category",
    value: "category",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Meeting Schedule",
    value: "meeting_schedule",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Meeting Schedule Date",
    value: "meeting_schedule_date",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Expected Budget",
    value: "expected_budget",
    is_disabled: false,
    is_checked: false,
  },

  {
    label: "Lead Source",
    value: "lead_source",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Platform Campaign",
    value: "platform_campaign",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Interested Product",
    value: "interested_product",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Province",
    value: "province",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "City",
    value: "city",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Address",
    value: "address",
    is_disabled: false,
    is_checked: false,
  },
  {
    label: "Referral Info",
    value: "referral_info",
    is_disabled: false,
    is_checked: false,
  },
  // {
  //   label: "Latest Note",
  //   value: "latest_note",
  //   is_disabled: false,
  //   is_checked: false,
  // },
  {
    label: "Created At",
    value: "created_at",
    is_disabled: false,
    is_checked: false,
  },
];

const EMPTY_FILTER = {
  lead_source: "all",
  lead_status_id: null,
  assign_to_id: null,
};
const LeadsList = ({ screen_path = "" }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [openGeneralPopUp, setOpenGeneralPopUp] = useState(false);
  const [queryData, setQueryData] = useState({});
  const [filters, setFilters] = useState(EMPTY_FILTER);
  const [tableLoading, setTableLoading] = useState(true);

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setPageCount(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const fetchList = async () => {
    setTableLoading(true);
    let postData = {
      search: searchText,
      lead_source: filters?.lead_source == "all" ? "" : filters?.lead_source,
      lead_status_id: filters?.lead_status_id?._id || "",
      assign_to_id: filters?.assign_to_id?.user_id?._id || "",
    };

    const response = await _list_leads(page, rowsPerPage, postData);

    if (response?.code === 200) {
      setList(response?.lead_list || []);
      setStats(response?.stats || []);
      setQueryData(response?.query || {});
      setTotalCount(response?.total_count || 0);
    } else {
      enqueueSnackbar(response?.message || "Failed to fetch data", {
        variant: "error",
      });
      setList([]);
      setQueryData({});
    }

    setTableLoading(false);
    setIsLoading(false);
  };

  const handleAgreeDelete = (row) => {
    setDeleteData(row);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    const response = await _delete_lead_by_id(deleteData?._id);
    if (response?.code === 200) {
      enqueueSnackbar(response?.message || "Lead deleted successfully", {
        variant: "success",
      });
      const updated = list.filter((item) => item._id !== deleteData._id);

      setList(updated);
      setTotalCount((prev) => prev - 1);
    } else {
      enqueueSnackbar(response?.message || "Failed to delete Admin user", {
        variant: "error",
      });
    }
    setOpenDelete(false);
    setDeleteData(null);
    setDelLoading(false);
  };

  useEffect(() => {
    setNavBarTitle("Leads");
    setIsBackButton(false);
    fetchList();
  }, [page, rowsPerPage, filters]);

  const CSV_TABLE_HEAD = [
    { label: "Lead Name", key: "name" },
    { label: "Phone Number", key: "phone_number" },
    { label: "Email", key: "email" },
    { label: "City", key: "city_csv" },
    { label: "Province", key: "province_csv" },
    { label: "Address", key: "address" },
    { label: "Status", key: "lead_status_csv" },
    { label: "Assigned To", key: "assigned_to_csv" },
    { label: "Lead Source", key: "lead_source_csv" },
    { label: "Campaign", key: "platform_campaign" },
    { label: "Business", key: "category" },
    { label: "Product", key: "interested_product" },
    { label: "Referral Name", key: "ref_name_csv" },
    { label: "Referral Phone", key: "ref_phone_csv" },
    { label: "Referral Relation", key: "ref_relation_csv" },
    { label: "Budget", key: "expected_budget_csv" },
    { label: "Created At", key: "created_at_csv" },
  ];

  const csvData =
    list?.map((row) => ({
      ...row,
      lead_source_csv: row?.lead_source || "-",
      lead_status_csv: row?.lead_status?.title || "-",
      assigned_to_csv: row?.assigned_to?.first_name || "-",
      city_csv: row?.city_info?.name || "-",
      province_csv: row?.province_info?.name || "-",
      address: row?.address || "-",
      ref_name_csv: row?.referral_info?.name || "-",
      ref_phone_csv: row?.referral_info?.phone_number || "-",
      ref_relation_csv: row?.referral_info?.relation || "-",
      category: row?.category?.title || "-",
      expected_budget_csv: row?.expected_budget
        ? `PKR ${Number(row.expected_budget).toLocaleString()}`
        : "-",
      created_at_csv: row?.createdAt
        ? moment(row.createdAt).format("DD MMM YYYY")
        : "-",
    })) || [];

  const TABLE_HEAD = [
    { id: "action", label: "Actions", type: "action" },
    { id: "number", label: "#", type: "number" },
    {
      id: "lead",
      label: "Lead",
      renderData: (row) => (
        <div
          className="lead-cell pointer"
          onClick={() => navigate(`/leads/detail/${row._id}`)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <p className="lead-name mb-0">{row?.name || "-"}</p>

          {(row?.phone_number || row?.email) && (
            <p className="lead-sub mb-0">{row?.phone_number || row?.email}</p>
          )}

          {(row?.city_info?.name || row?.province_info?.name) && (
            <p
              className="mb-0"
              style={{
                fontSize: "12px",
                color: "#8a8a8a",
              }}
            >
              {row?.city_info?.name || ""}
              {row?.city_info?.name && row?.province_info?.name ? ", " : ""}
              {row?.province_info?.name || ""}
            </p>
          )}

          {row?.address && (
            <p
              className="mb-0"
              style={{
                fontSize: "11px",
                color: "#a0a0a0",
                maxWidth: "240px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row?.address}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "source",
      label: "Source",
      renderData: (row) => (
        <div className="source-cell">
          <span className="source-badge">
            {row?.lead_source ? show_proper_words(row?.lead_source) : "-"}
          </span>

          {row?.referral_info?.name && (
            <div
              style={{
                marginTop: "4px",
                fontSize: "11px",
                color: "#8a8a8a",
                lineHeight: "1.4",
              }}
            >
              <div>
                {row.referral_info.name}{" "}
                {row?.referral_info?.relation
                  ? `- ${show_proper_words(row.referral_info.relation)}`
                  : ""}
              </div>

              {row?.referral_info?.phone_number && (
                <div style={{ marginTop: "2px" }}>
                  {row.referral_info.phone_number}
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      label: "Status",
      renderData: (row) => (
        <div className="status-cell">
          <LeadStatusChip
            leadId={row?._id}
            currentStatus={row?.lead_status}
            disabled={show || !LEADS_PRIVILEGE?.change_assign_to}
            onStatusChange={(newStatus) => {
              setList((prev) =>
                prev.map((item) =>
                  item._id === row._id
                    ? { ...item, lead_status: newStatus }
                    : item,
                ),
              );
            }}
          />
        </div>
      ),
    },

    {
      id: "assigned_to",
      label: "Assigned To",
      renderData: (row) => (
        <div className="assigned-cell">
          {row?.assigned_to ? (
            <div className="assigned-row">
              {row?.assigned_to?.profile_image ? (
                <CustomImageAvatar
                  imageUrl={
                    row?.assigned_to?.profile_image
                      ? imageBaseUrl + row?.assigned_to?.profile_image
                      : ""
                  }
                  size={26}
                  altText={row?.assigned_to?.first_name}
                  name={row?.assigned_to?.first_name}
                />
              ) : (
                <div className="avatar">
                  {row?.assigned_to?.first_name?.[0]}
                  {row?.assigned_to?.last_name?.[0]}
                </div>
              )}
              <span>{row?.assigned_to?.first_name}</span>
            </div>
          ) : (
            "-"
          )}
        </div>
      ),
    },
    // {
    //   id: "last_remark",
    //   label: "Last Remark",
    //   renderData: (row) => (
    //     <Tooltip title={row?.latest_note || "No Remarks"} arrow>
    //       <div className="remark-cell">{row?.latest_note || "—"}</div>
    //     </Tooltip>
    //   ),
    // },
    {
      id: "lead_info",
      label: "Lead Info",
      renderData: (row) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            minWidth: "220px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#555",
            }}
          >
            <span style={{ fontWeight: 600 }}>Campaign:</span>{" "}
            {row?.platform_campaign || "N/A"}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#555",
            }}
          >
            <span style={{ fontWeight: 600 }}>Business:</span>{" "}
            {row?.category?.title || "N/A"}
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#555",
            }}
          >
            <span style={{ fontWeight: 600 }}>Product:</span>{" "}
            {row?.interested_product || "N/A"}
          </div>

          {row?.expected_budget ? (
            <div
              style={{
                fontSize: "12px",
                color: "#555",
              }}
            >
              <span style={{ fontWeight: 600 }}>Budget:</span> PKR{" "}
              {Number(row?.expected_budget).toLocaleString()}
            </div>
          ) : null}
        </div>
      ),
    },

    {
      id: "added",
      label: "Added",
      renderData: (row) => (
        <div className="date-cell">
          {row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY") : "-"}
        </div>
      ),
    },
  ];

  const MENU_OPTIONS = [
    // {
    //   label: "Edit",
    //   icon: "akar-icons:edit",
    //   handleClick: (row) => navigate(`/leads/edit/${row._id}`),
    // },
    ...(LEADS_PRIVILEGE?.edit_lead
      ? [
          {
            label: "Edit",
            icon: "akar-icons:edit",
            handleClick: (row) => navigate(`/leads/edit/${row._id}`),
          },
        ]
      : []),
    {
      label: "Detail",
      icon: "mdi:eye-outline",
      handleClick: (row) => navigate(`/leads/detail/${row._id}`),
    },
    ...(LEADS_PRIVILEGE?.customer_remarks
      ? [
          {
            label: "Internal Notes",
            icon: "mdi:note-text-outline",
            handleClick: (row) => navigate(`/leads/notes/${row._id}`),
          },
        ]
      : []),
    // {
    //   label: "Customer Remarks",
    //   icon: "mdi:note-text-outline",
    //   handleClick: (row) => navigate(`/leads/notes/${row._id}`),
    // },
    ...(LEADS_PRIVILEGE?.Lead_history
      ? [
          {
            label: "Lead History",
            icon: "ic:baseline-history",
            handleClick: (row) => navigate(`/leads/lead_history/${row._id}`),
          },
        ]
      : []),

    // {
    //   label: "Lead History",
    //   icon: "ic:baseline-history",
    //   handleClick: (row) => navigate(`/leads/lead_history/${row._id}`),
    // },
    ...(LEADS_PRIVILEGE?.change_assign_to
      ? [
          {
            label: "Assign Lead",
            icon: "mdi:account-arrow-right-outline",
            handleClick: (row) => {
              setSelectedLead(row);
              setOpenAssign(true);
            },
          },
        ]
      : []),
    // {
    //   label: "Assign Lead",
    //   icon: "mdi:account-arrow-right-outline",
    //   handleClick: (row) => {
    //     setSelectedLead(row);
    //     setOpenAssign(true);
    //   },
    // },
    ...(LEADS_PRIVILEGE?.lead_delete
      ? [
          {
            label: "Delete",
            icon: "mdi:delete-outline",
            handleClick: handleAgreeDelete,
          },
        ]
      : []),
    // {
    //   label: "Delete",
    //   icon: "mdi:delete-outline",
    //   handleClick: handleAgreeDelete,
    // },
  ];

  if (isLoading) return <CircularLoader />;

  return (
    <>
      <AssignLeadModal
        open={openAssign}
        onClose={() => {
          setOpenAssign(false);
          setSelectedLead(null);
        }}
        row={selectedLead}
        onAssignSuccess={(user) => {
          setList((prev) =>
            prev.map((item) =>
              item._id === selectedLead._id
                ? {
                    ...item,
                    assigned_to: {
                      ...item.assigned_to,
                    },
                    ...user?.lead,
                  }
                : item,
            ),
          );
        }}
      />

      <DeleteConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        isLoading={delLoading}
        title={"Are you sure you want to delete this Lead?"}
        handleAgree={handleDelete}
      />
      {stats && stats.length > 0 && <LeadStats list={stats} />}

      <div className="d-flex flex-wrap justify-content-end align-items-center mb-0 gap-2">
        {LEADS_PRIVILEGE?.filter_buttons && (
          <>
            <TextField
              select
              size="small"
              label="Lead Source"
              value={filters.lead_source}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  lead_source: e.target.value,
                }))
              }
              sx={{ minWidth: 130 }}
              className="mb-3"
            >
              <MenuItem value="all">All</MenuItem>

              {LEAD_SOURCES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <CustomAutocomplete
              label="Lead Status"
              value={filters?.lead_status_id || null}
              onChange={(newValue) => {
                setFilters((prev) => ({
                  ...prev,
                  lead_status_id: newValue,
                }));
              }}
              options={null}
              getOptionLabel={(option) => option?.title || ""}
              type="lead_status"
              size="small"
              required={false}
              fullWidth={false}
              sx={{ minWidth: 180 }}
              className="mb-3"
            />

            <CustomAutocomplete
              label="Assign To"
              value={filters?.assign_to_id || null}
              onChange={(newValue) => {
                setFilters((prev) => ({
                  ...prev,
                  assign_to_id: newValue,
                }));
              }}
              options={null}
              getOptionLabel={(option) =>
                option?.label ||
                `${option?.first_name || ""} ${option?.last_name || ""}`
              }
              type="business_filter"
              size="small"
              required={false}
              fullWidth={false}
              sx={{ minWidth: 180 }}
              className="mb-3"
            />
          </>
        )}

        {LEADS_PRIVILEGE?.download_csv && csvData && csvData.length > 0 && (
          <CSVLink data={csvData} headers={CSV_TABLE_HEAD} filename="Leads.csv">
            <MUICustomButton
              variant="outlined"
              color="secondary"
              startIcon="mdi:download"
              className="button-in-listing text-uppercase mb-3"
            >
              Download CSV
            </MUICustomButton>
          </CSVLink>
        )}

        {LEADS_PRIVILEGE?.export_data && list && list?.length > 0 && (
          <TooltipShowing
            component={
              <>
                {list && list?.length > 0 && (
                  <MUICustomButton
                    disabled={show}
                    variant="outlined"
                    color="secondary"
                    startIcon="mdi:download"
                    onClick={() => {
                      if (show) {
                        enqueueSnackbar(permission_string, {
                          variant: "error",
                        });
                        return;
                      }
                      setOpenGeneralPopUp(true);
                    }}
                    className="button-in-listing text-uppercase mb-3"
                  >
                    Export Data
                  </MUICustomButton>
                )}
              </>
            }
            accessType={accessType}
          />
        )}

        {LEADS_PRIVILEGE?.add_lead && (
          <TooltipShowing
            accessType={accessType}
            component={
              <Button
                disabled={show}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => {
                  if (show) {
                    enqueueSnackbar(permission_string, {
                      variant: "error",
                    });
                    return;
                  }
                  navigate("/leads/add");
                }}
                className="mb-3"
              >
                Add Lead
              </Button>
            }
          />
        )}
      </div>

      {tableLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "10px",
            height: "300px",
          }}
        >
          <div
            style={{
              marginTop: "200px",
            }}
          >
            <CircularLoader />
          </div>
        </div>
      ) : (
        <CustomTable
          data={list}
          TABLE_HEAD={TABLE_HEAD}
          MENU_OPTIONS={show ? [] : MENU_OPTIONS}
          pagePagination={true}
          custom_search={{
            searchText,
            setSearchText,
            handleSubmit: fetchList,
          }}
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
          is_hide={true}
        />
      )}
      <GeneralPopUpModel
        open={openGeneralPopUp}
        setOpen={setOpenGeneralPopUp}
        title="Export Data"
        componentToPassDown={
          <GeneralRequestForCsv
            options_array={options_array}
            collection_name={"leads"}
            filter_data={queryData}
            setShowExportcsvFile={setOpenGeneralPopUp}
          />
        }
        paperClass="general-popup-model"
      />
    </>
  );
};

export default LeadsList;
