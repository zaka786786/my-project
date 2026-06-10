import React, { useEffect, useState } from "react";
import { useAdminContext } from "../../Hooks/AdminContext";
import { Button, Box, Tabs, Tab } from "@mui/material";
import {
  _find_business_data_type_base_for_admin,
  _update_business_by_id_v1,
} from "../../DAL/BusinessConfiguration/business_settings";
import { enqueueSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Iconify from "../../components/Iconify";
import { _upload_image } from "../../DAL/Uploads/imageUpload";
import { _get_common_business_categories } from "../../DAL/BusinessCategories/business_categories";

// Import the tab components
import BusinessBasicInfoTab from "./components/BusinessBasicInfoTab";
import BusinessGeneralSettingsTab from "./components/BusinessGeneralSettingsTab";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import { _is_user_name_exist } from "../../DAL/CommonApis/CommonApis";
import {
  validateField,
  validatePhoneNumber,
  first_last_name_validation,
  validatePassword,
} from "../../utils/constant";
import { _add_business_customer } from "../../DAL/BusinessCustomers/business_customers";
import ConfirmationAlert from "../../components/ConfirmationAlert";
import moment from "moment";
import FbrInfo from "./components/FbrInfo";
import { encryptPassword } from "../../utils/constant_new";
import BusinessSettingsTab from "./components/BusinessSettingsTab";
import PaymentSettingsTab from "./components/PaymentSettingsTab";
import { validateBasicInfo } from "./constants";

const BusinessConfiguration = ({ type }) => {
  const currentDate = new Date();
  const navigate = useNavigate();
  const { user_id } = useParams();
  const isDemo = type && type === "demo";

  // NTN/CNIC validation helper function
  const validateNTNCNIC = (value) => {
    if (!value) return false;

    // Remove any dashes or spaces for validation
    const cleanValue = value.replace(/[- ]/g, "");

    // Check if all characters are numeric
    if (!/^\d+$/.test(cleanValue)) {
      return false;
    }

    // CNIC validation (13 digits) or Business NTN validation (7-8 digits)
    return (
      cleanValue?.length === 13 ||
      cleanValue?.length === 7 ||
      cleanValue?.length === 8
    );
  };

  const [optionsData, setOptionsData] = useState({
    businessTypeList: [],
    paymentsPlansList: [],
  });
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const [activeTab, setActiveTab] = useState(0);
  const [BreadCrumTitle, setBreadCrumTitle] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isShowDigital, setIsShowDigital] = useState(false);
  const [isShowPOS, setIsShowPOS] = useState(false);

  const defaultFormInputs = {
    clone_from: null,
    business_account_type: isDemo ? "demo" : "real",
    user_id: "",
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    password: "",
    phone_number: "",
    profile_image: "",
    status: true,
    clone_data: "settings_data",
    address: "",
    category: {
      _id: "",
      title: "",
      alias_title: "",
    },
    business_name: "",
    currency: { code: "PKR", name: "Pakistan Rupee", symbol: "₨" },
    product_types: [{ value: "standard", label: "Standard" }],
    business_logo: "",
    favicon: "",
    // New Payment Plan fields
    payment_plan: null,
    invoice_start_date: "",
    upfront_payment: "",
    want_to_use_fbr_invoice: false,
    fbr_secret_token: "",
    somewhatcheckcomehere: false,
    use_fbr_invoice: false,
    address: "",
    city: "",
    province: "",
    ntn_cnic: "",
    fbr_production_secret_key: "",
    fbr_environment: "sandbox",
    two_factor_auth: false,
    show_fbr_info_in_settings_and_payments: false,
    terms_description_for_invoice: "",
    // Business Settings
    // fbr_invoicing: "digital",
    pos_service_fee: "0.00",
    digital_invoicing_service_fee: "0.00",
    remaining_amount_in_next_invoice: true,
    business_terms_description_for_invoice: "",
    // Payment Settings Tab
    monthly_invoices_allowed: "0",
    backup_of_years: "0",
    staff_login_allowed: "0",
    business_year_start: "",
    business_year_end: "",
    branches_allowed: "0",
    warehouses_allowed: "0",
    yearly_storage_records_allowed: "0",
    barcode_generation_and_scanning: false,
    validate_fbr_data: true,
    show_products: "all",
    //
    invoice_reporting_method: [],
    default_invoice_reporting_method: "",
    //
    pos_environment: "sandbox",
    pos_id_for_sandbox: "",
    pos_id_for_production: "",
    pos_secret_key_for_sandbox: "",
    pos_secret_key_for_production: "",
  };

  const [formInputs, setFormInputs] = useState(defaultFormInputs);
  const [isLoading, setLoading] = useState(true);
  const handleImageRemove = (name) => {
    setFormInputs((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleFormInputsChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;
    setFormInputs((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const validateBusinessGeneralSettings = () => {
    let isStartDate = true;
    // if (formInputs?.payment_plan && !formInputs?.payment_plan?.is_plan_free) {
    //   if (!formInputs?.invoice_start_date) {
    //     isStartDate = false;
    //   }
    // }
    return (
      formInputs.business_name.trim() !== "" &&
      formInputs?.currency?.name !== "" &&
      formInputs?.currency !== null &&
      formInputs.category &&
      formInputs.category._id !== "" &&
      // formInputs.payment_plan !== null &&
      // formInputs.payment_plan !== undefined &&
      formInputs.product_types?.length > 0 &&
      // validateNTNCNIC(formInputs.ntn_cnic) &&
      formInputs.city !== "" &&
      formInputs.province !== "" &&
      formInputs.address !== "" &&
      isStartDate
    );
  };

  const validateBusinessSettings = () => {
    return (
      formInputs.invoice_reporting_method?.length > 0 &&
      formInputs?.default_invoice_reporting_method !== "" &&
      // formInputs.pos_service_fee !== "" &&
      // formInputs.digital_invoicing_service_fee !== "" &&
      formInputs.show_products !== "" &&
      (formInputs.remaining_amount_in_next_invoice !== null ||
        formInputs.remaining_amount_in_next_invoice !== undefined ||
        formInputs.remaining_amount_in_next_invoice !== "") &&
      formInputs.monthly_invoices_allowed >= 0 &&
      formInputs.monthly_invoices_allowed != "" &&
      formInputs.staff_login_allowed >= 0 &&
      formInputs.staff_login_allowed != "" &&
      formInputs.backup_of_years >= 0 &&
      formInputs.backup_of_years != "" &&
      formInputs.business_year_start !== "" &&
      formInputs.business_year_end !== "" &&
      formInputs.branches_allowed >= 0 &&
      formInputs.branches_allowed != "" &&
      formInputs.warehouses_allowed >= 0 &&
      formInputs.warehouses_allowed != "" &&
      formInputs.yearly_storage_records_allowed >= 0 &&
      formInputs.yearly_storage_records_allowed != "" &&
      formInputs.barcode_generation_and_scanning !== null &&
      formInputs.barcode_generation_and_scanning !== undefined &&
      formInputs.validate_fbr_data !== null &&
      formInputs.validate_fbr_data !== undefined
    );
  };

  const ValidateFBRInfo = () => {
    let isValidData = true;
    // if (
    //   formInputs.use_fbr_invoice == "" ||
    //   formInputs.want_to_use_fbr_invoice == ""
    // ) {
    //   // isValidData = false;
    // }
    // if (formInputs.show_fbr_info_in_settings_and_payments == "") {
    //   isValidData = false;
    // }
    if (formInputs?.use_fbr_invoice && formInputs?.want_to_use_fbr_invoice) {
      if (isShowDigital) {
        if (
          formInputs.fbr_secret_token == "" ||
          formInputs.fbr_environment == "" ||
          formInputs.fbr_production_secret_key == "" ||
          formInputs.digital_invoicing_service_fee == ""
        ) {
          isValidData = false;
        }
      }

      if (isShowPOS) {
        if (
          formInputs.pos_environment == "" ||
          formInputs.pos_id_for_sandbox == "" ||
          formInputs.pos_id_for_production == "" ||
          formInputs.pos_secret_key_for_sandbox == "" ||
          formInputs.pos_secret_key_for_production == "" ||
          formInputs.pos_service_fee == ""
        ) {
          isValidData = false;
        }
      }
    }

    return isValidData;
  };

  const validateFormBasicInfo = () => {
    let firstNameError = first_last_name_validation(
      formInputs.first_name,
      "First Name",
      3,
      12,
    );
    if (firstNameError) {
      enqueueSnackbar(firstNameError, {
        variant: "error",
      });
      return false;
    }

    let lastNameError = validateField(formInputs.last_name, "Last Name", 2, 12);
    if (lastNameError) {
      enqueueSnackbar(lastNameError, {
        variant: "error",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formInputs.email.trim())) {
      enqueueSnackbar("Please enter a valid email address", {
        variant: "error",
      });
      return false;
    }

    const phoneNumberError = validatePhoneNumber(
      formInputs.phone_number,
      "Phone number",
    );
    if (phoneNumberError) {
      enqueueSnackbar(phoneNumberError, {
        variant: "error",
      });
      return false;
    }
    if (!user_id) {
      const passwordError = validatePassword(formInputs.password, "Password");
      if (passwordError) {
        enqueueSnackbar(passwordError, {
          variant: "error",
        });
        return false;
      }
    }
    // Business category validation

    return true;
  };
  const isSaveDisabled = () => {
    switch (activeTab) {
      case 0:
        return !validateBasicInfo(formInputs);
      case 1:
        return !validateBusinessGeneralSettings();
      case 2:
        return !validateBusinessSettings();
      case 3:
        return !ValidateFBRInfo();
      default:
        return false;
    }
  };

  const handleManageDisable = (index, activeTab) => {
    if (activeTab == 0 && index > 0) {
      if (!user_id && !formInputs?.user_id) {
        return true;
      }
      if (!validateBasicInfo(formInputs)) {
        return true;
      }

      if (index == 2 || index == 3) {
        if (!validateBusinessGeneralSettings()) {
          return true;
        }
        if (!validateBusinessSettings()) {
          return true;
        }
      }
    }
    if (activeTab == 1 && index > 1) {
      if (!validateBusinessGeneralSettings()) {
        return true;
      }

      if (index == 3) {
        if (!validateBusinessSettings()) {
          return true;
        }
      }
    }
    if (activeTab == 2 && index > 2) {
      if (!validateBusinessSettings()) {
        return true;
      }
    }
    if (activeTab == 3 && index > 3) {
      if (!ValidateFBRInfo()) {
        return true;
      }
    }

    return false;
  };

  const parseString = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  };

  const handleSave = async (skipValidation = false, navigate_type) => {
    if (!skipValidation) {
      if (activeTab === 0) {
        if (!validateBasicInfo(formInputs)) {
          return;
        }

        if (!validateFormBasicInfo()) {
          return;
        }
      }
    }

    // if (formInputs?.payment_plan?.is_plan_free) {
    //   formInputs.invoice_start_date = "";
    // }
    // if (!formInputs.ntn_cnic && activeTab === 1) {
    //   enqueueSnackbar("Please Enter NTN/CNIC", { variant: "error" });
    //   return;
    // } else if (formInputs.ntn_cnic && !validateNTNCNIC(formInputs.ntn_cnic)) {
    //   enqueueSnackbar(
    //     "Please Enter Valid NTN/CNIC (7-8 digits for business NTN, 13 digits for CNIC)",
    //     {
    //       variant: "error",
    //     }
    //   );
    //   return;
    // }
    if (formInputs.ntn_cnic && !validateNTNCNIC(formInputs.ntn_cnic)) {
      enqueueSnackbar(
        "Please Enter Valid NTN/CNIC (7-8 digits for business NTN, 13 digits for CNIC)",
        {
          variant: "error",
        },
      );
      return;
    }

    if (!formInputs.province && activeTab === 1) {
      enqueueSnackbar("Please Select province", {
        variant: "error",
      });
      return;
    }

    if (!formInputs.city && activeTab === 1) {
      enqueueSnackbar("Please enter city", {
        variant: "error",
      });
      return;
    }

    if (!formInputs.address && activeTab === 1) {
      enqueueSnackbar("Please enter address", {
        variant: "error",
      });
      return;
    }

    if (formInputs.use_fbr_invoice && formInputs.want_to_use_fbr_invoice) {
      if (!formInputs.fbr_secret_token && activeTab === 3) {
        enqueueSnackbar("Please enter fbr sandbox secret key", {
          variant: "error",
        });
        return;
      }
    }

    if (formInputs.use_fbr_invoice && formInputs.want_to_use_fbr_invoice) {
      if (!formInputs.fbr_environment && activeTab === 3) {
        enqueueSnackbar("Please select fbr environment", {
          variant: "error",
        });
        return;
      }
    }

    if (formInputs.use_fbr_invoice && formInputs.want_to_use_fbr_invoice) {
      if (!formInputs.fbr_production_secret_key && activeTab === 3) {
        enqueueSnackbar("Please enter fbr production secret key", {
          variant: "error",
        });
        return;
      }
    }

    if (!formInputs?.business_name && activeTab === 1) {
      enqueueSnackbar("Please enter business name", {
        variant: "error",
      });
      return;
    }

    if (formInputs.status === undefined && activeTab === 0) {
      enqueueSnackbar("Please select status", {
        variant: "error",
      });
      return;
    }
    // if (formInputs.clone_data === undefined && activeTab === 0) {
    //   enqueueSnackbar("Please select Clone Data", {
    //     variant: "error",
    //   });
    //   return;
    // }

    // if (!formInputs?.payment_plan?.is_plan_free) {
    //   if (!formInputs?.invoice_start_date && activeTab === 1) {
    //     enqueueSnackbar("Please select invoice start date", {
    //       variant: "error",
    //     });
    //     return;
    //   }
    // }
    if (!formInputs?.currency?.code && activeTab === 1) {
      enqueueSnackbar("Please select currency", {
        variant: "error",
      });
      return;
    }
    if (!formInputs?.product_types?.length && activeTab === 1) {
      if (formInputs?.product_types?.length === 0) {
        enqueueSnackbar("Please select product types", {
          variant: "error",
        });
        return;
      }
    }

    if (!formInputs?.category?._id && activeTab === 1) {
      enqueueSnackbar("Please select business category", {
        variant: "error",
      });
      return;
    }

    // if (!formInputs?.payment_plan?.id && activeTab === 1) {
    //   enqueueSnackbar("Please select payment plan", {
    //     variant: "error",
    //   });
    //   return;
    // }

    setLoading(true);

    // Upload business logo if it's a file
    if (formInputs.business_logo instanceof File) {
      const formDataLogo = new FormData();
      formDataLogo.append("image", formInputs.business_logo);
      let resultLogo = await _upload_image(formDataLogo);
      if (resultLogo.code == 200) {
        formInputs.business_logo = resultLogo.path;
      }
    }

    // // Upload favicon if it's a file
    if (formInputs.favicon instanceof File) {
      const formDataFavicon = new FormData();
      formDataFavicon.append("image", formInputs.favicon);
      let resultFavicon = await _upload_image(formDataFavicon);
      if (resultFavicon.code == 200) {
        formInputs.favicon = resultFavicon.path;
      }
    }

    // // Upload profile image if it's a file
    if (formInputs.profile_image instanceof File) {
      const formDataProfile = new FormData();
      formDataProfile.append("image", formInputs.profile_image);
      let resultProfile = await _upload_image(formDataProfile);
      if (resultProfile.code == 200) {
        formInputs.profile_image = resultProfile.path;
      }
    }
    console.log(formInputs, "formInputs");

    console.log(
      formInputs.two_factor_auth,
      "formInputs.two_factor_auth formInputs.two_factor_auth",
    );

    const formData = {
      clone_from:
        formInputs?.clone_from?.value &&
        formInputs.business_account_type === "demo"
          ? {
              user_id: formInputs.clone_from.value,
              first_name: formInputs.clone_from.first_name,
              last_name: formInputs.clone_from.last_name,
              email: formInputs.clone_from?.user_id?.email,
            }
          : null,
      business_account_type: formInputs?.business_account_type || "real",
      two_factor_auth: formInputs?.two_factor_auth === "true" ? true : false,
      first_name: formInputs?.first_name || "",
      last_name: formInputs?.last_name || "",
      user_name: formInputs?.user_name || "",
      email: formInputs?.email || "",
      status: formInputs?.status || false,
      // clone_data: formInputs?.clone_data || "settings_data",
      phone_number: formInputs?.phone_number || "",
      profile_image: formInputs?.profile_image || "",
      address: formInputs?.address || "",
      // plan_settings: {
      //   plan_id: formInputs?.payment_plan?.id,
      //   invoice_start_date: formInputs?.invoice_start_date,
      // },
      business_settings: {
        // show_fbr_info_in_settings_and_payments:
        //   formInputs?.show_fbr_info_in_settings_and_payments === "true"
        //     ? true
        //     : false,

        terms_description_for_invoice:
          formInputs?.terms_description_for_invoice || "",
        business_address: {
          address: formInputs?.address,
          city: formInputs?.city,
          province: formInputs?.province,
        },
        ntn_cnic: formInputs?.ntn_cnic,
        currency: {
          code: formInputs?.currency?.code || "",
          name: formInputs?.currency?.name || "",
          symbol: formInputs?.currency?.symbol || "",
        },
        product_types:
          formInputs?.product_types?.map(
            (product) => product.value || product || "",
          ) || [],
        business_name: formInputs?.business_name || "",
        business_logo: formInputs?.business_logo || "",
        favicon: formInputs?.favicon || "",
        fbr_secret_token: formInputs.fbr_secret_token || "",
        want_to_use_fbr_invoice: formInputs?.want_to_use_fbr_invoice ?? false,
        use_fbr_invoice: formInputs?.use_fbr_invoice ?? false,
        fbr_production_secret_key: formInputs?.fbr_production_secret_key || "",
        fbr_environment: formInputs?.fbr_environment || "",
      },
      basic_info: validateBasicInfo(formInputs),
      business_info: validateBusinessGeneralSettings(),
    };
    if (formInputs.business_account_type !== "demo") {
      delete formData.clone_from;
    }
    if (activeTab === 0 && !user_id) {
      delete formData.plan_settings;
    }
    if (formInputs?.password && activeTab === 0 && !formInputs?.user_id) {
      formData.password = encryptPassword(formInputs?.password);
    }

    if (formInputs?.category?._id) {
      formData.category = {
        _id: formInputs?.category?._id || "",
        title: formInputs?.category?.title || "",
        alias_title: formInputs?.category?.alias_title || "",
      };
    }

    if (isDemo && !user_id) {
      formData.clone_data = formInputs?.clone_data || "settings_data";
    }

    let response;
    if (!user_id && activeTab === 0 && !formInputs?.user_id) {
      response = await _add_business_customer(formData);
      if (response?.code === 200) {
        setFormInputs((prev) => ({
          ...prev,
          user_id: response?.business?.user_id?._id,
        }));
        console.log(
          response?.business?.user_id?._id,
          "formInputs?.user_id after",
        );
      }
    } else {
      const id = user_id || formInputs?.user_id;

      let postDataBasicInfo = {
        type: "basic_info",
        clone_from:
          formInputs?.clone_from?.value &&
          formInputs.business_account_type === "demo"
            ? {
                user_id: formInputs.clone_from.value,
                first_name: formInputs.clone_from.first_name,
                last_name: formInputs.clone_from.last_name,
                email: formInputs.clone_from.email,
              }
            : null,
        business_account_type: formInputs?.business_account_type || "real",
        first_name: formInputs?.first_name || "",
        last_name: formInputs?.last_name || "",
        email: formInputs?.email || "",
        two_factor_auth: formInputs?.two_factor_auth === "true" ? true : false,
        phone_number: formInputs?.phone_number || "",
        status: formInputs?.status ?? false,
        profile_image: formInputs?.profile_image || "",
        // user_name: formInputs?.user_name || "",
        // password: formInputs?.password
        //   ? encryptPassword(formInputs.password)
        //   : undefined, // Only if new user
      };
      if (isDemo && !user_id) {
        postDataBasicInfo.clone_data =
          formInputs?.clone_data || "settings_data";
      }
      // clone_data: formInputs?.clone_data || "settings_data",

      if (formInputs.business_account_type !== "demo") {
        delete postDataBasicInfo.clone_from;
      }

      let postDataGeneralSetting = {
        type: "general_settings",
        business_name: formInputs?.business_name || "",
        ntn_cnic: formInputs?.ntn_cnic || "",
        business_address: {
          address: formInputs?.address || "",
          city: formInputs?.city || "",
          province: formInputs?.province || "",
        },
        currency: {
          code: formInputs?.currency?.code || "",
          name: formInputs?.currency?.name || "",
          symbol: formInputs?.currency?.symbol || "",
        },
        product_types:
          formInputs?.product_types?.map((p) => p.value || p) || [],
        category: {
          _id: formInputs?.category?._id || "",
          title: formInputs?.category?.title || "",
          alias_title: formInputs?.category?.alias_title || "",
        },

        // show_fbr_info_in_settings_and_payments:
        //   formInputs?.show_fbr_info_in_settings_and_payments,
        // plan_id: formInputs?.payment_plan?.id,
        // invoice_start_date: formInputs?.invoice_start_date || "",
        business_logo: formInputs?.business_logo || "",
        favicon: formInputs?.favicon || "",
      };

      let postDataBusinessSetting = {
        type: "business_settings",
        business_portal_settings: {
          invoice_reporting_method: formInputs?.invoice_reporting_method,
          default_invoice_reporting_method:
            formInputs?.default_invoice_reporting_method,
          validate_fbr_data: formInputs?.validate_fbr_data,
          show_products: formInputs?.show_products,
          remaining_amount_in_next_invoice:
            formInputs?.remaining_amount_in_next_invoice,
          terms_description_for_invoice:
            formInputs?.business_terms_description_for_invoice,
          monthly_invoices_allowed: formInputs?.monthly_invoices_allowed,
          backup_of_years: formInputs?.backup_of_years,
          staff_login_allowed: formInputs?.staff_login_allowed,
          business_year_start: formInputs?.business_year_start,
          business_year_end: formInputs?.business_year_end,
          branches_allowed: formInputs?.branches_allowed,
          warehouses_allowed: formInputs?.warehouses_allowed,
          yearly_storage_records_allowed:
            formInputs?.yearly_storage_records_allowed,
          barcode_generation_and_scanning:
            formInputs?.barcode_generation_and_scanning,
        },
      };

      let postDataFBRSetting = {
        type: "fbr_info",
        show_fbr_info_in_settings_and_payments:
          formInputs?.show_fbr_info_in_settings_and_payments ?? false,
        invoice_reporting_method: formInputs?.invoice_reporting_method,
        business_settings: {
          want_to_use_fbr_invoice: formInputs?.want_to_use_fbr_invoice ?? false,
          use_fbr_invoice: formInputs?.use_fbr_invoice ?? false,
          fbr_environment: formInputs?.fbr_environment || "",
          digital_invoicing_service_fee:
            formInputs?.digital_invoicing_service_fee,
          fbr_secret_token: formInputs?.fbr_secret_token || "",
          fbr_production_secret_key:
            formInputs?.fbr_production_secret_key || "",
          pos_settings: {
            environment: formInputs?.pos_environment,
            pos_id_for_sandbox: formInputs?.pos_id_for_sandbox,
            pos_secret_key_for_sandbox: formInputs?.pos_secret_key_for_sandbox,
            pos_id_for_production: formInputs?.pos_id_for_production,
            pos_secret_key_for_production:
              formInputs?.pos_secret_key_for_production,
            pos_service_fee: formInputs?.pos_service_fee,
          },
        },

        ...(formInputs?.show_fbr_info_in_settings_and_payments && {
          fbr_info: {
            transactioN_TYPE_ID: parseString(
              formInputs?.transaction_type?.code ||
                formInputs?.transaction_type ||
                "",
            ),
            transactioN_DESC: parseString(
              formInputs?.transaction_type?.description || "",
            ),
            hS_CODE: parseString(
              formInputs?.hs_code?.code || formInputs?.hs_code || "",
            ),
            description: parseString(formInputs?.rate_description || ""),
            tax_type: parseString(formInputs?.rate_value || ""),
            rate_id: parseString(formInputs?.rate_id || ""),
            uom: parseString(formInputs?.uom_id || ""),
            uom_description: parseString(formInputs?.uom_description || ""),
            scenario_id: parseString(formInputs?.scenario_id || ""),
            scenario_description: parseString(
              formInputs?.scenario_description || "",
            ),
            sale_type: parseString(formInputs?.sale_type || ""),
            sro_id: parseString(formInputs?.sro_id || ""),
            sro_serial_no: parseString(formInputs?.sro_serial_no || ""),
            sro_description: parseString(formInputs?.sro_description || ""),
            sro_item_description: parseString(
              formInputs?.sro_item_description?.description ||
                formInputs?.sro_item_description ||
                "",
            ),
            sro_id_sale: parseString(formInputs?.sro_id_sale || ""),
            sro_serial_no_sale: parseString(
              formInputs?.sro_serial_no_sale || "",
            ),
            sro_description_sale: parseString(
              formInputs?.sro_description_sale || "",
            ),
            sro_item_description_sale: parseString(
              formInputs?.sro_item_description_sale || "",
            ),
            srO_ITEM_DESC: parseString(
              formInputs?.sro_item_description?.description ||
                formInputs?.sro_item_description ||
                "",
            ),
            srO_ITEM_ID: parseString(
              formInputs?.sro_item_id || formInputs?.sro_id || "",
            ),
          },
        }),
      };
      let finalPostObject = {};

      if (activeTab === 0) {
        finalPostObject = postDataBasicInfo;
      } else if (activeTab === 1) {
        finalPostObject = postDataGeneralSetting;
      } else if (activeTab === 2) {
        finalPostObject = postDataBusinessSetting;
      } else if (activeTab === 3) {
        finalPostObject = postDataFBRSetting;
      }

      if (!validateBusinessGeneralSettings() && activeTab === 1) {
        enqueueSnackbar(
          "Please complete all required General Settings fields.",
          {
            variant: "error",
          },
        );
        setLoading(false);
        return;
      }

      if (!validateBusinessSettings() && activeTab === 2) {
        enqueueSnackbar(
          "Please complete all required Business Settings fields.",
          {
            variant: "error",
          },
        );
        setLoading(false);
        return;
      }

      if (!ValidateFBRInfo() && activeTab === 3) {
        enqueueSnackbar(
          "Please complete all required FBR information fields.",
          {
            variant: "error",
          },
        );
        setLoading(false);
        return;
      }
      // let business_portal_settings = {
      //   invoice_reporting_method: formInputs?.invoice_reporting_method,
      //   default_invoice_reporting_method:
      //     formInputs?.default_invoice_reporting_method,
      //   remaining_amount_in_next_invoice:
      //     formInputs?.remaining_amount_in_next_invoice,
      //   // pos_service_fee: formInputs?.pos_service_fee,
      //   // digital_invoicing_service_fee:
      //   //   formInputs?.digital_invoicing_service_fee,
      //   terms_description_for_invoice:
      //     formInputs?.business_terms_description_for_invoice,
      //   monthly_invoices_allowed: formInputs?.monthly_invoices_allowed,
      //   backup_of_years: formInputs?.backup_of_years,
      //   business_year_start: formInputs?.business_year_start,
      //   business_year_end: formInputs?.business_year_end,
      //   branches_allowed: formInputs?.branches_allowed,
      //   warehouses_allowed: formInputs?.warehouses_allowed,
      //   yearly_storage_records_allowed:
      //     formInputs?.yearly_storage_records_allowed,
      //   barcode_generation_and_scanning:
      //     formInputs?.barcode_generation_and_scanning,
      //   staff_login_allowed: formInputs?.staff_login_allowed,
      //   show_products: formInputs?.show_products,
      //   validate_fbr_data: formInputs?.validate_fbr_data,
      // };

      // let pos_settings = {
      //   environment: formInputs?.pos_environment,
      //   pos_id_for_sandbox: formInputs?.pos_id_for_sandbox,
      //   pos_id_for_production: formInputs?.pos_id_for_production,
      //   pos_secret_key_for_sandbox: formInputs?.pos_secret_key_for_sandbox,
      //   pos_secret_key_for_production:
      //     formInputs?.pos_secret_key_for_production,
      //   pos_service_fee: formInputs?.pos_service_fee,
      // };

      // let postData = {
      //   ...formData,
      //   business_portal_settings: business_portal_settings,
      // };
      // formData.business_settings.pos_settings = pos_settings;
      // formData.business_settings.digital_invoicing_service_fee =
      //   formInputs?.digital_invoicing_service_fee; //

      if (user_id) {
        delete finalPostObject.clone_from;
        delete finalPostObject.business_account_type;
      }
      response = await _update_business_by_id_v1(id, finalPostObject);
      console.log("finalPostObject __finalPostObject", finalPostObject);
      if (response?.code === 200) {
        handleMove(navigate_type);
      }
    }

    if (response?.code === 200) {
      // setFormInputs((prev) => {
      //   return {
      //     ...prev,
      //   };
      // });
      enqueueSnackbar(response.message, {
        variant: "success",
      });
      if (activeTab === 0) {
        handleMove(navigate_type);
        setActiveTab(1);
      } else if (activeTab === 1) {
        handleMove(navigate_type);
        // setActiveTab(2);
      } else if (activeTab === 2) {
        handleMove(navigate_type);
        // setActiveTab(3);
      }
      setLoading(false);
    } else {
      enqueueSnackbar(response.message, {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const handleMove = (navigate_type) => {
    if (navigate_type == "exit") {
      const pathNavigate = isDemo
        ? "/demo-business-accounts"
        : "/business-customer";
      navigate(pathNavigate);
    }
  };
  const fetchSettings = async () => {
    setLoading(true);
    const id = user_id;
    // const response = await Get_Business(id);

    let postData = {
      type: "basic_info_general_settings",
    };
    const response = await _find_business_data_type_base_for_admin(
      id,
      postData,
    );

    if (response.code === 200) {
      setLoading(false);
      let business_portal_settings =
        response?.business?.business_portal_settings || {};
      let fbrInfo = response?.business?.business_settings?.fbr_info || {};
      let business_settings = response?.business?.business_settings || {};
      const newFormInputs = {
        clone_from:
          response?.business?.clone_from?.user_id &&
          response?.business?.business_account_type === "demo"
            ? {
                value: response?.business?.clone_from?.user_id,
                label: response?.business?.clone_from?.first_name
                  ? `${response?.business?.clone_from?.first_name} ${response?.business?.clone_from?.last_name}`
                  : response?.business?.clone_from?.user_id?.email || "N/A",
              }
            : null,
        business_account_type:
          response?.business?.business_account_type || "real",
        two_factor_auth:
          Boolean(response?.business?.user_id?.two_factor_auth) ?? false,
        show_fbr_info_in_settings_and_payments:
          Boolean(
            response?.business?.business_settings
              ?.show_fbr_info_in_settings_and_payments,
          ) ?? false,

        fbr_production_secret_key:
          response?.business?.business_settings?.fbr_production_secret_key,
        fbr_environment:
          response?.business?.business_settings?.fbr_environment || "sandbox",
        // payment_plan: response?.business?.plan_settings
        //   ? {
        //       id: response?.business?.plan_settings?.plan?._id || "",
        //       label: response?.business?.plan_settings?.plan?.name || "",
        //       is_plan_free:
        //         response?.business?.plan_settings?.plan?.is_plan_free,
        //     }
        //   : null,

        invoice_start_date: response?.business?.plan_settings
          ?.invoice_start_date
          ? moment(
              response?.business?.plan_settings?.invoice_start_date,
            ).format("YYYY-MM-DD")
          : "",
        user_id: response?.business?.user_id?._id || "",
        first_name: response?.business?.first_name || "",
        last_name: response?.business?.last_name || "",
        user_name: response?.business?.user_id?.user_name || "",
        email: response?.business?.user_id?.email || "",
        phone_number: response?.business?.phone_number || "",
        profile_image: response?.business?.profile_image || "",
        status: response?.business?.status || false,
        address: response?.business?.address || "",
        category: response?.business?.category
          ? {
              _id: response?.business?.category?._id || "",
              title: response?.business?.category?.title || "",
              alias_title: response?.business?.category?.alias_title || "",
            }
          : null,
        business_name:
          response?.business?.business_settings?.business_name || "",
        currency: response?.business?.business_settings?.currency
          ? {
              code: response?.business?.business_settings?.currency?.code || "",
              name: response?.business?.business_settings?.currency?.name || "",
              symbol:
                response?.business?.business_settings?.currency?.symbol || "",
            }
          : null,
        product_types:
          response?.business?.business_settings?.product_types?.length > 0
            ? response?.business?.business_settings?.product_types
            : [
                {
                  label: "Standard",
                  value: "standard",
                },
              ],
        business_logo:
          response?.business?.business_settings?.business_logo || "",
        favicon: response?.business?.business_settings?.favicon || "",
        want_to_use_fbr_invoice:
          response?.business?.business_settings?.want_to_use_fbr_invoice ||
          false,
        fbr_secret_token:
          response?.business?.business_settings?.fbr_secret_token || "",
        use_fbr_invoice:
          response?.business?.business_settings?.use_fbr_invoice ?? false,

        ntn_cnic: response?.business?.business_settings?.ntn_cnic,
        province:
          response?.business?.business_settings?.business_address?.province,
        city: response?.business?.business_settings?.business_address?.city,
        address:
          response?.business?.business_settings?.business_address?.address,

        //  Business Settings
        invoice_reporting_method:
          business_portal_settings?.invoice_reporting_method || [],
        default_invoice_reporting_method:
          business_portal_settings?.default_invoice_reporting_method || "",
        remaining_amount_in_next_invoice:
          business_portal_settings?.remaining_amount_in_next_invoice || true,
        // pos_service_fee: business_portal_settings?.pos_service_fee || "0.00",
        // digital_invoicing_service_fee:
        //   business_portal_settings?.digital_invoicing_service_fee || "0.00",
        business_terms_description_for_invoice:
          business_settings?.terms_description_for_invoice || "",
        monthly_invoices_allowed:
          business_portal_settings?.monthly_invoices_allowed || "0",
        backup_of_years: business_portal_settings?.backup_of_years || "0",
        business_year_start:
          business_portal_settings?.business_year_start || "",
        business_year_end: business_portal_settings?.business_year_end || "",
        branches_allowed: business_portal_settings?.branches_allowed || "0",
        warehouses_allowed: business_portal_settings?.warehouses_allowed || "0",
        yearly_storage_records_allowed:
          business_portal_settings?.yearly_storage_records_allowed || "0",
        barcode_generation_and_scanning:
          business_portal_settings?.barcode_generation_and_scanning || false,
        staff_login_allowed:
          business_portal_settings?.staff_login_allowed || "0",
        show_products: business_portal_settings?.show_products || "all",
        validate_fbr_data: business_portal_settings?.validate_fbr_data || false,

        digital_invoicing_service_fee:
          business_settings?.digital_invoicing_service_fee || "0.00",

        pos_environment:
          business_settings?.pos_settings?.environment || "sandbox",
        pos_id_for_sandbox:
          business_settings?.pos_settings?.pos_id_for_sandbox || "",

        pos_id_for_production:
          business_settings?.pos_settings?.pos_id_for_production || "",

        pos_secret_key_for_sandbox:
          business_settings?.pos_settings?.pos_secret_key_for_sandbox || "",

        pos_secret_key_for_production:
          business_settings?.pos_settings?.pos_secret_key_for_production || "",
        pos_service_fee: business_settings?.pos_settings?.pos_service_fee || "",

        //
        hs_code: fbrInfo?.hS_CODE
          ? {
              code: fbrInfo?.hS_CODE,
              description: fbrInfo?.description || fbrInfo?.hS_CODE_DESC,
            }
          : null,

        transaction_type: fbrInfo?.transactioN_TYPE_ID
          ? {
              code: Number(fbrInfo?.transactioN_TYPE_ID),
              description: fbrInfo?.transactioN_DESC || "N/A",
            }
          : null,

        uom: fbrInfo?.uom || "",
        uom_id: fbrInfo?.uom || "",
        uom_description: fbrInfo?.uom_description || "",

        rate_id: fbrInfo?.rate_id ? Number(fbrInfo?.rate_id) : "",
        rate_value: fbrInfo?.tax_type ? Number(fbrInfo?.tax_type) : "",
        rate_description: fbrInfo?.description || "",

        sro_id: fbrInfo?.sro_id,
        sro_serial_no: fbrInfo?.sro_serial_no,
        sro_description: fbrInfo?.sro_description,

        sro_item_description: fbrInfo?.srO_ITEM_ID
          ? {
              srO_ITEM_ID: fbrInfo.srO_ITEM_ID,
              description: fbrInfo?.srO_ITEM_DESC,
              srO_ITEM_DESC: fbrInfo?.srO_ITEM_DESC,
            }
          : null,

        scenario: fbrInfo?.sro_id
          ? {
              value: fbrInfo?.sro_id,
              label: fbrInfo?.sro_description,
              sro_id: fbrInfo?.sro_id,
              sro_serial_no: fbrInfo?.sro_serial_no,
              sro_description: fbrInfo?.sro_description,
              sro_item_description:
                fbrInfo?.sro_item_description || fbrInfo?.srO_ITEM_DESC,
            }
          : null,

        scenario_sale: fbrInfo?.sro_id_sale
          ? {
              sro_id_sale: fbrInfo?.sro_id_sale,
              sro_serial_no_sale: fbrInfo?.sro_serial_no_sale,
              sro_description_sale: fbrInfo?.sro_description_sale,
              sro_item_description_sale: fbrInfo?.sro_item_description_sale,
            }
          : null,
      };

      setFormInputs(newFormInputs);
      setBreadCrumTitle(
        response?.business?.first_name + " " + response?.business?.last_name,
      );
      setLoading(false);
    } else {
      enqueueSnackbar(response.message, { variant: "error" });
      setLoading(false);
    }
  };
  const get_business_types = async (type) => {
    if (
      type === "business_category" &&
      optionsData.businessTypeList?.length > 0
    ) {
      return;
    }
    const postData = {
      type: type,
    };
    try {
      const response = await _get_common_business_categories(postData);
      if (response.code === 200) {
        if (type === "business_category") {
          setOptionsData((prev) => ({
            ...prev,
            businessTypeList: response?.data || [],
          }));
        } else if (type === "plan") {
          setOptionsData((prev) => ({
            ...prev,
            paymentsPlansList:
              response?.data?.map((plan) => ({
                ...plan,
                id: plan._id,
                label: plan.name,
              })) || [],
          }));
        }
      } else {
        enqueueSnackbar(response.message || "Failed to fetch data", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(
        "Something went wrong while fetching business categories",
        { variant: "error" },
      );
    }
  };
  useEffect(() => {
    if (user_id) {
      fetchSettings();
    } else {
      setLoading(false);
    }
    get_business_types("business_category");
    get_business_types("plan");
    setNavBarTitle(
      user_id ? "Edit Business Customer" : "Add Business Customer",
    );
    setIsBackButton(false);
  }, []);

  useEffect(() => {
    console.log(
      "formInputs.invoice_reporting_method ___formInputs_in_fbr",
      formInputs?.invoice_reporting_method,
    );

    const reportingMethod = formInputs?.invoice_reporting_method;

    if (Array.isArray(reportingMethod) && reportingMethod?.length > 0) {
      if (reportingMethod.includes("digital_invoicing")) {
        setIsShowDigital(true);
      } else {
        setIsShowDigital(false);
      }

      if (reportingMethod.includes("pos_invoicing")) {
        setIsShowPOS(true);
      } else {
        setIsShowPOS(false);
      }
    } else {
      setIsShowDigital(false);
      setIsShowPOS(false);
    }
  }, [formInputs?.invoice_reporting_method]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const tabs = [
    {
      label: "Basic Info",
      icon: "mdi:account-edit",
      isValid: validateBasicInfo(formInputs),
    },
    ...(formInputs?.business_account_type === "real"
      ? [
          {
            label: "General Settings",
            icon: "mdi:office-building-cog",
            isValid: validateBusinessGeneralSettings(),
          },
        ]
      : []),
    // {
    //   label: "Business Settings",
    //   icon: "mdi:office-building-cog",
    //   isValid: validateBusinessSettings(),
    // },

    // {
    //   label: "Fbr Info",
    //   icon: "mdi:cog",
    //   isValid: ValidateFBRInfo(),
    // },
  ];
  const breadCrumbMenu = [
    {
      title: "Business",
      navigation: isDemo ? "/demo-business-accounts" : "/business-customer",
      active: false,
    },
    {
      title: user_id ? BreadCrumTitle : "Add Business Customer",
      active: true,
    },
  ];

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="container-fluid p-0 position-relative mt-3">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <div className="col-12 display-flex mb-3">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
      </Box>

      {/* Custom Tabs */}
      <Box sx={{ pl: 0 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="business configuration tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              minWidth: 0,
              fontWeight: 700,
              fontSize: "1rem",
              padding: "12px 12px",
              marginRight: "5px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor: "#f4f4f4",
              borderBottom: "3px solid ",
            },
          }}
        >
          {tabs?.map((tab, index) => {
            // ✨ Decide if the tab should be disabled based on index and validation

            // if (!user_id && activeTab === 0) {
            //   disabled = true;
            // }

            let disabled =
              activeTab === index
                ? false
                : handleManageDisable(index, activeTab);

            return (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {tab.label}
                    {user_id && (
                      <>
                        {tab.isValid ? (
                          <CheckCircleIcon
                            sx={{ color: "success.main", fontSize: 18 }}
                          />
                        ) : (
                          <CancelIcon
                            sx={{ color: "error.main", fontSize: 18 }}
                          />
                        )}
                      </>
                    )}
                  </Box>
                }
                disabled={disabled}
              />
            );
          })}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <BusinessBasicInfoTab
          formInputs={formInputs}
          handleFormInputsChange={handleFormInputsChange}
          setFormInputs={setFormInputs}
          user_id={user_id}
          isDemo={isDemo}
        />
      )}

      {activeTab === 1 && (
        <BusinessGeneralSettingsTab
          setFormInputs={setFormInputs}
          formInputs={formInputs}
          handleFormInputsChange={handleFormInputsChange}
          handleImageRemove={handleImageRemove}
          businessTypeList={optionsData.businessTypeList}
          paymentsPlansList={optionsData.paymentsPlansList}
        />
      )}
      {activeTab === 2 && (
        <BusinessSettingsTab
          formInputs={formInputs}
          setFormInputs={setFormInputs}
          handleFormInputsChange={handleFormInputsChange}
        />
      )}

      {activeTab === 3 && (
        <FbrInfo
          fbrData={{
            want_to_use_fbr_invoice: formInputs?.want_to_use_fbr_invoice,
            use_fbr_invoice: formInputs.use_fbr_invoice,
            show_fbr_info_in_settings_and_payments:
              formInputs?.show_fbr_info_in_settings_and_payments,
            fbr_environment: formInputs.fbr_environment,
            fbr_secret_token: formInputs.fbr_secret_token,
            fbr_production_secret_key: formInputs.fbr_production_secret_key,
            pos_environment: formInputs.pos_environment,
            pos_id_for_sandbox: formInputs.pos_id_for_sandbox,
            pos_id_for_production: formInputs.pos_id_for_production,
            pos_secret_key_for_sandbox: formInputs.pos_secret_key_for_sandbox,
            pos_secret_key_for_production:
              formInputs.pos_secret_key_for_production,
            //
            transaction_type: formInputs?.transaction_type,
            rate_id: formInputs?.rate_id,
            rate_description: formInputs?.rate_description,
            rate_value: formInputs?.rate_value,
            hs_code: formInputs?.hs_code,
            uom_id: formInputs?.uom_id,
            uom_description: formInputs?.uom_description,
          }}
          handleFormInputsChange={handleFormInputsChange}
          onChange={(fbrData) => setFormInputs({ ...formInputs, ...fbrData })}
          setFormInputs={setFormInputs}
          formInputs={formInputs}
          isShowDigital={isShowDigital}
          isShowPOS={isShowPOS}
          user_id={user_id || formInputs?.user_id}
        />
      )}

      {/* {activeTab === 3 && (
        <TaxSettingsTab
          formInputs={formInputs}
          handleFormInputsChange={handleFormInputsChange}
        />
      )} */}

      {/* Save Button */}
      <div
        className="col-12 d-flex justify-content-end position-fixed"
        style={{ bottom: 20, right: 20 }}
      >
        {activeTab > 0 && (
          <Button
            variant="outlined"
            onClick={() => setActiveTab(activeTab - 1)}
            type="submit"
            className="capitalized button-in-listing d-flex align-items-center justify-content-center me-2 bg-white-transparent"
          >
            <Iconify
              className="me-1"
              icon="material-symbols:arrow-back"
              fontSize={16}
            />
            Previous
          </Button>
        )}

        <Button
          variant="contained"
          onClick={() => handleSave(false, "exit")}
          disabled={isSaveDisabled()}
          type="submit"
          className="capitalized button-in-listing d-flex align-items-center justify-content-center ms-2"
        >
          Save & Exit
          <Iconify
            className="ms-1"
            icon="material-symbols:exit-to-app"
            fontSize={16}
          />
        </Button>

        {formInputs.business_account_type === "real" && (
          <span>
            <Button
              variant="contained"
              onClick={() => handleSave(false, "next")}
              // disabled={
              //   activeTab === 0
              //     ? !validateBasicInfo(formInputs)
              //     : false || activeTab === 1
              //     ? !validateBusinessGeneralSettings()
              //     : false || activeTab === 3
              //     ? !validateBusinessSettings()
              //     : false
              // }
              disabled={isSaveDisabled()}
              type="submit"
              className="  capitalized button-in-listing d-flex align-items-center justify-content-center  ms-2"
              // startIcon={<Iconify icon="mdi:content-save" />}
            >
              {activeTab === 1 ? "Submit" : "Save & Next"}

              <Iconify
                className="ms-1"
                icon={
                  activeTab === 1
                    ? "material-symbols:check-circle"
                    : "material-symbols:arrow-forward"
                }
                fontSize={16}
              />
            </Button>
          </span>
        )}
      </div>

      <ConfirmationAlert
        open={showConfirmation}
        isLoading={false}
        setOpen={setShowConfirmation}
        title="Some details are missing. We’ll save your progress, but you can’t log in yet."
        buttonText="Proceed to Save"
        handleAgree={() => {
          setShowConfirmation(false);
          handleSave(true); // CALL AGAIN to proceed with save
        }}
      />
    </div>
  );
};

export default BusinessConfiguration;
