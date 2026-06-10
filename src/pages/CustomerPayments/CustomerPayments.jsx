import { useEffect, useState } from "react";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import { useAdminContext } from "../../Hooks/AdminContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  _list_payment,
  _delete_payment,
  _update_payment_status,
  _cancel_payment,
  _add_payment,
} from "../../DAL/Payments/Payments";
import { useSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import CustomTable from "../../components/customTable/CustomTable";
import {
  formatDate,
  PAYMENTSTATUS,
  permission_string,
  ToLocalString,
  uploadImage,
} from "../../utils/constant";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import Iconify from "../../components/Iconify";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import TransactionFilter from "./components/TransactionFilter";
import FilteredChip from "../../components/FilterChips/FilteredChip";
import CustomDrawer from "../../components/CustomDrawer";
import CustomImageAvatar from "../../components/CustomImageAvatar";
import { imageBaseUrl } from "../../config/config";
import { formatFullName } from "../../utils/domUtils";
import PaymentStatusModal from "./components/PaymentStatusModal";
import CancelPaymentModal from "./CancelPaymentModal";
import AddPaymentModal from "./components/AddPaymentModal";
import SummaryCard from "../Dashboard/components/SummaryCard";
import TooltipShowing from "../../components/TooltipShowing";

// Filter constants
const EMPTY_FILTER = {
  customer: null,
  range_type: "current_full_year",
  start_date: dayjs().startOf("year"),
  end_date: dayjs().endOf("year"),
};

// Payment status tabs configuration
const PAYMENT_STATUS_TABS = [
  {
    title: "All",
    status: "all",
    icon: "mdi:store-outline",
  },
  {
    title: "Paid",
    status: "paid",
    icon: "mdi:check-circle",
  },
  {
    title: "Upcoming",
    status: "pending",
    icon: "mdi:clock-outline",
  },
  {
    title: "Due",
    status: "due",
    icon: "mdi:alert-circle",
  },
  {
    title: "Cancelled",
    status: "cancelled",
    icon: "mdi:cancel",
  },
];

const TabsGetter = (value) => {
  const tabValue = PAYMENT_STATUS_TABS[Number(value)]?.status;
  return tabValue;
};

const CustomerPayments = ({
  business_data = "",
  screen_path = "",
  type = "general",
}) => {
  const isDemo = type === "demo";
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelModalLoading, setCancelModalLoading] = useState(false);
  const { customer_id } = useParams();
  const from = new URLSearchParams(window.location.search).get("from");
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // Main state variables
  const [businessList, setbusinessList] = useState([]);
  const [customer, setCustomer] = useState({});
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Delete confirmation state
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  // Filter state management
  const [filterData, setFilterData] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);
  const [openFilter, setOpenfilter] = useState(false);

  // Payment status modal state
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [statusModalLoading, setStatusModalLoading] = useState(false);

  // Tab state management
  const [tabValue, setTabValue] = useState(2);

  // Add Payment Modal state
  const [openAddPaymentModal, setOpenAddPaymentModal] = useState(false);
  const [addPaymentLoading, setAddPaymentLoading] = useState(false);
  const [paymentStats, setPaymentStats] = useState([]);
  const isPaymentsPage = window.location.pathname === "/payments";

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  // Main fetch transactions function with filtering support
  const fetchTransactions = async (
    filterParams = filterData,
    paymentStatus,
  ) => {
    setLoading(true);
    // Prepare filter object for API
    const apiFilter = {
      status: "all",
      // status: paymentStatus, // Original: uses tab-based status
      business_id:
        filterParams?.customer?.user_id?._id ||
        filterParams?.customer?.chip_value ||
        customer_id ||
        "",
      date_from: "",
      date_to: "",
    };

    // Add date filters if provided
    if (filterParams?.start_date && filterParams?.end_date) {
      apiFilter.date_from = dayjs(filterParams.start_date).format("YYYY-MM-DD");
      apiFilter.date_to = dayjs(filterParams.end_date).format("YYYY-MM-DD");
    }

    const result = await _list_payment(
      apiFilter,
      page,
      rowsPerPage,
      business_data,
    );

    if (result.code === 200) {
      const {
        payments_list,
        total_count,
        total_pages,
        business,
        total_received_amount,
      } = result.data;
      setCustomer(business);
      const FormattedData = payments_list?.map((item, index) => {
        return {
          ...item,
          MENU_OPTIONS: show ? [] : handleMenu(item),
        };
      });
      setbusinessList(FormattedData);
      setTotalCount(total_count);
      setTotalPages(total_pages);
      const chipData = { ...filterParams };
      if (chipData?.start_date && chipData?.end_date) {
        chipData.date = {
          chip_label: `From ${dayjs(chipData.start_date).format(
            "DD-MM-YYYY",
          )} to ${dayjs(chipData.end_date).format("DD-MM-YYYY")}`,
          chip_value: `From ${dayjs(chipData.start_date).format(
            "DD-MM-YYYY",
          )} to ${dayjs(chipData.end_date).format("DD-MM-YYYY")}`,
        };
        delete chipData.start_date;
        delete chipData.end_date;
      }

      if (chipData?.customer?.user_id) {
        chipData.customer = {
          chip_label: formatFullName(
            chipData.customer.first_name,
            chipData.customer.last_name,
          ),
          chip_value: chipData.customer.user_id?._id,
        };
      }
      let stats_cards = [];
      stats_cards.push({
        color: "#5792c9",
        title: "Total Received Amount",
        count: ToLocalString(total_received_amount),
        icon: "mdi:cash",
        onViewClick: null,
      });

      setPaymentStats(stats_cards);
      setFilterStateUpdated(chipData);
    } else {
      enqueueSnackbar(result.message || "Failed to fetch payments", {
        variant: "error",
      });
      setbusinessList([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  let breadCrumbMenu = [
    {
      title: from === "basicDetails" ? "Business Details" : "Business Customer",
      navigation:
        from === "basicDetails"
          ? `/business-customer/detail/${customer_id}`
          : isDemo
            ? "/demo-business-accounts"
            : "/business-customer",
      active: false,
    },
    {
      title: "Payments",
      active: true,
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickDetails = (row) => {
    navigate(
      `/${isDemo ? "demo-business-accounts" : "business-customer"}/detail/${row?.business?.user_id}`,
    );
  };

  const handleGetClass = (row) => {
    let class_name = "";
    if (row.status === "pending" || row.status === "due") {
      class_name = "pointer";
    }
    return class_name;
  };

  const handleGetStatus = (row) => {
    let status = "";
    if (row.status === "cancelled") {
      status = "Cancelled";
    }
    if (row.status === "pending") {
      status = "Upcoming";
    } else if (row.status === "paid") {
      status = "Paid";
    }
    if (row.status === "due") {
      status = "Due";
    }
    if (row.status === "all") {
      status = "All";
    }
    return status;
  };

  const TABLE_HEAD = [
    { id: "number", label: "#", type: "number" },
    {
      id: "business",
      label: "Business Info",
      className: "typography-color-in-table",
      renderData: (row) => {
        return (
          <div className="d-flex align-items-center mb-0">
            <CustomImageAvatar
              imageUrl={imageBaseUrl + row?.business?.image}
              altText={row?.business?.image}
              name={formatFullName(
                row?.business?.first_name,
                row?.business?.last_name,
              )}
            />
            <div
              className="ms-2"
              onClick={() => handleClickDetails(row)}
              style={{ cursor: "pointer" }}
            >
              <p className="mb-0 pointer fw-bold text-capitalize">
                {formatFullName(
                  row?.business?.first_name,
                  row?.business?.last_name,
                )}
              </p>
              <p className="mb-0 pointer email-in-table">
                {row?.business?.email}
              </p>
              <p className="mb-0 pointer email-in-table">
                {row?.business?.phone_number}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "payment_for",
      label: "Payment Type",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="text-capitalize">{row?.payment_for}</span>
      ),
    },
    {
      id: "total_paid_amount",
      label: "Total Paid Amount",
      className: "typography-color-in-table",
      renderData: (row) => {
        return (
          <span className="text-capitalize">
            Rs {ToLocalString(row?.total_paid_amount)}
          </span>
        );
      },
    },
    {
      id: "",
      label: "Payment Date",
      className: "typography-color-in-table",
      renderData: (row) => <span>{formatDate(row?.date)}</span>,
    },
    {
      id: "status",
      label: "Status",
      className: "typography-color-in-table",
      renderData: (row) => {
        const find_status = PAYMENTSTATUS.find(
          (status) => status.value === row?.status,
        );
        return (
          <span
            className={`${find_status?.class} ${handleGetClass(row)}`}
            onClick={() => {
              (row.status === "pending" || row.status === "due") &&
                handleStatusClick(row);
            }}
          >
            {handleGetStatus(row)}
          </span>
        );
      },
    },
  ];

  // Conditional table columns based on tab - COMMENTED OUT to show all payments in single list
  // if (tabValue === 1) {
  //   TABLE_HEAD.splice(TABLE_HEAD.length - 2, 0, {
  //     id: "",
  //     label: "Payment Date",
  //     className: "typography-color-in-table",
  //     renderData: (row) => <span>{formatDate(row?.paid_date)}</span>,
  //   });
  // }

  // if (tabValue !== 1) {
  //   TABLE_HEAD.splice(0, 0, {
  //     id: "action",
  //     label: "ACTION",
  //     type: "action",
  //     MENU_OPTIONS: "MENU_OPTIONS",
  //   });
  // }

  // Always show action column (since tabs are disabled)
  TABLE_HEAD.splice(0, 0, {
    id: "action",
    label: "ACTION",
    type: "action",
    MENU_OPTIONS: "MENU_OPTIONS",
  });

  const handleClickEdit = (row) => {
    const state = { ...row };
    delete state.MENU_OPTIONS;
    navigate(`/payments/add-or-update-payments/${row?._id}`, {
      state: { ...state },
    });
  };

  const handleAgreeDelete = (row) => {
    setDeleteData(row);
    setOpenDelete(true);
  };

  const handleAddPayment = () => {
    setOpenAddPaymentModal(true);
  };

  const handleAddPaymentModalClose = () => {
    setOpenAddPaymentModal(false);
  };

  const handleAddPaymentSubmit = async (formData) => {
    setAddPaymentLoading(true);
    const result = await _add_payment(formData);
    if (result.code === 200) {
      fetchTransactions(filterData, "all");
      enqueueSnackbar("Payment added successfully", { variant: "success" });
      setOpenAddPaymentModal(false);
    } else {
      enqueueSnackbar(result.message || "Failed to add payment", {
        variant: "error",
      });
    }
    setAddPaymentLoading(false);
  };

  const handleDelete = async () => {
    setDelLoading(true);

    const result = await _delete_payment(deleteData._id);

    if (result.code === 200) {
      const filteredList = businessList.filter(
        (item) => item?._id !== deleteData?._id,
      );
      setbusinessList(filteredList);
      setTotalCount((prev) => prev - 1);
      enqueueSnackbar("Payment deleted successfully", { variant: "success" });
      setOpenDelete(false);
    } else {
      enqueueSnackbar(result.message || "Failed to delete payment", {
        variant: "error",
      });
    }
  };

  const handleCancelClick = (row) => {
    setSelectedPayment(row);
    setOpenCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setOpenCancelModal(false);
    setSelectedPayment(null);
  };

  function handleMenu(item) {
    const MENU_OPTIONS = [];
    if (item.status === "pending") {
      MENU_OPTIONS.push(
        // {
        //   label: "Edit",
        //   icon: "akar-icons:edit",
        //   handleClick: handleClickEdit,
        // },
        {
          label: "Delete",
          icon: "ant-design:delete-twotone",
          handleClick: handleAgreeDelete,
        },
      );
    }
    if (item.payment_for === "recurring" && item.status === "pending") {
      MENU_OPTIONS.push({
        label: "Cancel Payment",
        icon: "mdi:cancel",
        handleClick: handleCancelClick,
      });
    }
    if (item.payment_for === "recurring" || item.payment_for === "upfront") {
      if (item.status === "pending" || item.status === "due") {
        MENU_OPTIONS.push({
          label: "Change Payment Status",
          icon: "ant-design:check-circle-twotone",
          handleClick: handleStatusClick,
        });
      }
    }
    return MENU_OPTIONS;
  }

  const searchFunction = () => {
    setOpenfilter(false);
    localStorage.setItem(
      "FilterData_Payments_List",
      JSON.stringify(filterData),
    );
    const tabValue = localStorage.getItem("PaymentStatusTabValue");
    const CurrentTab = TabsGetter(tabValue ? tabValue : 2);
    fetchTransactions(filterData, CurrentTab);
  };

  const handleClearFilter = () => {
    setFilterData(EMPTY_FILTER);
    setFilterStateUpdated(EMPTY_FILTER);
    setOpenfilter(false);
    localStorage.removeItem("FilterData_Payments_List");
    const tabValue = localStorage.getItem("PaymentStatusTabValue");
    const CurrentTab = TabsGetter(tabValue ? tabValue : 2);
    fetchTransactions(EMPTY_FILTER, CurrentTab);
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

    if (!data.customer) {
      data.customer = null;
    }
    const tabValue = localStorage.getItem("PaymentStatusTabValue");
    const CurrentTab = TabsGetter(tabValue ? tabValue : 2);
    fetchTransactions(data, CurrentTab);
    localStorage.setItem("FilterData_Payments_List", JSON.stringify(data));
    setFilterData(data);
  };

  // Payment status modal handlers
  const handleStatusClick = (row) => {
    if (row.status === "pending" || row.status === "due") {
      setSelectedPayment(row);
      setOpenStatusModal(true);
    }
  };

  const handleCancelPayment = async (formData) => {
    setCancelModalLoading(true);

    // Prepare form data for API
    const cancelData = {
      note: formData.note,
    };

    const result = await _cancel_payment(selectedPayment._id, cancelData);

    if (result.code === 200) {
      handleCancelModalClose();
      setTabValue(0);
      localStorage.setItem("PaymentStatusTabValue", 0);
      fetchTransactions(filterData, "all"); // Refresh the list
      enqueueSnackbar(result.message || "", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message || "Failed to cancel payment", {
        variant: "error",
      });
    }
    setCancelModalLoading(false);
  };

  const handleStatusModalClose = () => {
    setOpenStatusModal(false);
    setSelectedPayment(null);
  };

  const handleStatusUpdate = async (formData) => {
    setStatusModalLoading(true);

    let ImgUrl = "";
    if (formData?.attachment instanceof File) {
      ImgUrl = await uploadImage(formData?.attachment);
    } else {
      ImgUrl = formData?.attachment;
    }

    // Prepare form data for API
    const updateData = {
      transaction_id: formData?.ref,
      payment_method: formData?.payment_method,
      note: formData?.note,
      invoice_url: ImgUrl,
    };

    const result = await _update_payment_status(
      selectedPayment._id,
      updateData,
    );

    if (result.code === 200) {
      enqueueSnackbar("Payment status updated successfully", {
        variant: "success",
      });
      handleStatusModalClose();
      setTabValue(0);
      localStorage.setItem("PaymentStatusTabValue", 0);
      fetchTransactions(filterData, "all"); // Refresh the list
    } else {
      enqueueSnackbar(result.message || "Failed to update payment status", {
        variant: "error",
      });
    }
    setStatusModalLoading(false);
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const selectedStatus = PAYMENT_STATUS_TABS[newValue].status;
    localStorage.setItem("PaymentStatusTabValue", newValue);
    fetchTransactions(filterData, selectedStatus);
    console.log("Selected Status:", selectedStatus);

    setPageCount(1);
    setPage(0);
  };

  useEffect(() => {
    setNavBarTitle("Payments");
    setIsBackButton(false);
    const storedTabValue = localStorage.getItem("PaymentStatusTabValue");
    const storedStatus = TabsGetter(storedTabValue ? storedTabValue : 2);
    setTabValue(storedTabValue ? Number(storedTabValue) : 2);

    // Load saved filter data from localStorage
    const savedFilterData = localStorage.getItem("FilterData_Payments_List");
    if (savedFilterData) {
      const parsedFilterData = JSON.parse(savedFilterData);
      setFilterData(parsedFilterData);
      setFilterStateUpdated(parsedFilterData);
      fetchTransactions(
        parsedFilterData,
        storedStatus ? storedStatus : "pending",
      );
    } else {
      fetchTransactions(EMPTY_FILTER, storedStatus || "pending");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);
  console.log(customer, "customercustomercustomer");

  if (loading) return <CircularLoader />;

  return (
    <>
      <CancelPaymentModal
        open={openCancelModal}
        onClose={handleCancelModalClose}
        onSubmit={handleCancelPayment}
        loading={cancelModalLoading}
      />
      <AddPaymentModal
        open={openAddPaymentModal}
        onClose={handleAddPaymentModalClose}
        onSubmit={handleAddPaymentSubmit}
        loading={addPaymentLoading}
        setLoading={setAddPaymentLoading}
        showCustomerSelect={isPaymentsPage}
        customerDetails={Object.keys(customer).length === 0 ? null : customer}
      />
      <div className="container-fluid mt-3">
        {customer_id && (
          <div className="row">
            <div className="col-12 display-flex mb-1">
              <span>
                <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
              </span>
            </div>
          </div>
        )}
        <div className="row justify-content-start">
          {paymentStats.map((business, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3 mt-3">
              <SummaryCard {...business} />
            </div>
          ))}
        </div>
        <>
          <DeleteConfirmation
            open={openDelete}
            isLoading={delLoading}
            setOpen={setOpenDelete}
            title={"Are you sure you want to delete this payment?"}
            handleAgree={handleDelete}
          />

          <PaymentStatusModal
            open={openStatusModal}
            onClose={handleStatusModalClose}
            onSubmit={handleStatusUpdate}
            paymentData={selectedPayment}
            loading={statusModalLoading}
            customer={customer_id}
          />

          <div className="d-flex gap-2 justify-content-end">
            {/* Filter Button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:filter" />}
              onClick={() => setOpenfilter(true)}
              className="capitalized"
            >
              Filter
            </Button>
            {/* Add Payment Button */}

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

                    handleAddPayment();
                  }}
                  className="capitalized button-in-listing"
                >
                  Add Payment
                </Button>

                // <Button
                //   disabled={show}
                //   variant="contained"
                //   startIcon={
                //     <Iconify
                //       className="button-Iconify-in-listing"
                //       icon="eva:plus-fill"
                //     />
                //   }
                //   onClick={() => {
                //     if (show) {
                //       enqueueSnackbar(permission_string, {
                //         variant: "error",
                //       });
                //       return;
                //     }
                //     const pathMapping = {
                //       general: "/business-customer/add",
                //       demo: "/demo-business-accounts/add?type=demo",
                //     };
                //     const path = pathMapping[type] || "/business-customer/add";
                //     navigate(path);
                //   }}
                //   className="capitalized button-in-listing ms-2"
                // >
                //   Add New Business Customer
                // </Button>
              }
            />

            {/* <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => handleAddPayment()}
              className="capitalized button-in-listing"
            >
              Add Payment
            </Button> */}
          </div>

          {/* Tabs UI - COMMENTED OUT to show all payments in single list */}
          {/* <div className="row mb-3">
            <div className="col-12">
              <MUICustomTabs
                data={PAYMENT_STATUS_TABS}
                value={tabValue}
                handleChange={handleTabChange}
              />
            </div>
          </div> */}

          <div className="col-12">
            <div className="row align-items-center my-3">
              <div className="col-12">
                <FilteredChip
                  data={filterStateUpdated}
                  tempState={filterData}
                  EMPTY_FILTER={EMPTY_FILTER}
                  onDeleteChip={handleDeleteChip}
                  onClear={handleClearFilter}
                />
              </div>
            </div>
          </div>

          <CustomTable
            data={businessList}
            TABLE_HEAD={TABLE_HEAD}
            custom_pagination={{
              total_count: totalCount,
              rows_per_page: rowsPerPage,
              page: page,
              handleChangePage: handleChangePage,
              onRowsPerPageChange: handleChangeRowsPerPage,
            }}
            is_hide={true}
            pageCount={pageCount}
            totalPages={totalPages}
            handleChangePages={handleChangePages}
            pagePagination={true}
          />

          {/* Filter Drawer */}
          <CustomDrawer
            isOpenDrawer={openFilter}
            onOpenDrawer={() => setOpenfilter(true)}
            onCloseDrawer={() => setOpenfilter(false)}
            pageTitle="Filter"
            componentToPassDown={
              <TransactionFilter
                filterData={filterData}
                setFilterData={setFilterData}
                searchFunction={searchFunction}
                handleClearFilter={handleClearFilter}
              />
            }
          />
        </>
      </div>
    </>
  );
};

export default CustomerPayments;
