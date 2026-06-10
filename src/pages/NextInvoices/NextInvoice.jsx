import { useEffect, useState } from "react";
import { useAdminContext } from "../../Hooks/AdminContext";
import { useNavigate } from "react-router-dom";
import { _list_next_invoices } from "../../DAL/NextInvoices/NextInvoices";
import { useSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import CustomTable from "../../components/customTable/CustomTable";
import { formatDate, formatPrice } from "../../utils/constant";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import Iconify from "../../components/Iconify";
import NextInvoiceFilter from "./Components/NextInvoiceFilter";
import FilteredChip from "../../components/FilterChips/FilteredChip";
import CustomDrawer from "../../components/CustomDrawer";
import CustomImageAvatar from "../../components/CustomImageAvatar";
import { imageBaseUrl } from "../../config/config";
import { formatFullName } from "../../utils/domUtils";
import { _list_payment } from "../../DAL/Payments/Payments";

// Filter constants
const EMPTY_FILTER = {
  customer: null,
  plan: null,
};

const NextInvoice = () => {
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Main state variables
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state management
  const [filterData, setFilterData] = useState(EMPTY_FILTER);
  const [filterStateUpdated, setFilterStateUpdated] = useState(EMPTY_FILTER);
  const [openFilter, setOpenfilter] = useState(false);

  // Main fetch invoices function with filtering support
  const fetchInvoices = async (filterParams = filterData) => {
    setLoading(true);

    // Prepare filter object for API
    const apiFilter = {
      type: "next_invoice",
      business_id:
        filterParams?.customer?.user_id?._id ||
        filterParams?.customer?.chip_value,
      plan_id: filterParams?.plan?._id || filterParams?.plan?.chip_value,
    };

    const result = await _list_payment(apiFilter, page, rowsPerPage);

    if (result.code === 200) {
      const { next_invoice_list = [], total_count, total_pages } = result.data;
      setInvoiceList(next_invoice_list);
      setTotalCount(total_count);
      setTotalPages(total_pages);
      const chipData = { ...filterParams };

      if (chipData?.customer?.user_id) {
        chipData.customer = {
          chip_label: formatFullName(
            chipData.customer.first_name,
            chipData.customer.last_name,
          ),
          chip_value: chipData.customer.user_id?._id,
        };
      }
      if (chipData?.plan?._id) {
        chipData.plan = {
          chip_label: chipData.plan.name,
          chip_value: chipData.plan._id,
        };
      }
      setFilterStateUpdated(chipData);
    } else {
      enqueueSnackbar(result.message || "Failed to fetch next invoices", {
        variant: "error",
      });
      setInvoiceList([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

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
    navigate(`/business-customer/detail/${row?.user_id?._id}`);
  };

  const TABLE_HEAD = [
    { id: "number", label: "#", type: "number" },
    {
      id: "customer_info",
      label: "Customer Info",
      className: "typography-color-in-table",
      renderData: (row) => {
        return (
          <div className="d-flex align-items-center mb-0">
            <CustomImageAvatar
              imageUrl={imageBaseUrl + row?.image}
              altText={row?.image}
              name={`${row?.first_name} ${row?.last_name}`}
            />
            <div
              className="ms-2"
              onClick={() => handleClickDetails(row)}
              style={{ cursor: "pointer" }}
            >
              <p className="mb-0 pointer fw-bold text-capitalize">
                {`${row?.first_name} ${row?.last_name}`}
              </p>
              <p className="mb-0 pointer email-in-table">
                {row?.user_id?.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "plan_info",
      label: "Plan Details",
      className: "typography-color-in-table",
      renderData: (row) => (
        <div className="d-flex flex-column">
          <span className="fw-bold text-primary">
            {row?.plan_settings?.plan?.name}
          </span>
          <small className="text-muted">
            {row?.plan_settings?.plan?.plan_type}
          </small>
        </div>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      className: "typography-color-in-table",
      renderData: (row) => (
        <div className="d-flex flex-column">
          <span className="fw-bold">
            {row.plan_settings?.plan?.plan_type === "monthly"
              ? "Monthly Installment"
              : "Yearly Installment"}
            : {formatPrice(row?.plan_settings?.plan?.price)}
          </span>
          {row?.plan_settings?.plan?.upfront_price >
            row?.plan_settings?.plan?.price && (
            <small className="text-muted">
              Upfront Price:{" "}
              {formatPrice(row?.plan_settings?.plan?.upfront_price)}
            </small>
          )}
        </div>
      ),
    },
    {
      id: "next_invoice_date",
      label: "Next Invoice Date",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span
          className={
            row?.plan_settings?.next_invoice_date &&
            dayjs(row.plan_settings.next_invoice_date).isBefore(dayjs())
              ? "text-danger fw-bold"
              : ""
          }
        >
          {formatDate(row?.plan_settings?.next_invoice_date)}
        </span>
      ),
    },
    {
      id: "expiry_date",
      label: "Expiry Date",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span
          className={
            row?.plan_settings?.expiry_date &&
            dayjs(row.plan_settings.expiry_date).isBefore(dayjs())
              ? "text-danger fw-bold"
              : ""
          }
        >
          {formatDate(row?.plan_settings?.expiry_date)}
        </span>
      ),
    },
    {
      id: "createdAt",
      label: "Created Date",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span>{formatDate(row?.plan_settings?.invoice_start_date)}</span>
      ),
    },
  ];

  const handleClickView = (row) => {
    // Navigate to view invoice details (read-only)
    navigate(`/next-invoices/view/${row?._id}`);
  };

  const MENU_OPTIONS = [
    {
      label: "View",
      icon: "mdi:eye",
      handleClick: handleClickView,
    },
  ];

  const searchFunction = () => {
    setOpenfilter(false);
    localStorage.setItem(
      "FilterData_NextInvoices_List",
      JSON.stringify(filterData),
    );
    fetchInvoices(filterData);
  };

  const handleClearFilter = () => {
    setFilterData(EMPTY_FILTER);
    setFilterStateUpdated(EMPTY_FILTER);
    setOpenfilter(false);
    localStorage.removeItem("FilterData_NextInvoices_List");
    fetchInvoices(EMPTY_FILTER);
  };

  const handleDeleteChip = (data) => {
    if (!data.customer) {
      data.customer = null;
    }
    if (!data.plan) {
      data.plan = null;
    }

    setFilterData(data);
    fetchInvoices(data);
    localStorage.setItem("FilterData_NextInvoices_List", JSON.stringify(data));
  };

  useEffect(() => {
    setNavBarTitle("Next Invoices");
    setIsBackButton(false);
    // Load saved filter data from localStorage
    const savedFilterData = localStorage.getItem(
      "FilterData_NextInvoices_List",
    );
    if (savedFilterData) {
      const parsedFilterData = JSON.parse(savedFilterData);
      setFilterData(parsedFilterData);
      setFilterStateUpdated(parsedFilterData);
      fetchInvoices(parsedFilterData);
    } else {
      fetchInvoices();
    }
  }, [page, rowsPerPage]);

  if (loading) return <CircularLoader />;

  return (
    <>
      <div className="container-fluid mt-3">
        {/* <div className="row mt-5 mb-4">
          {DUMMY_DATA.map((item, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3">
              <SummaryCard
                color={item.color}
                title={item.title}
                count={item.count}
                icon={item.icon}
              />
            </div>
          ))}
        </div> */}

        <div className="d-flex justify-content-between align-items-center mb-1">
          <div>{/* Empty div for left side spacing */}</div>

          <div className="d-flex gap-2">
            {/* Filter Button */}
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:filter" />}
              onClick={() => setOpenfilter(true)}
              className="capitalized"
            >
              Filter
            </Button>
          </div>
        </div>

        <div className="col-12">
          <div className="row align-items-center my-2">
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
          data={invoiceList}
          TABLE_HEAD={TABLE_HEAD}
          MENU_OPTIONS={[]}
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
            <NextInvoiceFilter
              filterData={filterData}
              setFilterData={setFilterData}
              searchFunction={searchFunction}
              handleClearFilter={handleClearFilter}
            />
          }
        />
      </div>
    </>
  );
};

export default NextInvoice;
