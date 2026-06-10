import dayjs from "dayjs";
import { _upload_image } from "../DAL/Uploads/imageUpload";
import { enqueueSnackbar } from "notistack";
import { Avatar, Tooltip } from "@mui/material";
import moment from "moment/moment";
import { imageBaseUrl } from "../config/config";

export const STATUS = [
  {
    name: "Active",
    value: true,
    class: "crops-active-status",
  },
  {
    name: "Inactive",
    value: false,
    class: "crops-inactive-status",
  },
];

export const PAYMENTSTATUS = [
  {
    name: "Paid",
    value: "paid",
    class: "crops-active-status",
  },
  {
    name: "Due",
    value: "Due",
    class: "crops-due-status",
  },

  {
    name: "Unpaid",
    value: "Unpaid",
    class: "crops-inactive-status",
  },
  {
    name: "cancelled",
    value: "cancelled",
    class: "crops-inactive-status",
  },
  {
    name: "Succeeded",
    value: "Succeeded",
    class: "crops-active-status",
  },
  {
    name: "Registration",
    value: "Registration",
    class: "crops-reg-status",
  },
  {
    name: "Monthly",
    value: "Monthly",
    class: "crops-monthly-status",
  },
  {
    name: "Yearly",
    value: "Yearly",
    class: "crops-yearly-status",
  },
  {
    name: "Upcoming",
    value: "pending",
    class: "crops-due-status",
  },
  {
    name: "Due",
    value: "due",
    class: "crops-inactive-status",
  },
];

export const show_proper_words = (text) => {
  let replace_string = "";
  if (text) {
    // Replace hyphens and underscores with spaces
    replace_string = text?.replace(/[-_]/g, " ");
    // Capitalize the first letter of every word
    replace_string = replace_string
      .split(" ")
      .map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      .join(" ");
  }

  return replace_string;
};

export function truncateString(str, maxLength) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + " ... ";
  }
  return str;
}

export function generateRandomPassword(length = 8) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

export const NotificationsIconProvider = (notification) => {
  return notification.notification_type === "clear_funds"
    ? "solar:cash-out-bold"
    : notification.notification_type === "topup_request"
      ? "iconoir:hand-cash"
      : notification.notification_type === "appeal_account"
        ? "carbon:request-quote"
        : notification.notification_type === "transaction"
          ? "tabler:cash-move-back"
          : notification.notification_type === "affiliate_payout"
            ? "hugeicons:affiliate"
            : notification.notification_type === "support_ticket"
              ? "mdi:ticket"
              : notification.notification_type === "subscription"
                ? "mdi:card-account-details-outline"
                : "mdi:bell";
};

export const notificationPaperStyle = {
  paper: {
    elevation: 0,
    sx: {
      "& .MuiMenu-list": {
        paddingBottom: "0px",
      },
      width: 400,
      maxHeight: "calc(100vh - 100px)",
      overflow: "hidden",
      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.14))",
      mt: 0.5,
      "& .MuiAvatar-root": {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: "background.paper",
        transform: "translateY(-50%) rotate(45deg)",
        zIndex: 0,
      },
    },
  },
};

export const fShortenNumber = (num) => {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(2) + "T";
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + "K";
  } else {
    return num;
  }
};

export const validateField = (value, fieldName, minLength, maxLength) => {
  console.log(value, fieldName, minLength, maxLength);

  return; // No error
};

export const first_last_name_validation = (
  value,
  fieldName = "First Name",
  minLength = 3,
  maxLength = 12,
) => {
  console.log(value, fieldName, minLength, maxLength);

  // if (trimmedValue.length < minLength) {
  //   return `${fieldName} must be at least ${minLength} characters long`;
  // }

  // if (trimmedValue.length > maxLength) {
  //   return `${fieldName} cannot be more than ${maxLength} characters long`;
  // }

  // if (!/^[a-zA-Z]+$/.test(trimmedValue)) {
  //   return `${fieldName} must contain only letters (a-z, A-Z)`;
  // }

  // if (trimmedValue.includes(" ")) {
  //   return `${fieldName} cannot contain spaces between characters`;
  // }

  return ""; // No error
};

export const validateOnlyCharacters = (value, fieldName) => {
  const trimmedValue = value?.trim() || "";

  // Check for non-letter characters
  if (!/^[a-zA-Z]+$/.test(trimmedValue)) {
    return `${fieldName} must contain only letters (a-z, A-Z)`;
  }

  return ""; // Valid
};

export const validateUsername = (username, fieldName = "Username") => {
  const trimmed = username?.trim() || "";

  if (/^[0-9]/.test(trimmed)) {
    return `${fieldName} cannot start with a number`;
  }

  // 2. Length check
  if (trimmed.length < 4 || trimmed.length > 25) {
    return `${fieldName} must be between 6 and 20 characters`;
  }

  // 3. Allowed characters: a-z, A-Z, 0-9, _
  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
    return `${fieldName} can only contain letters, numbers, and hyphens`;
  }

  // 4. Cannot start or end with _
  if (/^-|-$/.test(trimmed)) {
    return `${fieldName} cannot start or end with an hyphen`;
  }

  return ""; // ✅ Valid username
};

export const validatePhoneNumber = (
  phoneNumber,
  fieldName = "Phone number",
) => {
  const trimmed = phoneNumber?.trim() || "";

  // 1. Required

  if (trimmed.length < 10 || trimmed.length > 15) {
    return `${fieldName} must be between 10 and 15 digits`;
  }

  // 2. Only digits and optional '+' at start
  if (/^[a-zA-Z]+$/.test(trimmed)) {
    return `${fieldName} must contain only numbers`;
  }

  // 3. Remove + if exists, then check length

  return ""; // ✅ Valid
};

export const validatePassword = (password, fieldName = "Password") => {
  const trimmed = password?.trim() || "";

  // 1. Required
  if (trimmed === "") {
    return `${fieldName} is required`;
  }

  if (fieldName === "Password") {
    if (trimmed.length < 8) {
      return `${fieldName} must be at least 8 characters long`;
    }
  }

  // // 2. Minimum length
  // if (trimmed.length < 8) {
  //   return `${fieldName} must be at least 8 characters long`;
  // }
  // if (trimmed.length > 16) {
  //   return `${fieldName} must be less than 16 characters long`;
  // }

  // // 3. At least one letter
  // if (!/[a-zA-Z]/.test(trimmed)) {
  //   return `${fieldName} must contain at least one letter`;
  // }

  // // 4. At least one number
  // if (!/\d/.test(trimmed)) {
  //   return `${fieldName} must contain at least one number`;
  // }

  // 5. (Optional) At least one symbol
  // if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(trimmed)) {
  //   return `${fieldName} must contain at least one special character`;
  // }

  // 6. No spaces
  // if (/\s/.test(trimmed)) {
  //   return `${fieldName} cannot contain spaces`;
  // }

  return ""; // ✅ Valid
};

export const validateUsernameOnChange = (username, fieldName = "Username") => {
  const trimmed = username?.trim() || "";

  if (trimmed === "") {
    return "";
  }

  // 1. Length check
  if (trimmed.length < 4 || trimmed.length > 25) {
    return "Use 4 to 25 characters";
  }

  // 2. No spaces allowed
  if (trimmed.includes(" ")) {
    return `${fieldName} cannot contain spaces`;
  }

  // 3. Only letters, digits, hyphens allowed
  if (!/^[a-zA-Z0-9-]+$/.test(trimmed)) {
    return `${fieldName} can only contain letters, numbers, and hyphens (-)`;
  }

  // 4. Cannot start or end with hyphen
  if (/^-|-$/.test(trimmed)) {
    return `${fieldName} cannot start or end with a hyphen (-)`;
  }
  // 5 cannot start with number
  if (/^\d/.test(trimmed)) {
    return `${fieldName} cannot start with a number`;
  }

  return ""; // ✅ Valid
};

export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "0.00"; // handle empty/invalid values
  return Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (date) => {
  if (date == null) return "N/A"; // handle empty/invalid values
  return dayjs(date).format("YYYY-MM-DD");
};

export const formatPriceToFixed = (price) => {
  if (price == null || isNaN(price)) return "0.00"; // handle empty/invalid values
  return Number(price).toFixed(2);
};

export const uploadImage = async (imageFile) => {
  if (!imageFile) return null; // Skip if no file or already a URL
  if (typeof imageFile === "string") return imageFile;

  const formData = new FormData();
  formData.append("image", imageFile);
  console.log(...formData);
  try {
    const uploadResponse = await _upload_image(formData);
    if (uploadResponse.code === 200) {
      return uploadResponse.path; // Return uploaded image path
    } else {
      enqueueSnackbar(uploadResponse.message, { variant: "error" });
      return null;
    }
  } catch (error) {
    enqueueSnackbar("Image upload failed!", { variant: "error" });
    return null;
  }
};

export const ToLocalString = (number) => {
  if (typeof number === "number") {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return number || "0.00";
};

export const ShowFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`;
};

export const handleCheckIsLocalHost = () => {
  // if (window.location.origin === "http://localhost:1501") {
  //   return true;
  // }

  // return false;
  return true;
};

export const permission_string =
  "You don't have permission to perform this action.";

export const formatFullName = (first_name, last_name) => {
  if (!first_name && !last_name) {
    return "N/A";
  }
  return `${first_name} ${last_name}`;
};

const ActionInfoColumn = (row) => {
  const column = (
    <div className="d-flex align-items-center pointer customer-info-main">
      <Avatar
        className="custom-avatar shadow-sm"
        src={imageBaseUrl + row?.action_info?.profile_image}
        alt={row?.action_info?.first_name}
      />

      <div className="d-flex flex-column flex-grow-1 gap-1">
        <div className="d-flex align-items-center justify-content-between">
          <span
            className="fw-bold text-dark customer-name-text max-width-160 fs-14"
            title={row?.customer?.name}
          >
            {formatFullName(
              row?.action_info?.first_name,
              row?.action_info?.last_name,
            ) || "N/A"}
          </span>
        </div>

        {row?.action_info?.email && (
          <div className="d-flex align-items-center gap-2">
            <span className="fs-10 customer-section-icon">📧</span>
            <span
              className="text-muted fs-12 mb-1"
              title={row?.action_info?.email}
            >
              {row?.action_info?.email ?? "No email"}
            </span>
          </div>
        )}

        {row?.action_info?.phone_number && (
          <div className="d-flex align-items-center gap-2">
            <span className="fs-10 customer-section-icon">📱</span>
            <span className="text-muted fs-12">
              {row?.action_info?.phone_number}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return column;
};

export const actionInfoObject = {
  id: "",
  label: "Action By",
  renderData: (row) => {
    return ActionInfoColumn(row);
  },
};

const isValidDate = (value) => dayjs(value).isValid();

export const CustomDateFormatter = (
  date,
  is_time = false,
  isDayjsObject = false,
) => {
  const validDayJsObject = isValidDate(date);
  if (!date) return "N/A";

  if (isDayjsObject && validDayJsObject) {
    return dayjs(date).format("DD-MM-YYYY");
  }
  return is_time
    ? moment.utc(date).format("DD-MM-YYYY hh:mm A")
    : moment.utc(date).format("DD-MM-YYYY");
};

export const LEAD_SOURCES = [
  { name: "Facebook Ads", value: "facebook_ads" },
  { name: "WhatsApp", value: "whatsapp" },
  { name: "Direct Call", value: "direct_call" },
  { name: "Walk-in", value: "walk-in" },
  { name: "Instagram", value: "instagram" },
  { name: "Website Form", value: "website_form" },
  { name: "Referral", value: "referral" },
];

export const REFERRAL_RELATIONS = [
  { name: "Friend", value: "friend" },
  { name: "Family", value: "family" },
  { name: "Colleague", value: "colleague" },
  { name: "Business Partner", value: "business_partner" },
  { name: "Other", value: "other" },
];
