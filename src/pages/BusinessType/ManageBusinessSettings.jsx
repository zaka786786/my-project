import React, { useEffect, useState } from "react";
import CircularLoader from "../../components/loaders/CircularLoader";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAdminContext } from "../../Hooks/AdminContext";
import {
  _find_business_category_by_id,
  _get_business_settings_of_business_category,
  _update_business_category_business_settings,
} from "../../DAL/BusinessCategories/business_categories";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import BusinessSettingsTab from "../BusinesConfiguration/components/BusinessSettingsTab";
import { Button } from "@mui/material";

const defaultFormInputs = {
  invoice_reporting_method: [],
  remaining_amount_in_next_invoice: true,
  barcode_generation_and_scanning: false,
  validate_fbr_data: true,
  default_invoice_reporting_method: "",
  show_products: "all",
  business_year_start: "",
  business_year_end: "",
  monthly_invoices_allowed: "0",
  staff_login_allowed: "0",
  backup_of_years: "0",
  branches_allowed: "0",
  warehouses_allowed: "0",
  yearly_storage_records_allowed: "0",
};

const ManageBusinessSettings = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { category_id } = useParams();
  const from = new URLSearchParams(window.location.search).get("from");
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState(null);
  const [formInputs, setFormInputs] = useState(defaultFormInputs);

  const validateBusinessSettings = () => {
    return (
      formInputs.invoice_reporting_method.length > 0 &&
      formInputs?.default_invoice_reporting_method !== "" &&
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

  const handleFormInputsChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;
    setFormInputs((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleMove = () => {
    navigate("/business-category");
    setIsButtonLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let postDataBusinessSetting = {
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

    setIsButtonLoading(true);
    const response = await _update_business_category_business_settings(
      category_id,
      postDataBusinessSetting,
    );

    if (response?.code === 200) {
      enqueueSnackbar(response.message, {
        variant: "success",
      });
      handleMove();
    } else {
      enqueueSnackbar(response.message, {
        variant: "error",
      });
      setIsButtonLoading(false);
    }
  };

  const get_category_detail = async () => {
    setIsLoading(true);

    try {
      const response =
        await _get_business_settings_of_business_category(category_id);
      if (response.code === 200) {
        setCategoryDetail(response?.category || null);
        let business_portal_settings =
          response?.business_settings?.business_portal_settings || {};
        let business_settings =
          response?.business_settings?.business_settings || {};

        const newFormInputs = {
          invoice_reporting_method:
            business_portal_settings?.invoice_reporting_method || [],
          default_invoice_reporting_method:
            business_portal_settings?.default_invoice_reporting_method || "",
          remaining_amount_in_next_invoice:
            business_portal_settings?.remaining_amount_in_next_invoice || true,
          business_terms_description_for_invoice:
            business_settings?.terms_description_for_invoice || "",
          monthly_invoices_allowed:
            business_portal_settings?.monthly_invoices_allowed || "0",
          backup_of_years: business_portal_settings?.backup_of_years || "0",
          business_year_start:
            business_portal_settings?.business_year_start || "",
          business_year_end: business_portal_settings?.business_year_end || "",
          branches_allowed: business_portal_settings?.branches_allowed || "0",
          warehouses_allowed:
            business_portal_settings?.warehouses_allowed || "0",
          yearly_storage_records_allowed:
            business_portal_settings?.yearly_storage_records_allowed || "0",
          barcode_generation_and_scanning:
            business_portal_settings?.barcode_generation_and_scanning || false,
          staff_login_allowed:
            business_portal_settings?.staff_login_allowed || "0",
          show_products: business_portal_settings?.show_products || "all",
          validate_fbr_data:
            business_portal_settings?.validate_fbr_data || false,
        };

        setFormInputs(newFormInputs);
      } else {
        enqueueSnackbar(response.message || "Failed to fetch data", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(
        "Something went wrong while fetching business category detail.",
        { variant: "error" },
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setNavBarTitle("Manage Business Settings");
    setIsBackButton(false);
    get_category_detail();
  }, [category_id]);

  const breadCrumbMenu = [
    {
      title: `Business Category ${
        categoryDetail?.title ? `(${categoryDetail?.title})` : ""
      }`,
      navigation: "/business-category",
      active: false,
    },
    {
      title: "Manage Business Settings",
      active: true,
    },
  ];

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="mb-2">
      <div className="col-12 d-flex my-3">
        <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
      </div>

      <form onSubmit={handleSave}>
        <BusinessSettingsTab
          formInputs={formInputs}
          setFormInputs={setFormInputs}
          handleFormInputsChange={handleFormInputsChange}
        />

        <div className="col-12 d-flex justify-content-end fixed_button">
          <Button
            variant="contained"
            disabled={!validateBusinessSettings() || isButtonLoading}
            type="submit"
            className="capitalized button-in-listing d-flex align-items-center justify-content-center ms-2"
          >
            {isButtonLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageBusinessSettings;
