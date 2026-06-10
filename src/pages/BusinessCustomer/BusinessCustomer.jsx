import { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import { formatDate, permission_string } from "../../utils/constant";
import { useAdminContext } from "../../Hooks/AdminContext";
import { Button, Tooltip } from "@mui/material";
import Iconify from "../../components/Iconify";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { useSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import CustomImageAvatar from "../../components/CustomImageAvatar";
import ChangePassword from "./components/ChangePassword";
import { useNavigate } from "react-router-dom";
import {
  _business_customers_list,
  _delete_business_customer,
} from "../../DAL/BusinessCustomers/business_customers";
import { imageBaseUrl, projectMode } from "../../config/config";
import StatusDropDown from "../../components/StatusDropDown";
import { _Change_Status } from "../../DAL/CommonApis/CommonApis";
import {
  loginAsBusinessCustomer,
  Update_Expiry_Date,
} from "../../DAL/BusinessConfiguration/business_settings";
import OtpVerificationModal from "../../components/OtpVerificationModal";
import CustomDrawer from "../../components/CustomDrawer";
import BusinessFilter from "./components/BusinessFilter";
import dayjs from "dayjs";
import ExpiryDateModal from "./ExpiryDateModal";
import SummaryCard from "./components/SummaryCard";
import { show_proper_words } from "../../utils/constant_new";
import TooltipShowing from "../../components/TooltipShowing";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
// Filter constants
const EMPTY_FILTER = {
  category: null,
  range_type: "current_full_year",
  start_date: dayjs().startOf("year"),
  end_date: dayjs().endOf("year"),
};

const BusinessCustomer = ({ type, screen_path }) => {
  const isDemo = type === "demo";
  const searchTextKey = isDemo
    ? "search-text-demo-users"
    : "search-text-general-users";
  const isShowGeneralInfo = true;
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();

  const [modalStateChangePassword, setModalStateChangePassword] =
    useState(false);
  const [rowData, setRowData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  // New state for expiry date modal
  const [openExpiryModal, setOpenExpiryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [prevExpiryDate, setPrevExpiryDate] = useState("");
  const [nextExpiryDate, setNextExpiryDate] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const [expiresIn, setExpiresIn] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [nextInvoiceDate, setNextInvoiceDate] = useState("");

  // Filter state management
  const [filterData, setFilterData] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);
  const [openFilter, setOpenfilter] = useState(false);

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  const handleChangePage = (event, newPage) => {
    // setPage(newPage);
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(0);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  // Helper component for tooltip content
  const renderPlanTooltipContent = (planSettings, customer, expiryCheck) => {
    const plan = planSettings?.plan;
    if (!plan) return "No plan information available";

    if (plan.is_plan_free) return "Free Plan";

    return (
      <div>
        <div className="fw-semibold mb-1">
          Upfront: Rs {plan.upfront_price || 0}
        </div>
        <div className="mb-1">
          {plan.plan_type === "monthly"
            ? "Monthly Installment"
            : "Yearly Installment"}
          : Rs {plan.price || 0}
        </div>
        <div className="text-muted text-capitalize">
          Plan Type: {plan.plan_type}
        </div>
        <div className="text-muted text-capitalize">
          Grace Period: {plan.grace_period} Days
        </div>
        <div className="text-muted">
          Next Invoice Date: {formatDate(planSettings?.next_invoice_date)}
        </div>
        <div
          className={`text-capitalize ${
            expiryCheck ? " pointer video_title" : "text-muted"
          }`}
          style={{ "&:hover": "text-decoration: underline;" }}
          onClick={(e) => {
            e.stopPropagation();
            expiryCheck && handleOpenExpiryModal(planSettings, customer);
          }}
        >
          Last Payment Date: {formatDate(planSettings.expiry_date)}{" "}
          {expiryCheck && (
            <span>
              <Iconify
                icon={"stash:arrow-right-light"}
                width={20}
                height={20}
                className="button-icon-arrow"
              />
            </span>
          )}
        </div>
      </div>
    );
  };

  // Function to open expiry date modal
  const handleOpenExpiryModal = (planSettings, customer) => {
    const currentDate = new Date().toISOString();
    const expiryDate = planSettings?.expiry_date || "";
    setSelectedCustomer({
      ...planSettings,
      customerId: customer?.user_id?._id,
    });
    setPrevExpiryDate(expiryDate || currentDate);
    setOpenExpiryModal(true);
  };

  // Function to close expiry date modal
  const handleCloseExpiryModal = () => {
    setOpenExpiryModal(false);
  };

  const handleOtpModalOpen = () => {
    setOtpModalOpen(true);
  };

  const handleOtpModalClose = () => {
    setOtpModalOpen(false);
    setInitialRender(true);
    setLoginModalOpen(false);
    setLoginData(null);
    setExpiresIn(0);
    setSessionId(null);
  };

  const TABLE_HEAD = [
    { id: "number", label: "#", type: "number" },
    {
      id: "profile_image",
      label: isShowGeneralInfo ? "Business Customer" : "Demo Business Customer",
      className: "typography-color-in-table",
      renderData: (row) => {
        return (
          <div className="d-flex align-items-center mb-0">
            <CustomImageAvatar
              imageUrl={imageBaseUrl + row?.profile_image}
              altText={row?.profile_image}
              name={row?.full_name}
            />

            <div className="ms-2">
              <p className="mb-0 pointer fw-bold">
                {row?.full_name?.charAt(0).toUpperCase() +
                  row?.full_name?.slice(1)}
              </p>
              <p className="mb-0 pointer email-in-table">
                {row?.user_id?.email}
              </p>
              <p className="mb-0 pointer email-in-table">{row?.phone_number}</p>
            </div>
          </div>
        );
      },
    },
    ...(isShowGeneralInfo
      ? [
          {
            id: "Plan Info",
            label: "Plan Info",
            className: "typography-color-in-table",
            renderData: (row, index) => {
              let expiryStatus = "";
              let daysLeft = null;
              const expiryDateStr = row?.plan_settings?.expiry_date;

              if (expiryDateStr) {
                const expiryDate = new Date(expiryDateStr || "");
                const today = new Date();
                expiryDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                const diffTime = expiryDate - today;
                daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (row?.plan_settings?.plan?.is_plan_free) {
                  expiryStatus = "Free Plan";
                } else if (daysLeft <= 0) {
                  expiryStatus = "Your Plan Expired";
                } else if (daysLeft < row?.plan_settings?.plan?.grace_period) {
                  expiryStatus = "Expiring This Month";
                } else {
                  expiryStatus = "Active";
                }
              } else {
                expiryStatus = "N/A";
              }

              const expiryCheck =
                expiryStatus === "Your Plan Expired" ||
                expiryStatus === "Expiring This Month";

              return (
                <>
                  {row?.plan_settings ? (
                    <>
                      <div className="d-flex align-items-center">
                        <Tooltip
                          title={
                            openExpiryModal
                              ? ""
                              : renderPlanTooltipContent(
                                  row?.plan_settings,
                                  row,
                                  expiryCheck,
                                )
                          }
                          placement="top"
                          arrow
                          componentsProps={{
                            tooltip: {
                              sx: {
                                backgroundColor: "#fff",
                                color: "#000",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                fontSize: "0.8rem",
                              },
                            },
                            arrow: {
                              sx: { color: "#fff" },
                            },
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm border-0 bg-transparent p-0 d-flex align-items-center"
                          >
                            <Iconify
                              icon={"mdi:information-outline"}
                              className="text-color"
                            />
                          </button>
                        </Tooltip>
                      </div>

                      {expiryDateStr ? (
                        <div
                          className={`business-payment-column ${
                            expiryCheck ? "text-danger" : ""
                          }`}
                        >
                          {daysLeft !== null && (
                            <>
                              {daysLeft <= 0 ? (
                                <span className="text-danger fs-12 fw-semibold">
                                  Your Plan Expired
                                </span>
                              ) : (
                                <span
                                  className={`business-payment-column fs-12 ${
                                    expiryCheck ? "text-danger video_title" : ""
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (show) {
                                      return;
                                    }
                                    expiryCheck &&
                                      handleOpenExpiryModal(
                                        row?.plan_settings,
                                        row,
                                      );
                                  }}
                                >
                                  Days Left: {daysLeft}
                                  {expiryCheck && (
                                    <Iconify
                                      icon={"stash:arrow-right-light"}
                                      width={20}
                                      height={20}
                                      className="button-icon-arrow text-danger"
                                    />
                                  )}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </>
                  ) : (
                    <span className="text-muted">_ _</span>
                  )}
                </>
              );
            },
          },
        ]
      : []),
    {
      id: "business_type",
      label: "Business Type",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="capitalized">
          {row?.business_type ? show_proper_words(row?.business_type) : "N/A"}
        </span>
      ),
    },
    ...(isShowGeneralInfo
      ? [
          {
            id: "invoice_type",
            label: "Invoice Type",
            className: "typography-color-in-table",
            renderData: (row) => {
              return (
                <>
                  {row?.business_portal_settings?.invoice_reporting_method
                    ?.length === 0 ||
                  !row?.business_portal_settings?.invoice_reporting_method
                    ?.length ? (
                    "N/A"
                  ) : (
                    <div className="d-flex flex-column gap-0 fs-10">
                      {row?.business_portal_settings?.invoice_reporting_method?.map(
                        (method) => {
                          const isFbrPosInvoicing = method === "pos_invoicing";
                          const finalMethod = isFbrPosInvoicing
                            ? "FBR_POS_Invoicing"
                            : method;
                          return (
                            <div>
                              {row?.business_portal_settings
                                ?.default_invoice_reporting_method ===
                              method ? (
                                <Iconify
                                  icon={"mdi:check-circle"}
                                  className="text-success me-1"
                                  width={16}
                                  height={16}
                                />
                              ) : (
                                <Iconify
                                  icon={"mdi:check-circle"}
                                  className="me-1"
                                  style={{ visibility: "hidden" }}
                                  width={16}
                                  height={16}
                                />
                              )}
                              <span className="capitalized">
                                {String(finalMethod).replaceAll("_", " ")}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </>
              );
            },
          },
        ]
      : []),
    {
      id: "createdAt",
      label: "Created At",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="capitalized">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  const handleClickChangePassword = (row) => {
    setModalStateChangePassword(true);
    setRowData(row);
  };

  const handleClickPayments = (row) => {};

  const handleAgreeDelete = (row) => {
    setDeleteData(row);
    setOpenDelete(true);
  };

  const handleClickBusinessSettings = (row) => {};
  const handleClickFBRSettings = (row) => {};

  const handleClickChangeNavAccess = (row) => {};

  const handleClickPlanSettings = (row) => {};

  const handleClickSettings = (row) => {};

  const handleClickExtendExpiry = (row) => {
    // Open expiry date modal for the selected customer
    handleOpenExpiryModal(row?.plan_settings, row);
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "business-customers",
      type,
      searchText,
      page,
      rowsPerPage,
      filterData,
    ],

    queryFn: async () => {
      const typeMapping = {
        general: "real",
        demo: "demo",
      };

      const response = await _business_customers_list(
        {
          search: searchText,
          business_account_type: typeMapping[type] || "real",
        },
        page,
        rowsPerPage,
      );

      if (response?.code !== 200) {
        throw new Error(response?.message || "Failed to fetch data");
      }

      return response;
    },

    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const businessList =
    data?.business_list?.map((item) => ({
      ...item,
      full_name: `${item.first_name || ""} ${item.last_name || ""}`,
      user_name: item.user_id?.user_name || "",
      business_id: item.user_id?._id || "",
      phone_number: item.phone_number || "",
      business_type: item.category?.title || "",
      business_type_id: item.category?._id || "",
      two_factor_auth: item?.user_id?.two_factor_auth,
    })) || [];

  const totalCount = data?.total_count || 0;
  const totalPages = data?.total_pages || 0;

  const businessStats = [
    {
      color: "#5792c9",
      title: "Total Paid Business",
      count: data?.stat?.paid_businesses || 0,
      icon: "ix:customer",
    },
    {
      color: "#ff9800",
      title: "Total On Trial Business",
      count: data?.stat?.free_businesses || 0,
      icon: "carbon:customer",
    },
  ];

  const handleClearFilter = () => {
    setFilterData(EMPTY_FILTER);
    setFilterStateUpdated(EMPTY_FILTER);
    setOpenfilter(false);
    localStorage.removeItem("FilterData_Business_List");
  };

  const handleDeleteChip = (data) => {
    if (!data.date) {
      data.start_date = dayjs().startOf("year");
      data.end_date = dayjs().endOf("year");
      data.range_type = "current_full_year";
      delete data.date;
    }

    if (data.range_type === "current_full_year") {
      data.range_type = "current_full_year";
      data.start_date = dayjs().startOf("year");
      data.end_date = dayjs().endOf("year");
      delete data.date;
    }

    if (!data.category) {
      data.category = null;
    }
    localStorage.setItem("FilterData_Business_List", JSON.stringify(data));
    setFilterData(data);
  };

  const searchFunction = () => {
    sessionStorage.setItem(searchTextKey, searchText);

    setPage(0);
    setPageCount(1);

    refetch();
  };

  useEffect(() => {
    setNavBarTitle(
      isShowGeneralInfo
        ? "General Business Accounts"
        : "Demo Business Accounts",
    );

    setIsBackButton(false);

    const storedText = sessionStorage.getItem(searchTextKey);

    if (storedText) {
      setSearchText(storedText);
    }
  }, [type]);

  if (error) {
    return (
      <div className="alert alert-danger">
        Failed to load business customers.
      </div>
    );
  }

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <>
      <div className="mt-3">
        {isLoading ? (
          <CircularLoader />
        ) : (
          <CustomTable
            data={businessList}
            TABLE_HEAD={TABLE_HEAD}
            MENU_OPTIONS={[]}
            pagePagination={true}
            custom_search={{
              searchText,
              setSearchText,
              handleSubmit: searchFunction,
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
      </div>
    </>
  );
};

export default BusinessCustomer;
