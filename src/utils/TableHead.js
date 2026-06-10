import CustomImageAvatar from "../components/CustomImageAvatar";
import { imageBaseUrl } from "../config/config";
import { formatDate, formatPriceToFixed } from "./constant";
import { formatFullName } from "./domUtils";

export const getTableHead = (type) => {
  if (type === "dashboard_upcoming_invoices_business") {
    const TABLE_HEAD_DASHBOARD_UPCOMING_INVOICES_BUSINESS = [
      { id: "number", label: "#", type: "number" },
      {
        id: "logo",
        label: "PROFILE",
        className: "typography-color-in-table",
        renderData: (row) => {
          return (
            <div className="d-flex align-items-center mb-0 gap-2">
              <div>
                <CustomImageAvatar
                  imageUrl={imageBaseUrl + row.profile_image}
                  altText={formatFullName(row.first_name, row.last_name)}
                  size={60}
                />
              </div>
              <div className="d-flex flex-column">
                <div>
                  <div className="fw-bold fs-12">
                    {formatFullName(row.first_name, row.last_name)}
                  </div>
                </div>

                {row?.user_id?.email && (
                  <div>
                    <div className="fs-12">{row?.user_id?.email}</div>
                  </div>
                )}
                {row?.phone_number && (
                  <div>
                    <div className="fs-12">{row?.phone_number}</div>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "category",
        label: "BUSINESS TYPE",
        className: "typography-color-in-table",
      },
      {
        id: "business_name",
        label: "Company Name",
        className: "typography-color-in-table",
      },
      {
        id: "next_invoice_date",
        label: "Next Invoice Date",
        className: "typography-color-in-table",
        type: "date",
        renderData: (row) => {
          return <div>{formatDate(row?.next_invoice_date)}</div>;
        },
      },
    ];
    return TABLE_HEAD_DASHBOARD_UPCOMING_INVOICES_BUSINESS;
  }
  if (type === "dashboard_paid_business_customers") {
    const TABLE_HEAD_DASHBOARD_PAID_BUSINESS_CUSTOMERS = [
      { id: "number", label: "#", type: "number" },
      {
        id: "logo",
        label: "PROFILE",
        className: "typography-color-in-table",
        renderData: (row) => {
          return (
            <div className="d-flex align-items-center mb-0 gap-2">
              <div>
                <CustomImageAvatar
                  imageUrl={imageBaseUrl + row.profile_image}
                  altText={formatFullName(row.first_name, row.last_name)}
                  size={60}
                />
              </div>
              <div className="d-flex flex-column">
                <div>
                  <div className="fw-bold fs-12">
                    {formatFullName(row.first_name, row.last_name)}
                  </div>
                </div>

                {row?.user_id?.email && (
                  <div>
                    <div className="fs-12">{row?.user_id?.email}</div>
                  </div>
                )}
                {row?.phone_number && (
                  <div>
                    <div className="fs-12">{row?.phone_number}</div>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "category",
        label: "BUSINESS TYPE",
        className: "typography-color-in-table",
      },
      {
        id: "business_name",
        label: "Company Name",
        className: "typography-color-in-table",
      },
    ];
    return TABLE_HEAD_DASHBOARD_PAID_BUSINESS_CUSTOMERS;
  }
  if (type === "dashboard_on_trial_business") {
    const TABLE_HEAD_DASHBOARD_ON_TRIAL_BUSINESS = [
      { id: "number", label: "#", type: "number" },
      {
        id: "logo",
        label: "PROFILE",
        className: "typography-color-in-table",
        renderData: (row) => {
          return (
            <div className="d-flex align-items-center mb-0 gap-2">
              <div>
                <CustomImageAvatar
                  imageUrl={imageBaseUrl + row.profile_image}
                  altText={formatFullName(row.first_name, row.last_name)}
                  size={60}
                />
              </div>
              <div className="d-flex flex-column">
                <div>
                  <div className="fw-bold fs-12">
                    {formatFullName(row.first_name, row.last_name)}
                  </div>
                </div>

                {row?.user_id?.email && (
                  <div>
                    <div className="fs-12">{row?.user_id?.email}</div>
                  </div>
                )}
                {row?.phone_number && (
                  <div>
                    <div className="fs-12">{row?.phone_number}</div>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "category",
        label: "BUSINESS TYPE",
        className: "typography-color-in-table",
      },
      {
        id: "business_name",
        label: "Company Name",
        className: "typography-color-in-table",
      },
    ];
    return TABLE_HEAD_DASHBOARD_ON_TRIAL_BUSINESS;
  }
  if (type === "dashboard_business_list") {
    const TABLE_HEAD_DASHBOARD_BUSINESS_LIST = [
      { id: "number", label: "#", type: "number" },
      {
        id: "logo",
        label: "PROFILE",
        className: "typography-color-in-table",
        renderData: (row) => {
          return (
            <div className="d-flex align-items-center mb-0 gap-2">
              <div>
                <CustomImageAvatar
                  imageUrl={imageBaseUrl + row.profile_image}
                  altText={row.full_name}
                  size={60}
                />
              </div>
              <div className="d-flex flex-column">
                {row?.full_name && (
                  <div>
                    <div className="fw-bold fs-12">{row?.full_name}</div>
                  </div>
                )}
                {row?.email && (
                  <div>
                    <div className="fs-12">{row?.email}</div>
                  </div>
                )}
                {row?.contact_number && (
                  <div>
                    <div className="fs-12">{row?.contact_number}</div>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "business_type",
        label: "BUSINESS TYPE",
        className: "typography-color-in-table",
      },
      {
        id: "company_name",
        label: "Company Name",
        className: "typography-color-in-table",
      },
    ];
    return TABLE_HEAD_DASHBOARD_BUSINESS_LIST;
  }
  if (type === "dashboard_recent_payments") {
    const TABLE_HEAD_DASHBOARD_RECENT_PAYMENTS = [
      { id: "number", label: "#", type: "number" },
      {
        id: "business",
        label: "Business Info",
        className: "typography-color-in-table",
        renderData: (row) => {
          console.log("row", row);
          return (
            <div className="d-flex align-items-center mb-0">
              <CustomImageAvatar
                size={60}
                imageUrl={imageBaseUrl + row?.business?.image}
                altText={row?.business?.image}
                name={formatFullName(
                  row?.business?.first_name,
                  row?.business?.last_name,
                )}
              />
              <div className="ms-3" style={{ cursor: "pointer" }}>
                <p className="mb-0 fw-bold text-capitalize fs-12">
                  {formatFullName(
                    row?.business?.first_name,
                    row?.business?.last_name,
                  )}
                </p>
                <p className="mb-0 fs-12">{row?.business?.email}</p>
                <p className="mb-0 fs-12">{row?.business?.phone_number}</p>
              </div>
            </div>
          );
        },
      },
      {
        id: "total_paid_amount",
        label: "Total Paid Amount",
        className: "typography-color-in-table",
        renderData: (row) => (
          <span className="text-capitalize">
            Rs {formatPriceToFixed(row?.total_paid_amount)}
          </span>
        ),
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
        id: "createdAt",
        label: "Payment Date",
        className: "typography-color-in-table",
        renderData: (row) => <span>{formatDate(row?.date)}</span>,
      },
    ];
    return TABLE_HEAD_DASHBOARD_RECENT_PAYMENTS;
  }

  return [];
};
