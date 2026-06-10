import React, { useEffect, useRef, useState } from "react";
import { Avatar, InputAdornment, TextField, Tooltip } from "@mui/material";
import { imageBaseUrl, projectMode } from "../../../config/config";
import { formatDate, formatPrice, ShowFullName } from "../../../utils/constant";
import dayjs from "dayjs";
import { _Change_Status } from "../../../DAL/CommonApis/CommonApis";
import { enqueueSnackbar, useSnackbar } from "notistack";
import StatusDropDown from "../../../components/StatusDropDown";
import { show_proper_words } from "../../../utils/constant_new";
import { CopyAll } from "@mui/icons-material";
import CustomPopoverSectionItems from "../../../components/menuOption/CustomPopoverSectionItems";
import MenuPopover from "../../../components/menuOption/MenuPopover";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { _delete_business_customer } from "../../../DAL/BusinessCustomers/business_customers";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import ChangePassword from "./ChangePassword";
import OtpVerificationModal from "../../../components/OtpVerificationModal";
import {
  loginAsBusinessCustomer,
  Update_Expiry_Date,
} from "../../../DAL/BusinessConfiguration/business_settings";
import ExpiryDateModal from "../ExpiryDateModal";

function Copy(text, label) {
  navigator.clipboard.writeText(text);
  enqueueSnackbar(`${label} copied to clipboard`, { variant: "success" });
}
const ClipBoardIcon = ({ item }) => {
  return (
    <CopyAll
      className="pointer fs-16 primary-text ms-1"
      onClick={() => Copy(item.value, item.label)}
    />
  );
};

const currentDay = dayjs().startOf("day");

const UserBasicDetails = ({
  customer,
  setCustomerData = () => {},
  id,
  fetchCustomerData = () => {},
  tabValue,
  setInitialLoading = () => {},
  show = false,
}) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [modalStateChangePassword, setModalStateChangePassword] =
    useState(false);
  const [rowData, setRowData] = useState(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [openExpiryModal, setOpenExpiryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [prevExpiryDate, setPrevExpiryDate] = useState(null);
  const [initialRender, setInitialRender] = useState(true);
  const [expiresIn, setExpiresIn] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [nextInvoiceDate, setNextInvoiceDate] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [nextExpiryDate, setNextExpiryDate] = useState("");

  console.log(customer, "customercustomercustomercustomercustomer");

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleDelete = async () => {
    setDelLoading(true);
    const response = await _delete_business_customer(id);
    if (response?.code === 200) {
      enqueueSnackbar(
        response?.message || "Business type deleted successfully",
        {
          variant: "success",
        },
      );
      setOpenDelete(false);
      navigate("/business-customer");
    } else {
      enqueueSnackbar(response?.message || "Failed to delete business type", {
        variant: "error",
      });
      setOpenDelete(false);
    }
    setDelLoading(false);
  };

  const handleAgreeDelete = () => {
    setOpenDelete(true);
  };

  const handleClickSettings = () => {
    const isDemo = customer?.business_account_type === "demo";
    if (!isDemo) {
      navigate(`/business-customer/settings/${id}`);
    } else {
      navigate(`/demo-business-accounts/settings/${id}`);
    }
  };

  const handleClickChangePassword = (row) => {
    setModalStateChangePassword(true);
    setRowData(row);
  };

  const handleLoginAsBusiness = (row) => {
    setOtpModalOpen(true);
    setLoginData(row);
    setLoginModalOpen(true);
  };

  const handleClickFBRSettings = (row) => {
    navigate(
      `/business-customer/manage-fbr-settings/${row?.user_id._id}?from=${"basicDetails"}`,
    );
  };

  const handleClickChangeNavAccess = (row) => {
    navigate(
      `/business-customer/navAccess/business/${row?.user_id._id}?from=${"basicDetails"}`,
    );
  };

  const handleClickPlanSettings = (row) => {
    navigate(
      `/business-customer/plan-settings/${row?.user_id._id}?from=${"basicDetails"}`,
    );
  };

  const handleClickExtendExpiry = (row) => {
    // Open expiry date modal for the selected customer
    handleOpenExpiryModal(row?.plan_settings, row);
  };

  const handleClickBusinessSettings = (row) => {
    navigate(
      `/business-customer/manage-business-settings/${row?.user_id._id}?from=${"basicDetails"}`,
    );
  };

  const handleClickPayments = (row) => {
    navigate(
      `/business-customer/payments/${row?.user_id?._id}?from=${"basicDetails"}`,
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

  const handleOtpModalClose = () => {
    setOtpModalOpen(false);
    setInitialRender(true);
    setLoginModalOpen(false);
    setLoginData(null);
    setExpiresIn(0);
    setSessionId(null);
  };

  const handleVerifyOtpForLoginAsAdmin = async (otpCode) => {
    const data = {
      email: loginData?.user_id?.email,
      otp: otpCode,
      type: 1,
      call_type: "otp",
      sessionId: sessionId,
    };
    setOtpLoading(true);
    const response = await loginAsBusinessCustomer(data);
    if (response.code === 200) {
      enqueueSnackbar(response.message || "OTP verified successfully", {
        variant: "success",
      });
      if (window?.location?.hostname === "localhost") {
        window.open(
          `http://localhost:1501/login-as-business-customer/${response?.token}`,
          "_blank",
        );
      } else if (
        projectMode === "dev" &&
        window?.location?.hostname !== "localhost"
      ) {
        window.open(
          `https://businessb2b.metadevzone.com/login-as-business-customer/${response?.token}`,
          "_blank",
        );
      } else if (
        projectMode === "prod" &&
        window?.location?.hostname !== "localhost"
      ) {
        window.open(
          `https://hisabkitabportal.metadevzone.com/login-as-business-customer/${response?.token}`,
          "_blank",
        );
      }
      handleOtpModalClose();
      setLoginData(null);
      setOtpLoading(false);
    } else {
      setOtpLoading(false);
      enqueueSnackbar(response.message || "Failed to login as business", {
        variant: "error",
      });
    }
  };

  const handleVerifyOtpForExpiryDate = async (otpCode) => {
    try {
      const userId = selectedCustomer?.customerId;
      const updateData = {
        next_invoice_date: new Date(nextInvoiceDate || "").toISOString(),
        expiry_date: new Date(nextExpiryDate || "").toISOString(),
        otp: otpCode,
        call_type: "otp",
        sessionId: sessionId,
      };
      setOtpLoading(true);
      const response = await Update_Expiry_Date(userId, updateData);
      if (response.code === 200) {
        enqueueSnackbar(
          response.message || "Subscription expiry extended successfully",
          {
            variant: "success",
          },
        );
        setInitialLoading(true);
        fetchCustomerData(tabValue, true);
        handleOtpModalClose();
        setSelectedCustomer(null);
        setPrevExpiryDate("");
        setNextExpiryDate("");
        setOtpLoading(false);
      } else {
        setOtpLoading(false);
        enqueueSnackbar(
          response.message || "Failed to extend subscription expiry",
          {
            variant: "error",
          },
        );
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while extending subscription expiry", {
        variant: "error",
      });
    } finally {
    }
  };

  const handleResendOtpForLoginAsBusiness = async (type) => {
    if (!loginData) {
      enqueueSnackbar("Unable to resend OTP", { variant: "error" });
      return;
    }
    const data = {
      email: loginData?.user_id?.email,
      type: 1,
      call_type: "generate_token",
    };
    setOtpLoading(true);
    const response = await loginAsBusinessCustomer(data);
    if (response.code === 200) {
      enqueueSnackbar(response.message || "OTP resent successfully", {
        variant: "success",
      });
      setOtpLoading(false);
      setExpiresIn(response?.expiresIn);
      setSessionId(response?.sessionId);
    } else {
      setOtpLoading(false);
      setExpiresIn(0);
      setSessionId(null);
      enqueueSnackbar(response.message || "Failed to resend OTP", {
        variant: "error",
      });
    }
  };

  // Function to resend OTP for expiry date extension
  const handleResendOtpForExpiry = async () => {
    // if (!selectedCustomer || !nextExpiryDate) {
    //   enqueueSnackbar("Unable to resend OTP", { variant: "error" });
    //   return;
    // }

    const userId = selectedCustomer?.customerId;
    const updateData = {
      next_invoice_date: new Date(nextInvoiceDate || "").toISOString(),
      expiry_date: new Date(nextExpiryDate || "").toISOString(),
      call_type: "extend_expiry",
    };
    try {
      setOtpLoading(true);
      const response = await Update_Expiry_Date(userId, updateData);

      if (response.code === 200) {
        setExpiresIn(response?.expiresIn);
        setSessionId(response?.sessionId);
        enqueueSnackbar(response?.message || "OTP resent successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(response.message || "Failed to resend OTP", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while resending OTP", {
        variant: "error",
      });
    }
    setOtpLoading(false);
  };

  const handleOtpModalOpen = () => {
    setOtpModalOpen(true);
  };

  const handleSendOtpForExpiryDate = async () => {
    if (!selectedCustomer || !nextExpiryDate) {
      enqueueSnackbar("Please select a valid date", { variant: "error" });
      return;
    }
    if (selectedCustomer?.expiry_date) {
      const currentExpiryDate = new Date(selectedCustomer?.expiry_date || "")
        .toISOString()
        .split("T")[0];
      if (nextExpiryDate === currentExpiryDate) {
        enqueueSnackbar("Expiry Date Updated", {
          variant: "success",
        });
        handleCloseExpiryModal();
        setSelectedCustomer(null);
        setPrevExpiryDate("");
        setNextExpiryDate("");
        setOtpLoading(false);
        return;
      }
    }
    setOtpLoading(true);
    const userId = selectedCustomer?.customerId;
    const updateData = {
      next_invoice_date: new Date(nextInvoiceDate || "").toISOString(),
      expiry_date: new Date(nextExpiryDate || "").toISOString(),
      call_type: "extend_expiry",
    };
    try {
      const response = await Update_Expiry_Date(userId, updateData);
      if (response.code === 200) {
        enqueueSnackbar(response?.message || "OTP sent successfully", {
          variant: "success",
        });
        setSessionId(response?.sessionId);
        setExpiresIn(response?.expiresIn);
        handleCloseExpiryModal();
        setOtpLoading(false);
        setTimeout(() => {
          handleOtpModalOpen();
        }, 500);
      } else {
        setOtpLoading(false);
        enqueueSnackbar(
          response.message || "Failed to extend subscription expiry",
          {
            variant: "error",
          },
        );
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while extending subscription expiry", {
        variant: "error",
      });
    } finally {
      setOtpLoading(false);
    }
    setOtpLoading(false);
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "mdi:account-edit",
      handleClick: handleClickSettings,
    },
    {
      label: "Change Password",
      icon: "qlementine-icons:password-16",
      handleClick: handleClickChangePassword,
    },
    {
      label: "Login as Business",
      icon: "mdi:login-variant",
      handleClick: handleLoginAsBusiness,
    },
    {
      label: "Manage Nav Access",
      icon: "arcticons:agov-access",
      handleClick: handleClickChangeNavAccess,
    },
    {
      label: "Manage Business Settings",
      icon: "uil:setting",
      handleClick: handleClickBusinessSettings,
    },
    {
      label: "Manage FBR Settings",
      icon: "uil:setting",
      handleClick: handleClickFBRSettings,
    },

    {
      label: "Manage Plan Settings",
      icon: "material-symbols:credit-card-clock",
      handleClick: handleClickPlanSettings,
    },

    {
      label: "Payments",
      icon: "tdesign:undertake-transaction",
      handleClick: handleClickPayments,
    },

    {
      label: "Manage Expiry Date",
      icon: "mdi:calendar-plus",
      handleClick: handleClickExtendExpiry,
      // Only show for paid plans (not free plans)
      hidden: (row) => row?.plan_settings?.plan?.is_plan_free,
      // Add conditional styling for expired customers
      style: (row) => {
        const expiryDateStr = row?.plan_settings?.expiry_date;
        if (expiryDateStr) {
          const expiryDate = new Date(expiryDateStr || "");
          const today = new Date();
          expiryDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          const diffTime = expiryDate - today;
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          // Highlight in red if expired or expiring soon
          if (daysLeft < 0 || daysLeft <= 7) {
            return { color: "#d32f2f" }; // Red color for urgency
          }
        }
        return {};
      },
    },
    {
      color: "red",
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  const [NewMenu, setNewMenu] = useState(MENU_OPTIONS || []);

  const handleMenuSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const TrimmedSearchValue = searchValue?.trim();
    const filteredMenu = MENU_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(TrimmedSearchValue),
    );
    setNewMenu(filteredMenu);
  };

  useEffect(() => {
    if (!loginModalOpen || !otpModalOpen || !initialRender) return;
    if (initialRender) {
      setInitialRender(false);
      handleResendOtpForLoginAsBusiness();
      return;
    }
  }, [loginModalOpen, otpModalOpen, initialRender]);

  useEffect(() => {
    if (!open) {
      setNewMenu(MENU_OPTIONS);
    }
  }, [open]);

  if (customer?.status === "returned") {
  }

  console.log(customer, "customercustomercustomer");

  // 🔹 Basic Info
  const basicInfo = [
    {
      label: "Status",
      value: customer?.status ? "Active" : "Inactive",
      isShow: customer?.status !== undefined,
    },
    {
      label: "Business Name",
      value: customer?.bussiness_name,
      isShow: !!customer?.bussiness_name,
    },
    {
      label: "Category",
      value: customer?.category?.title,
      isShow: !!customer?.category?.title,
    },
    {
      label: "Business Account Type",
      value:
        customer?.business_account_type === "real"
          ? "General Account"
          : "Demo Account",
      isShow: !!customer?.business_account_type,
    },
    {
      label: "Currency",
      value: customer?.busines_currency
        ? `${customer?.busines_currency?.name} (${customer?.busines_currency?.code} - ${customer?.busines_currency?.symbol})`
        : null,
      isShow: !!customer?.busines_currency?.name,
    },
    {
      label: "Product Types",
      value: customer?.product_types?.join(", "),
      isShow: !!customer?.product_types?.length,
    },
    {
      label: " NTN / CNIC",
      value: customer?.ntn_cnic,
      isShow: !!customer?.ntn_cnic,
      isCopy: true,
    },
    {
      label: "FBR Environment",
      value: show_proper_words(customer?.fbr_environment),
      isShow: !!customer?.fbr_environment,
    },
    // {
    //   label: "FBR Sandbox Secret Token",
    //   value: customer?.fbr_secret_token,
    //   isShow: !!customer?.fbr_secret_token,
    //   isCopy: true,
    // },
    // {
    //   label: "FBR Production Secret Key",
    //   value: customer?.fbr_production_secret_key,
    //   isShow: !!customer?.fbr_production_secret_key,
    //   isCopy: true,
    // },
    {
      label: "FBR Invoicing System",
      value: customer?.use_fbr_invoice ? "Enabled" : "Disabled",
      isShow: true,
    },
    {
      label: "Data Access",
      value: show_proper_words(customer?.data_access),
      isShow: !!customer?.data_access,
    },

    {
      label: "Two Factor Authentication",
      value: customer?.two_factor_auth ? "Enabled" : "Disabled",
      isShow: true,
      component: (
        <>
          {customer?.two_factor_auth !== undefined && (
            <>
              <div className="col-12 col-md-3">
                <h6 className="fw-semibold text-dark mb-1 fs-15">
                  Two Factor Authentication:
                </h6>
              </div>
              <div className="col-12 col-md-3">
                <StatusDropDown
                  options={[
                    { name: "Enable", value: true, color: "active_status" },
                    {
                      name: "Disable",
                      value: false,
                      color: "inactive_status",
                    },
                  ]}
                  row={{
                    _id: customer?._id,
                    status: customer?.two_factor_auth,
                  }}
                  onStatusChange={(row) =>
                    updateProductStatus(row, customer, "two_factor")
                  }
                  disabled={show}
                />
              </div>
            </>
          )}
        </>
      ),
    },
    {
      label: "Province",
      value: customer?.province,
      isShow: !!customer?.province,
    },
    {
      label: "City",
      value: customer?.city,
      isShow: !!customer?.city,
    },
    {
      label: "Address",
      value: customer?.address,
      isShow: !!customer?.address,
    },
  ];

  // 🔹 Plan Info
  const planInfo = [
    {
      label: "Plan",
      value: customer?.plan_settings?.plan?.name,
      className: "text-capitalize",
      isShow: !!customer?.plan_settings?.plan?.name,
    },
    {
      label: "Plan Type",
      value: customer?.plan_settings?.plan?.plan_type,
      className: "text-capitalize",
      isShow: !!customer?.plan_settings?.plan?.plan_type,
    },
    {
      label: "Is Free Plan",
      value: customer?.plan_settings?.plan?.is_plan_free ? "Yes" : "No",
      isShow: customer?.plan_settings?.plan?.is_plan_free !== undefined,
    },
    {
      label: "Trial Duration",
      value: customer?.plan_settings?.plan?.trial_duration
        ? `${customer?.plan_settings?.plan?.trial_duration} days`
        : null,
      isShow: customer?.plan_settings?.plan?.is_plan_free,
    },
    {
      label: "Upfront Price",
      value: customer?.plan_settings?.plan?.upfront_price
        ? `₨ ${formatPrice(customer?.plan_settings?.plan?.upfront_price)}`
        : null,
      isShow: !!customer?.plan_settings?.plan?.upfront_price,
    },
    {
      label:
        customer?.plan_settings?.plan?.plan_type === "monthly"
          ? "Monthly Installment"
          : "Yearly Installment",
      value: customer?.plan_settings?.plan?.price
        ? `₨ ${formatPrice(customer?.plan_settings?.plan?.price)}`
        : null,
      isShow: !!customer?.plan_settings?.plan?.price,
    },
    {
      label: "Grace Period",
      value: customer?.plan_settings?.plan?.grace_period
        ? `${customer?.plan_settings?.plan?.grace_period} days`
        : null,
      isShow: !!customer?.plan_settings?.plan?.grace_period,
    },
  ];

  // 🔹 Plan Dates
  const planDates = [
    {
      label: "Invoice Start Date",
      value: customer?.plan_settings?.invoice_start_date
        ? formatDate(customer?.plan_settings?.invoice_start_date)
        : null,
      isShow: !!customer?.plan_settings?.invoice_start_date,
    },
    {
      label: "Next Invoice Date",
      value: customer?.plan_settings?.next_invoice_date
        ? formatDate(customer?.plan_settings?.next_invoice_date)
        : null,
      isShow: !!customer?.plan_settings?.next_invoice_date,
    },
    {
      label: "Expiry Date",
      value: customer?.plan_settings?.expiry_date
        ? formatDate(customer?.plan_settings?.expiry_date)
        : null,
      isShow: !!customer?.plan_settings?.expiry_date,
      iShowInRed: customer?.plan_settings?.expiry_date
        ? dayjs(customer?.plan_settings?.expiry_date).isBefore(currentDay)
        : false,
    },
  ];

  console.log(
    customer?.plan_settings?.expiry_date
      ? dayjs(customer?.plan_settings?.expiry_date).isBefore(currentDay)
      : false,
    "isexpiryinred",
  );

  const fallbackImg = "https://placehold.co/100x100";
  const { enqueueSnackbar } = useSnackbar();

  const updateProductStatus = async (
    row,
    selectedCustomer,
    type = "status",
  ) => {
    console.log(row, selectedCustomer, type, "rowselectedCustomertype");

    const data = {
      type: type || "status",
      status: row?.status,
    };
    const response = await _Change_Status(
      data,
      row?.user_name || row?._id || selectedCustomer?.user_name,
    );
    const statusKey = type === "status" ? "status" : "two_factor_auth";
    if (response.code === 200) {
      setCustomerData({
        ...selectedCustomer,
        [statusKey]: row?.status,
      });
      enqueueSnackbar(response.message, { variant: "success" });
    } else {
      enqueueSnackbar(response.message, { variant: "error" });
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <div className="container-fluid mt-4">
      {/* Top Financial Summary Cards */}
      <div className="row text-dark g-3">
        <div className="col-md-3">
          <div className="bg-light border p-3 rounded text-center shadow-sm h-100">
            <h6 className="mb-1 fw-light">
              Rs {formatPrice(customer?.total_paid) || "0.00"}
            </h6>
            <small className="text-success fw-semibold">
              Total Paid Amount
            </small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="bg-light border p-3 rounded text-center shadow-sm h-100">
            <h6 className="mb-1 fw-light">
              Rs {formatPrice(customer?.total_pending) || "0.00"}
            </h6>
            <small className="text-danger fw-semibold">Total Due Amount</small>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white border mt-4 p-4 rounded shadow-sm">
        <div className="d-flex flex-column flex-md-row align-items-start gap-4 w-100">
          {/* Profile Info */}
          <div className="d-flex flex-column flex-md-row align-items-start flex-wrap w-100 gap-4">
            {/* Avatar + Name + Email */}
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center gap-3 flex-shrink-0">
                <Avatar
                  src={imageBaseUrl + customer?.profile_image || fallbackImg}
                  onError={(e) => (e.target.src = fallbackImg)}
                  alt={`${customer?.first_name} ${customer?.last_name}`}
                  className="rounded-circle border"
                  sx={{ width: 75, height: 75 }}
                />
                <div>
                  <h6 className="fw-semibold text-dark mb-1 fs-15">
                    {ShowFullName(customer?.first_name, customer?.last_name)}
                  </h6>
                  <p className="text-muted mb-0 fs-13">
                    {customer?.email}
                    <span>
                      <ClipBoardIcon
                        item={{
                          value: customer?.email,
                          label: "Email address",
                        }}
                      />
                    </span>
                  </p>
                  <p className="text-muted mb-2 fs-13">
                    {customer?.phone}{" "}
                    <span>
                      <ClipBoardIcon
                        item={{ value: customer?.phone, label: "Phone number" }}
                      />
                    </span>
                  </p>
                </div>
              </div>
              {customer?.createdAt && (
                <div className="d-flex ps-3">
                  <h6 className="fw-semibold text-dark mb-1 fs-15">
                    Created At:
                  </h6>
                  <p className="text-muted mb-2 fs-13 ps-1">
                    {dayjs(customer.createdAt).format("DD-MM-YYYY")}
                  </p>
                  <>
                    {!show && (
                      <Tooltip title={NewMenu.length === 0 ? "No options" : ""}>
                        <span>
                          <MoreVertIcon
                            style={{
                              opacity: NewMenu.length === 0 ? 0.5 : 1,
                              pointerEvents:
                                NewMenu.length === 0 ? "none" : "auto",
                            }}
                            ref={anchorRef}
                            onClick={() => setOpen(true)}
                            className="pointer"
                          />
                        </span>
                      </Tooltip>
                    )}
                    <MenuPopover
                      className="custom-popover"
                      open={open}
                      onClose={() => setOpen(false)}
                      anchorEl={anchorRef.current}
                      sx={{ marginLeft: 1.8, maxHeight: 300 }}
                      PaperProps={{
                        sx: {
                          maxHeight: 300,
                          overflow: "auto",
                        },
                      }}
                    >
                      {MENU_OPTIONS?.length > 5 && (
                        <div
                          style={{
                            padding: "8px 16px",
                          }}
                        >
                          <TextField
                            type="text"
                            placeholder="Search menus..."
                            // autoFocus
                            autoComplete="off"
                            size="small"
                            onChange={handleMenuSearch}
                            sx={{
                              zIndex: 99999,
                              "& .MuiInputBase-inputAdornedStart": {
                                paddingLeft: "0px !important",
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Icon
                                    icon="mdi:magnify"
                                    width={20}
                                    height={20}
                                    style={{ color: "#757575" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      )}
                      {NewMenu?.map((option, index) => (
                        <CustomPopoverSectionItems
                          key={index}
                          item={option}
                          data={customer}
                          setOpen={setOpen}
                        />
                      ))}
                    </MenuPopover>
                  </>
                </div>
              )}
            </div>

            {/* Info items */}
            <div className="row w-100">
              {/* Basic Information Section */}
              <div className="row">
                {basicInfo
                  .filter((item) => item.isShow && item.value)
                  .map((item, index) => (
                    <React.Fragment key={index}>
                      {item?.component ? (
                        <>{item?.component}</>
                      ) : (
                        <>
                          <div className="col-12 col-md-3">
                            <h6 className="fw-semibold text-dark mb-1 fs-15">
                              {item.label}:
                            </h6>
                          </div>
                          <div className="col-12 col-md-3">
                            <p className="text-muted mb-2 text-capitalize">
                              {item.value}
                              <span className="ms-1">
                                {item.isCopy && <ClipBoardIcon item={item} />}
                              </span>
                            </p>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  ))}

                {customer?.status !== undefined && (
                  <>
                    <div className="col-12 col-md-3">
                      <h6 className="fw-semibold text-dark mb-1 fs-15">
                        Status:
                      </h6>
                    </div>
                    <div className="col-12 col-md-3">
                      <StatusDropDown
                        currentStatus={{}}
                        row={customer}
                        onStatusChange={(row) =>
                          updateProductStatus(row, customer, "status")
                        }
                        disabled={show}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Plan Information Section */}
              {(planInfo.some((item) => item.isShow && item.value) ||
                planDates.some((item) => item.isShow && item.value)) && (
                <div className="row mt-4">
                  <div className="col-12">
                    <h5 className="fw-bold text-dark mb-3">Plan Information</h5>
                  </div>

                  {/* Plan Info Items */}
                  {planInfo
                    .filter((item) => item.isShow && item.value)
                    .map((item, index) => (
                      <React.Fragment key={`plan-${index}`}>
                        <div className="col-12 col-md-3">
                          <h6 className="fw-semibold text-dark mb-1 fs-15">
                            {item.label}:
                          </h6>
                        </div>
                        <div className="col-12 col-md-3">
                          <p className="text-muted mb-2 text-capitalize">
                            {item.value}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}

                  {/* Plan Dates Items */}
                  {planDates
                    .filter((item) => item.isShow && item.value)
                    .map((item, index) => (
                      <React.Fragment key={`date-${index}`}>
                        <div className="col-12 col-md-3">
                          <h6
                            className={`fw-semibold mb-1 fs-15  ${item?.iShowInRed ? "text-danger" : "text-dark"}`}
                          >
                            {item.label}:
                          </h6>
                        </div>
                        <div className="col-12 col-md-3">
                          <p
                            className={`mb-2 ${item?.iShowInRed ? "text-danger" : "text-muted"}`}
                          >
                            {item.value}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmation
        open={openDelete}
        isLoading={delLoading}
        setOpen={setOpenDelete}
        title={
          "Are you sure you want to delete this business customer? This action will delete all the data related to this business customer."
        }
        handleAgree={handleDelete}
      />
      <ChangePassword
        modalState={modalStateChangePassword}
        setModalState={setModalStateChangePassword}
        rowData={{
          ...rowData,
          business_id: customer?.user_name,
        }}
      />

      {/* OTP Verification For Expiry Date Change and Login as business */}
      <OtpVerificationModal
        open={otpModalOpen}
        onClose={handleOtpModalClose}
        onSubmit={(otpCode) => {
          !loginModalOpen
            ? handleVerifyOtpForExpiryDate(otpCode)
            : handleVerifyOtpForLoginAsAdmin(otpCode);
        }}
        onResend={() => {
          !loginModalOpen
            ? handleResendOtpForExpiry()
            : handleResendOtpForLoginAsBusiness();
        }}
        title="Verify OTP"
        description={`Please enter OTP ${!loginModalOpen ? "to extend the subscription expiry." : "to login as business customer."}`}
        length={6}
        expirySeconds={expiresIn}
        setExpiresIn={setExpiresIn}
        loading={otpLoading}
        showTimer={true}
        submitText="Verify"
      />
      <ExpiryDateModal
        openExpiryModal={openExpiryModal}
        handleCloseExpiryModal={handleCloseExpiryModal}
        prevExpiryDate={prevExpiryDate}
        nextExpiryDate={nextExpiryDate}
        setNextExpiryDate={setNextExpiryDate}
        nextInvoiceDate={nextInvoiceDate}
        setNextInvoiceDate={setNextInvoiceDate}
        otpLoading={otpLoading}
        handleSendOtpForExpiryDate={handleSendOtpForExpiryDate}
      />
    </div>
  );
};

export default UserBasicDetails;
