import { useEffect, useState, useCallback } from "react";
import { useAdminContext } from "../../Hooks/AdminContext";
import { Button } from "@mui/material";
import {
  _find_business_data_type_base_for_admin,
  _update_business_settings_fbr_info,
} from "../../DAL/BusinessConfiguration/business_settings";
import { enqueueSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import { useParams, useNavigate } from "react-router-dom";
import Iconify from "../../components/Iconify";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import FbrInfo from "./components/FbrInfo";
import BusinessSettingsTab from "./components/BusinessSettingsTab";

const MainFBRAndBusinessSettingComponent = ({ type, businessType }) => {
  const isDemo = businessType === "demo";
  const navigate = useNavigate();
  const { user_id } = useParams();
  const from = new URLSearchParams(window.location.search).get("from");
  const { setNavBarTitle, setIsBackButton } = useAdminContext();

  const [breadCrumTitle, setBreadCrumTitle] = useState("");
  const [isShowDigital, setIsShowDigital] = useState(false);
  const [isShowPOS, setIsShowPOS] = useState(false);
  const [isShowProvincePOS, setIsShowProvincePOS] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const defaultFormInputs = {
    user_id: "",
    first_name: "",
    last_name: "",
    business_name: "",
    want_to_use_fbr_invoice: false,
    use_fbr_invoice: false,
    fbr_secret_token: "",
    fbr_production_secret_key: "",
    fbr_environment: "sandbox",
    show_fbr_info_in_settings_and_payments: false,
    pos_service_fee: "0.00",
    digital_invoicing_service_fee: "0.00",
    remaining_amount_in_next_invoice: true,
    business_terms_description_for_invoice: "",
    monthly_invoices_allowed: "0",
    backup_of_years: "0",
    staff_login_allowed: "0",
    business_year_start: "",
    business_year_end: "",
    branches_allowed: "0",
    warehouses_allowed: "0",
    yearly_storage_records_allowed: "0",
    validate_fbr_data: true,
    show_products: "all",
    invoice_reporting_method: ["pos_invoicing"],
    default_invoice_reporting_method: "pos_invoicing",
    pos_environment: "sandbox",
    pos_id_for_sandbox: "",
    pos_id_for_production: "",
    pos_secret_key_for_sandbox: "",
    pos_secret_key_for_production: "",
    province_pos_environment: "sandbox",
    province_pos_id_for_sandbox: "",
    province_pos_id_for_production: "",
    province_pos_secret_key_for_sandbox: "",
    province_pos_secret_key_for_production: "",
    use_as: "province",
    sro_item_description: null,
    rate_description: "",
    rate_value: "",
    rate_id: "",
    tax_formation: "",
    filter_date_type: "invoice_date",
    allow_ledger_creation: false,
    // add_pos_service_fee: true,
    // add_digital_invoicing_service_fee: true,
    filter_shipment_date_type: "shipment_date",
    withholding_base_amount_type: "tax_amount",
    additional_services_fee: false,
    label_for_additional_services: "",
    sale_withholding_base_amount_type: "tax_amount",
    percentage_for_additional_services: "5",
    pra_invoice_template_slug: "",
    pos_invoice_template_slug: "",
    digital_invoice_template_slug: "",
    invoice_feedback_url: "",
    barcode_generation_and_scanning: false,
    software_type: "cloud",
    allow_offline_software_update: false,
    offline_version: "",
    godown_management_allowed: false,
    allow_partial_shipment_received: false,
    show_action_info: false,
    pos_version: "pos_one",
  };

  const [formInputs, setFormInputs] = useState(defaultFormInputs);

  const handleFormInputsChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(value, "valuevaluevaluevaluevaluevalue");

    setFormInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateBusinessSettings = () => {
    const fields = [
      // formInputs.default_invoice_reporting_method,
      formInputs.show_products,
      formInputs.business_year_start,
      formInputs.business_year_end,
    ];
    return fields.every((field) => field !== "");
  };
  const validateFBRInfo = () => {
    if (formInputs?.use_fbr_invoice && formInputs?.want_to_use_fbr_invoice) {
      if (isShowDigital) {
        if (
          !formInputs.fbr_secret_token ||
          !formInputs.fbr_production_secret_key
        )
          return false;
      }
      if (isShowPOS) {
        if (
          !formInputs.pos_secret_key_for_sandbox ||
          !formInputs.pos_id_for_production
        )
          return false;
      }
      if (isShowProvincePOS) {
        if (
          !formInputs.province_pos_secret_key_for_sandbox ||
          !formInputs.province_pos_id_for_production
        )
          return false;
      }
      if (!formInputs?.tax_formation) {
        return false;
      }
    }
    return true;
  };

  const isSaveDisabled = () => {
    if (type === "business_settings") return !validateBusinessSettings();
    if (type === "fbr_info") return !validateFBRInfo();
    return false;
  };

  const parseString = (value) =>
    value === null || value === undefined ? "" : String(value).trim();

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(
      formInputs?.want_to_use_fbr_invoice,
      "formInputs?.want_to_use_fbr_invoice",
    );

    if (formInputs?.want_to_use_fbr_invoice) {
      if (formInputs?.invoice_reporting_method.length == 0) {
        enqueueSnackbar("Please select at least one invoice reporting method", {
          variant: "error",
        });
        return;
      }
    }
    setLoading(true);
    let finalPostObject = {};

    if (type === "business_settings") {
      finalPostObject = {
        type: "business_settings",
        business_portal_settings: {
          pos_version: formInputs?.pos_version || "pos_one",
          show_action_info:
            formInputs?.show_action_info === "true" ? true : false,
          allow_partial_shipment_received:
            formInputs?.allow_partial_shipment_received === "true"
              ? true
              : false,
          godown_management_allowed:
            formInputs?.godown_management_allowed === "true" ? true : false,
          allow_offline_software_update:
            formInputs?.allow_offline_software_update === "true" ? true : false,
          offline_version: formInputs?.offline_version || "",
          software_type: formInputs?.software_type || "cloud",
          barcode_generation_and_scanning:
            formInputs?.barcode_generation_and_scanning === "true"
              ? true
              : false,
          invoice_feedback_url: formInputs?.invoice_feedback_url || "",
          pra_invoice_template_slug:
            formInputs?.pra_invoice_template_slug || "",
          pos_invoice_template_slug:
            formInputs?.pos_invoice_template_slug || "",
          digital_invoice_template_slug:
            formInputs.digital_invoice_template_slug || "",
          percentage_for_additional_services:
            Number(formInputs?.percentage_for_additional_services) || 5,
          sale_withholding_base_amount_type:
            formInputs?.sale_withholding_base_amount_type,
          additional_services_fee: formInputs?.additional_services_fee ?? false,
          label_for_additional_services:
            formInputs?.label_for_additional_services || "",
          withholding_base_amount_type:
            formInputs?.withholding_base_amount_type,
          allow_ledger_creation: formInputs?.allow_ledger_creation ?? false,
          filter_date_type: formInputs?.filter_date_type,
          filter_shipment_date_type: formInputs?.filter_shipment_date_type,
          show_products: formInputs.show_products,
          remaining_amount_in_next_invoice:
            formInputs.remaining_amount_in_next_invoice === "true"
              ? true
              : false,
          terms_description_for_invoice:
            formInputs.business_terms_description_for_invoice,
          monthly_invoices_allowed: formInputs.monthly_invoices_allowed,
          backup_of_years: formInputs.backup_of_years,
          staff_login_allowed: formInputs.staff_login_allowed,
          business_year_start: formInputs.business_year_start,
          business_year_end: formInputs.business_year_end,
          branches_allowed: formInputs.branches_allowed,
          warehouses_allowed: formInputs.warehouses_allowed,
          yearly_storage_records_allowed:
            formInputs.yearly_storage_records_allowed,
        },
      };
    } else {
      finalPostObject = {
        type: "fbr_info",
        tax_formation: formInputs.tax_formation || "",
        invoice_reporting_method: formInputs.invoice_reporting_method,
        default_invoice_reporting_method:
          formInputs.default_invoice_reporting_method,
        validate_fbr_data: formInputs.validate_fbr_data || "false",
        show_fbr_info_in_settings_and_payments:
          formInputs.show_fbr_info_in_settings_and_payments,
        business_settings: {
          // add_digital_invoicing_service_fee:
          //   formInputs?.add_digital_invoicing_service_fee ?? true,
          want_to_use_fbr_invoice: formInputs.want_to_use_fbr_invoice,
          use_fbr_invoice: formInputs.use_fbr_invoice,
          fbr_environment: formInputs.fbr_environment,
          digital_invoicing_service_fee:
            formInputs.digital_invoicing_service_fee,
          fbr_secret_token: formInputs.fbr_secret_token,
          fbr_production_secret_key: formInputs.fbr_production_secret_key,
          pos_settings: {
            // use_as: formInputs.use_as,
            environment: formInputs.pos_environment,
            pos_id_for_sandbox: formInputs.pos_id_for_sandbox,
            pos_secret_key_for_sandbox: formInputs.pos_secret_key_for_sandbox,
            pos_id_for_production: formInputs.pos_id_for_production,
            pos_secret_key_for_production:
              formInputs.pos_secret_key_for_production,
          },
          province_pos_settings: {
            environment: formInputs.province_pos_environment,
            pos_id_for_sandbox: formInputs.province_pos_id_for_sandbox,
            pos_secret_key_for_sandbox:
              formInputs.province_pos_secret_key_for_sandbox,
            pos_id_for_production: formInputs.province_pos_id_for_production,
            pos_secret_key_for_production:
              formInputs.province_pos_secret_key_for_production,
          },
        },
        ...(formInputs.show_fbr_info_in_settings_and_payments
          ? {
              fbr_info: {
                // add_pos_service_fee: formInputs?.add_pos_service_fee ?? true,
                pos_service_fee: formInputs.pos_service_fee,
                transactioN_TYPE_ID: parseString(
                  formInputs.transaction_type?.code ||
                    formInputs.transaction_type,
                ),
                transactioN_DESC: parseString(
                  formInputs.transaction_type?.description || "",
                ),
                hS_CODE: parseString(
                  formInputs.hs_code?.code || formInputs.hs_code,
                ),
                description: parseString(
                  formInputs?.hs_code?.description || "",
                ),
                tax_type: parseString(formInputs.rate_value || ""),
                rate_id: parseString(formInputs.rate_id || ""),
                uom: parseString(formInputs.uom_id || ""),
                uom_description: parseString(formInputs.uom_description || ""),
                sro_id: parseString(formInputs.sro_id || ""),
                sro_serial_no: parseString(formInputs.sro_serial_no || ""),
                sro_description: parseString(formInputs.sro_description || ""),
                srO_ITEM_DESC: parseString(
                  formInputs.sro_item_description?.description ||
                    formInputs.sro_item_description,
                ),
                srO_ITEM_ID: parseString(
                  formInputs.sro_item_id || formInputs.sro_id,
                ),
              },
            }
          : {
              fbr_info: {
                pos_service_fee: formInputs.pos_service_fee,
                // add_pos_service_fee: formInputs?.add_pos_service_fee ?? true,
              },
            }),
      };
    }

    const response = await _update_business_settings_fbr_info(
      user_id,
      finalPostObject,
    );
    if (response?.code === 200) {
      enqueueSnackbar(response.message, { variant: "success" });
      navigate(isDemo ? "/demo-business-accounts" : "/business-customer");
    } else {
      enqueueSnackbar(response.message || "Error occurred", {
        variant: "error",
      });
    }
    setLoading(false);
  };
  const fetchSettings = async () => {
    setLoading(true);
    let postData = {
      type: type,
    };
    const response = await _find_business_data_type_base_for_admin(
      user_id,
      postData,
    );
    if (response.code === 200) {
      const biz = response.business;
      const bizPortal = biz?.business_portal_settings || {};
      const bizSettings = biz?.business_settings || {};
      const fbr = bizSettings?.fbr_info || {};
      console.log(
        "Fetched business settings and FBR info:",
        bizPortal?.show_action_info,
      );

      setFormInputs({
        ...defaultFormInputs,
        pos_version: bizPortal?.pos_version || "pos_one",
        show_action_info: bizPortal?.show_action_info ? "true" : "false",
        allow_partial_shipment_received:
          bizPortal?.allow_partial_shipment_received ? "true" : "false",
        godown_management_allowed: bizPortal?.godown_management_allowed
          ? "true"
          : "false",
        allow_offline_software_update: bizPortal?.allow_offline_software_update
          ? "true"
          : "false",
        offline_version: bizPortal?.offline_version || "",
        software_type: bizPortal?.software_type || "cloud",
        barcode_generation_and_scanning:
          bizPortal?.barcode_generation_and_scanning ? "true" : "false",
        invoice_feedback_url: bizPortal?.invoice_feedback_url || "",
        pra_invoice_template_slug: bizPortal?.pra_invoice_template_slug || "",
        pos_invoice_template_slug: bizPortal?.pos_invoice_template_slug || "",
        digital_invoice_template_slug:
          bizPortal?.digital_invoice_template_slug || "",
        percentage_for_additional_services:
          bizPortal?.percentage_for_additional_services || "5",
        sale_withholding_base_amount_type:
          bizPortal?.sale_withholding_base_amount_type || "tax_amount",
        additional_services_fee: bizPortal?.additional_services_fee
          ? "true"
          : false,
        label_for_additional_services:
          bizPortal?.label_for_additional_services || "",
        withholding_base_amount_type:
          bizPortal?.withholding_base_amount_type || "tax_amount",
        // add_pos_service_fee: fbr?.add_pos_service_fee ?? true,
        // add_digital_invoicing_service_fee:
        //   bizSettings?.add_digital_invoicing_service_fee ?? true,
        remaining_amount_in_next_invoice:
          bizPortal?.remaining_amount_in_next_invoice ? "true" : "false",
        allow_ledger_creation: bizPortal?.allow_ledger_creation
          ? "true"
          : "false",
        filter_shipment_date_type:
          bizPortal?.filter_shipment_date_type || "shipment_date",
        user_id: biz?.user_id?._id || "",
        first_name: biz?.first_name || "",
        last_name: biz?.last_name || "",
        show_fbr_info_in_settings_and_payments:
          !!bizSettings?.show_fbr_info_in_settings_and_payments,
        fbr_production_secret_key: bizSettings?.fbr_production_secret_key || "",
        fbr_environment: bizSettings?.fbr_environment || "sandbox",
        want_to_use_fbr_invoice: !!bizSettings?.want_to_use_fbr_invoice,
        use_fbr_invoice: !!bizSettings?.use_fbr_invoice,
        fbr_secret_token: bizSettings?.fbr_secret_token || "",
        invoice_reporting_method: bizPortal?.invoice_reporting_method || [],
        default_invoice_reporting_method:
          bizPortal?.default_invoice_reporting_method || "",
        business_terms_description_for_invoice:
          bizSettings?.terms_description_for_invoice || "",
        monthly_invoices_allowed: bizPortal?.monthly_invoices_allowed || "0",
        backup_of_years: bizPortal?.backup_of_years || "0",
        business_year_start: bizPortal?.business_year_start || "",
        business_year_end: bizPortal?.business_year_end || "",
        branches_allowed: bizPortal?.branches_allowed || "0",
        warehouses_allowed: bizPortal?.warehouses_allowed || "0",
        yearly_storage_records_allowed:
          bizPortal?.yearly_storage_records_allowed || "0",
        staff_login_allowed: bizPortal?.staff_login_allowed || "0",
        show_products: bizPortal?.show_products || "all",
        validate_fbr_data: bizPortal?.validate_fbr_data,
        digital_invoicing_service_fee:
          bizSettings?.digital_invoicing_service_fee
            ? Number(bizSettings?.digital_invoicing_service_fee).toFixed(2)
            : "0.00",
        pos_environment: bizSettings?.pos_settings?.environment || "sandbox",
        pos_id_for_sandbox: bizSettings?.pos_settings?.pos_id_for_sandbox || "",
        pos_id_for_production:
          bizSettings?.pos_settings?.pos_id_for_production || "",
        pos_secret_key_for_sandbox:
          bizSettings?.pos_settings?.pos_secret_key_for_sandbox || "",
        pos_secret_key_for_production:
          bizSettings?.pos_settings?.pos_secret_key_for_production || "",
        province_pos_environment:
          bizSettings?.province_pos_settings?.environment || "sandbox",
        province_pos_id_for_sandbox:
          bizSettings?.province_pos_settings?.pos_id_for_sandbox || "",
        province_pos_id_for_production:
          bizSettings?.province_pos_settings?.pos_id_for_production || "",
        province_pos_secret_key_for_sandbox:
          bizSettings?.province_pos_settings?.pos_secret_key_for_sandbox || "",
        province_pos_secret_key_for_production:
          bizSettings?.province_pos_settings?.pos_secret_key_for_production ||
          "",
        pos_service_fee: bizSettings?.fbr_info?.pos_service_fee
          ? Number(bizSettings?.fbr_info?.pos_service_fee).toFixed(2)
          : "0.00",
        hs_code: fbr?.hS_CODE
          ? {
              code: fbr.hS_CODE,
              description: fbr.description || fbr.hS_CODE_DESC,
            }
          : null,
        use_as: formInputs.use_as,

        transaction_type: fbr?.transactioN_TYPE_ID
          ? {
              code: Number(fbr.transactioN_TYPE_ID),
              description: fbr.transactioN_DESC || "N/A",
            }
          : null,
        tax_formation: bizSettings?.tax_formation || "",
        uom_id: fbr?.uom || "",
        uom_description: fbr?.uom_description || "",
        rate_id: fbr?.rate_id || "",
        rate_value: fbr?.tax_type || "",
        rate_description: fbr?.description || "",
        sro_id: fbr?.sro_id || "",
        sro_serial_no: fbr?.sro_serial_no || "",
        sro_description: fbr?.sro_description || "",
        sro_item_description: fbr?.srO_ITEM_DESC
          ? {
              description: fbr.srO_ITEM_DESC,
              id: Number(fbr.SrO_ITEM_ID),
            }
          : null,
      });
      setBreadCrumTitle(`${biz?.first_name} ${biz?.last_name}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user_id) fetchSettings();
    setNavBarTitle(
      type === "business_settings"
        ? "Manage Business Settings"
        : "Manage FBR Settings",
    );
    setIsBackButton(false);
  }, [user_id, type]);

  console.log(user_id, "user_iduser_iduser_iduser_iduser_id");

  useEffect(() => {
    const methods = formInputs.invoice_reporting_method || [];
    setIsShowDigital(methods.includes("digital_invoicing"));
    setIsShowPOS(methods.includes("pos_invoicing"));
    setIsShowProvincePOS(methods.includes("province_pos_invoicing"));
  }, [formInputs.invoice_reporting_method]);

  useEffect(() => {
    const booleanFields = [
      "show_action_info",
      "allow_partial_shipment_received",
      "godown_management_allowed",
      "allow_offline_software_update",
      "barcode_generation_and_scanning",
      "additional_services_fee",
      "remaining_amount_in_next_invoice",
      "allow_ledger_creation",
      "show_fbr_info_in_settings_and_payments",
      "want_to_use_fbr_invoice",
      "use_fbr_invoice",
      "validate_fbr_data",
    ];

    setFormInputs((prev) => {
      let hasChanges = false;

      const updated = { ...prev };

      booleanFields.forEach((field) => {
        const value = updated[field];

        if (typeof value === "string") {
          if (value.toLowerCase() === "true") {
            updated[field] = true;
            hasChanges = true;
          } else if (value.toLowerCase() === "false") {
            updated[field] = false;
            hasChanges = true;
          }
        }
      });

      return hasChanges ? updated : prev;
    });
    console.log("formInputs  ___formInputs", formInputs);
  }, [
    [
      formInputs.show_action_info,
      formInputs.allow_partial_shipment_received,
      formInputs.godown_management_allowed,
      formInputs.allow_offline_software_update,
      formInputs.barcode_generation_and_scanning,
      formInputs.additional_services_fee,
      formInputs.remaining_amount_in_next_invoice,
      formInputs.allow_ledger_creation,
      formInputs.show_fbr_info_in_settings_and_payments,
      formInputs.want_to_use_fbr_invoice,
      formInputs.use_fbr_invoice,
      formInputs.validate_fbr_data,
    ],
  ]);

  if (isLoading) return <CircularLoader />;

  return (
    <div className="container-fluid p-0 position-relative mt-3">
      <div className="d-flex align-items-center mb-3">
        <ActiveLastBreadcrumb
          breadCrumbMenu={[
            {
              title: from === "basicDetails" ? "Business Details" : "Business",
              navigation:
                from === "basicDetails"
                  ? `/business-customer/detail/${user_id}`
                  : isDemo
                    ? "/demo-business-accounts"
                    : "/business-customer",
              active: false,
            },
            {
              title: user_id ? breadCrumTitle : "Add Business Customer",
              active: true,
            },
          ]}
        />
      </div>

      <form onSubmit={handleSave}>
        {type === "business_settings" ? (
          <BusinessSettingsTab
            formInputs={formInputs}
            setFormInputs={setFormInputs}
            handleFormInputsChange={handleFormInputsChange}
          />
        ) : (
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
              province_pos_environment: formInputs.province_pos_environment,
              province_pos_id_for_sandbox:
                formInputs.province_pos_id_for_sandbox,
              province_pos_id_for_production:
                formInputs.province_pos_id_for_production,
              province_pos_secret_key_for_sandbox:
                formInputs.province_pos_secret_key_for_sandbox,
              province_pos_secret_key_for_production:
                formInputs.province_pos_secret_key_for_production,
              transaction_type: formInputs?.transaction_type,
              rate_id: formInputs?.rate_id,
              rate_description: formInputs?.rate_description,
              rate_value: formInputs?.rate_value,
              hs_code: formInputs?.hs_code,
              uom_id: formInputs?.uom_id,
              uom_description: formInputs?.uom_description,
              use_as: formInputs?.use_as,
              sro_item_description: formInputs?.sro_item_description,
              sro_item_id: formInputs?.sro_item_id,
              sro_id: formInputs?.sro_id,
              sro_serial_no: formInputs?.sro_serial_no,
              tax_formation: formInputs?.tax_formation,
              // add_digital_invoicing_service_fee:
              //   formInputs?.add_digital_invoicing_service_fee,
              // add_pos_service_fee: formInputs?.add_pos_service_fee,
            }}
            handleFormInputsChange={handleFormInputsChange}
            onChange={(fbrData) => {
              setFormInputs({ ...formInputs, ...fbrData });
            }}
            setFormInputs={setFormInputs}
            formInputs={formInputs}
            isShowDigital={isShowDigital}
            isShowPOS={isShowPOS}
            isShowProvincePOS={isShowProvincePOS}
            user_id={user_id || formInputs?.user_id}

            //   fbrData={formInputs}
            //   handleFormInputsChange={handleFormInputsChange}
            //   onChange={(newData) =>
            //     setFormInputs((prev) => ({ ...prev, ...newData }))
            //   }
            //   setFormInputs={setFormInputs}
            //   formInputs={formInputs}
            //   isShowDigital={isShowDigital}
            //   isShowPOS={isShowPOS}
            //   user_id={user_id || formInputs?.user_id}
          />
        )}

        <div
          className="col-12 d-flex justify-content-end position-fixed"
          style={{ bottom: 20, right: 20 }}
        >
          <Button
            variant="contained"
            type="submit"
            // disabled={isSaveDisabled()}
            className="capitalized button-in-listing d-flex align-items-center ms-2"
          >
            Save & Exit
            <Iconify
              className="ms-1"
              icon="material-symbols:exit-to-app"
              fontSize={16}
            />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MainFBRAndBusinessSettingComponent;
