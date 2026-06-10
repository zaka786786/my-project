import React from "react";
import { show_proper_words } from "../../utils/constant";
import { formatDate } from "../../utils/constant";
import { imageBaseUrl } from "../../config/config";
import { Icon } from "@iconify/react/dist/iconify.js";

const PaymentDetails = ({ data }) => {
  const handleDownload = async (url) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("File not found");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = url.split("/").pop() || "invoice";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (!data) {
    return <div>No Data</div>;
  }
  console.log(data, "datadatadatadatadatadata");

  // Format the business user info
  const businessUserInfo = data?.business
    ? `${data.business.first_name} ${data.business.last_name}`
    : "N/A";

  const businessUserEmail = data?.business ? data.business.email : "N/A";

  // Format the plan info
  const planInfo = data?.plan
    ? `${data.plan.name} (${data.plan.plan_type})`
    : "N/A";

  const PaymentDetailsList = [
    {
      title: "Business Name",
      value: businessUserInfo,
      isShow: data.business,
    },
    {
      title: "Business Email",
      value: businessUserEmail,
      isShow: data.business,
    },
    {
      title: "Total Paid Amount",
      value: data.total_paid_amount || "N/A",
      isShow: !!data?.total_paid_amount,
    },
    {
      title: "Plan",
      value: planInfo,
      isShow: !!data?.plan,
    },
    {
      title: "Status",
      value: show_proper_words(data.status) || "N/A",
      isShow: !!data?.status,
    },
    {
      title: "Payment For",
      value: show_proper_words(data.payment_for) || "N/A",
      isShow: !!data?.payment_for,
    },
    {
      title: "Payment Method",
      value: show_proper_words(data.payment_method) || "N/A",
      isShow: !!data?.payment_method,
    },
    {
      title: "Note",
      value: data.note || "",
      isShow: !!data?.note,
    },
    {
      title: "Payment Date",
      value: formatDate(data?.paid_date),
      isShow: !!data?.paid_date,
    },
    {
      title: "Next Payment Date",
      value: formatDate(data?.date),
      isShow: !!data?.date,
    },
  ].filter((item) => item.isShow);

  return (
    <div className="row gy-3">
      {PaymentDetailsList.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <div className="col-12 col-md-3">
              <p className="mb-0 text-dark fs-16 fw-semibold">{item.title}:</p>
            </div>
            <div
              className="col-12 col-md-3"
              style={{
                overflowWrap: "anywhere",
                textWrap: "wrap",
              }}
            >
              <p className="mb-0 fs-14">{item.value}</p>
            </div>
          </React.Fragment>
        );
      })}
      {data?.invoice_url && (
        <div className="col-12">
          <div
            className="position-relative border rounded-3 p-2 shadow-sm"
            style={{
              background: "#f9f9f9",
              display: "inline-block",
              maxWidth: "280px",
            }}
          >
            {/* Download Icon Button */}
            <button
              className="btn btn-light btn-sm position-absolute top-0 end-0 shadow-sm"
              onClick={() =>
                handleDownload(`${imageBaseUrl}${data.invoice_url}`)
              }
              title="Download Invoice"
              style={{
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "2px",
              }}
            >
              <Icon icon="bi:download" className="text-primary" />
            </button>

            {/* Label */}
            <p
              className="mb-2 fw-semibold text-secondary text-center"
              style={{ fontSize: "14px" }}
            >
              Invoice Preview
            </p>

            {/* Image */}
            <img
              src={`${imageBaseUrl}${data.invoice_url}`}
              alt="Invoice"
              className="img-fluid rounded"
              style={{
                maxHeight: "200px",
                objectFit: "contain",
                backgroundColor: "#fff",
                border: "1px solid #eaeaea",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
