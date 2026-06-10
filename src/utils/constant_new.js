import { tokenKey } from "../config/config";
import CryptoJS from "crypto-js";
import { _upload_image } from "../DAL/Uploads/imageUpload";
import { enqueueSnackbar } from "notistack";

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

export const validateInputs = (
  inputs,
  stringFields,
  arrayFields,
  objectFields,
  BoleanFields,
  NumberFields,
  optionalFields = [], // Optional fields that can be empty
) => {
  const errors = {};

  const validateNestedObject = (obj, parentKey = "") => {
    // Object.entries(obj).forEach(([key, value]) => {
    //   const fullKey = parentKey ? `${parentKey}.${key}` : key;
    //   // Skip validation for optional fields
    //   if (optionalFields.includes(fullKey)) {
    //     return;
    //   }
    //   if (
    //     value === null ||
    //     value === undefined ||
    //     value === "" ||
    //     value === "Invalid date"
    //   ) {
    //     errors[fullKey] = `${fullKey} is required`;
    //   } else if (typeof value === "object" && !Array.isArray(value)) {
    //     validateNestedObject(value, fullKey); // Recursively validate nested objects
    //   }
    // });
  };

  BoleanFields?.forEach((field) => {
    if (typeof inputs[field] !== "boolean") {
      errors[field] = `${field} must be a boolean`;
    }
  });

  NumberFields?.forEach((field) => {
    if (isNaN(inputs[field])) {
      errors[field] = `${field} must be a number`;
    }
  });

  stringFields?.forEach((field) => {
    if (
      typeof inputs[field] !== "string" ||
      inputs[field].trim() === "" ||
      inputs[field].trim() === "Invalid date"
    ) {
      errors[field] = `${field} is required`;
    }
  });

  arrayFields?.forEach((field) => {
    if (!Array.isArray(inputs[field]) || inputs[field].length === 0) {
      errors[field] = `${field} cannot be empty`;
    }
  });

  objectFields?.forEach((field) => {
    if (
      typeof inputs[field] !== "object" ||
      inputs[field] === null ||
      Object.keys(inputs[field]).length === 0 ||
      Array.isArray(inputs[field])
    ) {
      errors[field] = `${field} must be an object`;
      return;
    }
    const nestedObject = inputs[field];
    if (
      !nestedObject ||
      typeof nestedObject !== "object" ||
      Object.keys(nestedObject).length === 0
    ) {
      if (!optionalFields.includes(field)) {
        errors[field] = `${field} cannot be empty`;
      }
    } else {
      validateNestedObject(nestedObject, field); // Validate nested object keys
    }
  });

  return errors;
};

export const formatString = (str) => {
  return str
    .split("_") // Split the string by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words with spaces
};

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

export const CreateSelectStyle = {
  width: "100%",
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#fff", // Ensure solid background
    zIndex: 9999, // Ensure it overlays everything else
  }),
  control: (provided) => ({
    ...provided,
    borderColor: "#ced4da", // Bootstrap-like border
    boxShadow: "none",
    "&:hover": {
      borderColor: "#adb5bd",
    },
  }),
};

export const uploadImage = async (imageFile) => {
  if (!imageFile) return null; // Skip if no file or already a URL
  if (typeof imageFile === "string") return imageFile;

  const formData = new FormData();
  formData.append("image", imageFile);

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

export const encryptToken = (token) => {
  return CryptoJS.AES.encrypt(token, tokenKey).toString();
};

export const decryptToken = (token) => {
  try {
    return CryptoJS.AES.decrypt(token, tokenKey).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return ""; // Return empty string if decryption fails
  }
};

export function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export const _set_user_email_in_localStorage = (email) => {
  localStorage.setItem("email", email);
};

export const _get_user_email_in_localStorage = () => {
  localStorage.getItem("email");
};

export const _set_password_in_localStorage = (password) => {
  localStorage.setItem("password", password);
};

export const _get_password_in_localStorage = () => {
  localStorage.getItem("password");
};

export const _set_token_in_localStorage = (token) => {
  localStorage.setItem("token", encryptToken(token));
};

export const _set_user_in_localStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const encryptPassword = (token) => {
  return CryptoJS.AES.encrypt(token, tokenKey).toString();
};

export const getPathFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    let firstSegment = path.split("/").filter(Boolean)[0];

    return firstSegment ? `/${firstSegment}` : "/";
  } catch (error) {
    console.error("Invalid URL:", error);
    return "/";
  }
};

export const LEADS_PRIVILEGE = {
  filter_buttons: true,
  export_data: true,
  download_csv: true,
  add_lead: true,
  change_assign_to: true,
  edit_lead: true,
  lead_delete: true,
  customer_remarks: true,
  Lead_history: true,
};
