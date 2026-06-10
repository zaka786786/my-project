import { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import {
  formatDate,
  PAYMENTSTATUS,
  ToLocalString,
  uploadImage,
} from "../../utils/constant";
import moment from "moment";
import { useSnackbar } from "notistack";
import PaymentStatusModal from "../CustomerPayments/components/PaymentStatusModal";
import {
  _cancel_payment,
  _update_payment_status,
} from "../../DAL/Payments/Payments";
import DetailsModal from "../../components/DetailsModal.jsx/DetailsModal";
import PaymentDetails from "./PaymentDetails";
import CancelPaymentModal from "../CustomerPayments/CancelPaymentModal";

const TransactionsList = ({
  status,
  payments,
  fetchCustomerData,
  openCancelModal,
  cancelModalLoading,
  setCancelModalLoading,
  handleCancelModalClose,
  selectedPayment,
  totalPages,
  pageCount,
  totalCount,
  rowsPerPage,
  page,
  handleChangePages,
  handleChangeRowsPerPage,
  handleChangePage,
  statusModalLoading,
  setStatusModalLoading,
  openStatusModal,
  handleStatusModalClose,
  handleStatusClick,
  show = false,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [businessList, setbusinessList] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  const handleGetClass = (row) => {
    let class_name = "";
    if (row.status === "pending" || row.status === "due") {
      class_name = "pointer";
    }
    class_name = "pointer";
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
      console.log(result, "result");
      setbusinessList([result?.payments, ...businessList]);
      fetchCustomerData();
      handleStatusModalClose();
      // Refresh the list
    } else {
      enqueueSnackbar(result.message || "Failed to update payment status", {
        variant: "error",
      });
    }
    setStatusModalLoading(false);
  };

  const TABLE_HEAD = [
    { id: "number", label: "#", type: "number" },
    {
      id: "paid_amount",
      label: "Amount",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="text-capitalize">
          Rs {ToLocalString(row?.total_paid_amount)}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      className: "typography-color-in-table",
      renderData: (row) => {
        const find_status = PAYMENTSTATUS.find(
          (status) => status.value === row?.status,
        );
        const tooltipText =
          row.status === "pending" || row.status === "due"
            ? "Change Payment Status"
            : "Payment Status";
        return (
          <span
            data-bs-toggle="tooltip"
            data-bs-title={tooltipText}
            className={`${find_status?.class} ${handleGetClass(row)}`}
          >
            {handleGetStatus(row)}
          </span>
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
      id: "",
      label: "Payment Date",
      className: "typography-color-in-table",
      renderData: (row) => <span>{formatDate(row?.paid_date)}</span>,
    },
    // {
    //   id: "action",
    //   label: "Action",
    //   type: "action",
    //   MENU_OPTIONS: "MENU_OPTIONS",
    // },
  ];

  if (status != "Pending") {
    const paidDateColumn = {
      id: "paid_date",
      label: "PAID DATE",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span>
          {row.state === "Paid"
            ? moment(row.paid_date).format("DD MMM YYYY")
            : "_ _"}
        </span>
      ),
    };

    const index = TABLE_HEAD.findIndex((col) => col.id === "due_date");

    if (index !== -1) {
      TABLE_HEAD.splice(index + 1, 0, paidDateColumn);
    }
  }

  const handleCancelPayment = async (formData) => {
    setCancelModalLoading(true);

    // Prepare form data for API
    const cancelData = {
      note: formData.note,
    };

    const result = await _cancel_payment(selectedPayment._id, cancelData);

    if (result.code === 200) {
      handleCancelModalClose();
      fetchCustomerData();
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

  const handleOpenModalDetails = (row) => {
    setOpenDetails(true);
    setDetailsData(row);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetails(false);
    setDetailsData(null);
  };

  const get_business_list = async () => {
    console.log(payments, "payments");
    setbusinessList(payments);
  };

  useEffect(() => {
    get_business_list();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <CustomTable
          is_hide={true}
          data={businessList || []}
          TABLE_HEAD={TABLE_HEAD || []}
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
      {openStatusModal && !show && (
        <PaymentStatusModal
          open={openStatusModal}
          onClose={handleStatusModalClose}
          onSubmit={handleStatusUpdate}
          paymentData={selectedPayment}
          loading={statusModalLoading}
        />
      )}
      {openDetails && (
        <DetailsModal
          title={"Payment Details"}
          open={openDetails}
          handleClose={handleCloseDetailsModal}
          component={<PaymentDetails data={detailsData} />}
        />
      )}
      {openCancelModal && !show && (
        <CancelPaymentModal
          open={openCancelModal}
          onClose={handleCancelModalClose}
          onSubmit={handleCancelPayment}
          loading={cancelModalLoading}
        />
      )}
    </div>
  );
};

export default TransactionsList;
