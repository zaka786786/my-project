import {
  parsePhoneNumberFromString,
  isValidPhoneNumber,
} from "libphonenumber-js";

export const validateBasicInfo = (formInputs) => {
  const errors = {};

  // First Name
  if (!formInputs?.first_name?.trim()) {
    errors.first_name = "First name is required";
  }

  // Last Name
  if (!formInputs?.last_name?.trim()) {
    errors.last_name = "Last name is required";
  }

  const parsePhoneNumber = parsePhoneNumberFromString(
    formInputs?.phone_number || "",
    "PK",
  );
  const phoneNumberObj = parsePhoneNumber?.formatInternational() || "";

  if (!isValidPhoneNumber(phoneNumberObj)) {
    errors.phone_number = "Please enter a valid phone number";
  }

  // Email
  if (!formInputs?.email?.trim()) {
    errors.email = "Email is required";
  }

  // Customer Type
  if (!formInputs?.business_account_type) {
    errors.business_account_type = "Customer type is required";
  }

  // Conditional Field
  if (formInputs?.business_account_type === "demo" && !formInputs?.clone_from) {
    errors.clone_from = "Business customer is required for demo type";
  }

  // Password
  if (formInputs?.user_id ? false : !formInputs?.password?.trim()) {
    errors.password = "Password is required";
  } else if (formInputs?.user_id ? false : formInputs?.password?.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  const isValid = Object?.keys(errors)?.length === 0;

  return isValid;
};
