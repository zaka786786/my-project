import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminContext } from "../../Hooks/AdminContext";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import moment from "moment";
import CircularLoader from "../../components/loaders/CircularLoader";
import { useRef } from "react";

const CustomerInvoice = () => {
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const { customer_id, invoice_id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const invoiceRef = useRef();
  // const handleDownloadPDF = () => {
  //   const element = invoiceRef.current;
  //   const options = {
  //     margin: 0.5,
  //     filename: `Invoice-${invoice_id}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 3 },
  //     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  //   };
  // };

  const handleDownloadCSV = () => {
    if (!transaction) return;

    /* ---- 1. Build CSV rows ---- */
    // Header row
    const header = [
      "Invoice ID",
      "Date",
      "Description",
      "Transaction Mode",
      "Transaction ID",
      "Status",
      "Amount",
    ];

    // Data row (single‑line invoice)
    const row = [
      invoice_id,
      moment(transaction.createdAt).format("YYYY‑MM‑DD"),
      "Business Payment",
      transaction.transaction_mode,
      transaction.transaction_id,
      transaction.payment_status,
      transaction.amount,
    ];

    // Join into CSV string
    const csvContent = [header, row]
      .map((line) =>
        line
          .map(
            (field) => `"${String(field).replace(/"/g, '""')}"`, // escape any quotes
          )
          .join(","),
      )
      .join("\r\n");

    /* ---- 2. Create Blob & link ---- */
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${invoice_id}.csv`;
    document.body.appendChild(link);
    link.click();

    /* ---- 3. Cleanup ---- */
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setNavBarTitle("Invoice");
    setIsBackButton(false);
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTransaction = async () => {
    const data = [
      {
        _id: "1",
        amount: "£25.00",
        name: "Dynamic Logix",
        type: "Admin",
        full_name: "Ali Khan",
        transaction_mode: "sandBox",
        transaction_id: "Stripe (pi_3ROFlBLMFi6WRjkJ0VHIs4Aw)",
        createdBy: "Admin",
        first_name: "Ali",
        last_name: "Khan",
        owner_email: "admin@gmail.com",
        customer_email: "ali@techbazaar.pk",
        phone_number: "923012345678",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLmCVoliHuVYNDXSAhjNVhj5f4cFNPg_iIMQ&s",
        payment_status: "Succeeded",
        status: true,
        createdAt: "2025-05-01T12:00:00Z",
      },
      {
        _id: "2",
        amount: "£500.00",
        name: "Dynamic Logix",
        full_name: "Ali Khan",
        transaction_mode: "sandBox",
        transaction_id: "Stripe (pi_3ROFlBLMFi6WRjkJ0VHIs4Aw)",
        createdBy: "Admin",
        owner_email: "admin@gmail.com",
        customer_email: "ali@techbazaar.pk",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLmCVoliHuVYNDXSAhjNVhj5f4cFNPg_iIMQ&s",
        payment_status: "Pending",
        createdAt: "2025-04-04T12:00:00Z",
      },
      {
        _id: "3",
        amount: "£100.00",
        name: "Dynamic Logix",
        full_name: "Ali Khan",
        transaction_mode: "live",
        transaction_id: "Stripe (pi_3ROFlBLMFi6WRjkJ0VHIs4Aw)",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLmCVoliHuVYNDXSAhjNVhj5f4cFNPg_iIMQ&s",
        createdBy: "Admin",
        customer_email: "ali@techbazaar.pk",
        owner_email: "admin@gmail.com",
        payment_status: "Failed",
        createdAt: "2025-03-25T12:00:00Z",
      },
    ];

    const foundTransaction = data.find((item) => item._id === invoice_id);
    setTransaction(foundTransaction);
    setIsLoading(false);
  };

  const breadCrumbMenu = [
    {
      title: "Business Customer",
      navigation: "/business-customer",
      active: false,
    },
    {
      title: "Payments",
      navigation: `/business-customer/payments/${customer_id}`,
      active: false,
    },
    {
      title: "Invoice",
      active: true,
    },
  ];

  if (isLoading) return <CircularLoader />;

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 display-flex mb-3">
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </div>
        </div>
        <div className="d-flex justify-content-start gap-2 mb-3">
          <button className="btn btn-info">Download PDF</button>
          <button onClick={handleDownloadCSV} className="btn btn-info">
            Download CSV
          </button>
        </div>

        {transaction ? (
          <div ref={invoiceRef} className="card p-4 shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="mb-1">Invoice</h3>
                <small className="text-muted">
                  {moment(transaction.createdAt).format("DD MMM YYYY")}
                </small>
              </div>
              <div>
                <img
                  src={transaction.logo}
                  crossOrigin="anonymous"
                  alt="Business Logo"
                  style={{ width: "80px", height: "80px", borderRadius: "8px" }}
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="mb-2">From:</h6>
                <p className="mb-0 fw-bold">{transaction.name}</p>
                {/* <p className="mb-0 text-muted">{transaction.type}</p> */}
                <p className="mb-0 text-muted">{transaction.owner_email}</p>
                <p className="mb-0 text-muted">
                  Phone: {transaction.phone_number}
                </p>
              </div>
              <div className="col-md-6 text-md-end mt-4 mt-md-0">
                <h6 className="mb-2">To:</h6>
                <p className="mb-0 fw-bold">{transaction.full_name}</p>
                <p className="mb-0 text-muted">{transaction.customer_email}</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th>Transaction Mode</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Business Payment</td>
                    <td>{transaction.transaction_mode}</td>
                    <td>{transaction.transaction_id}</td>
                    <td>
                      <span
                        className={`badge ${
                          transaction.payment_status === "Succeeded"
                            ? "bg-success"
                            : transaction.payment_status === "Pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                        }`}
                      >
                        {transaction.payment_status}
                      </span>
                    </td>
                    <td className="text-end">{transaction.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <div>
                <small className="text-muted">
                  Created By: {transaction.createdBy}
                </small>
              </div>
              <div>
                <h5>Total: {transaction.amount}</h5>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            No Invoice Found
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerInvoice;
