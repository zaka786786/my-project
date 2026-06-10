import { useEffect, useState, useRef, useCallback } from "react";
import { useAdminContext } from "../../Hooks/AdminContext";
import useTable from "../../Hooks/CustomHooks/CustomTableHook";
import { Icon } from "@iconify/react";
import { IconButton, Tooltip } from "@mui/material";
import TemplatePreviewModal from "../BusinesConfiguration/TemplatePreviewModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CustomAutocomplete from "../../components/CustomeAutoComplete/CustomAutoComplete";
import { useSnackbar } from "notistack";
import {
  digitalStyle1,
  digitalStyle2,
  digitalStyle3,
  posStyle1,
  posStyle2,
  posStyle3,
  praStyle1,
  praStyle2,
  praStyle3,
  digitalStyle4,
  digitalStyle5,
  posStyle4,
  posStyle5,
  praStyle4,
  praStyle5,
} from "../../assets";
import {
  _find_business_data_type_base_for_admin,
  _update_business_settings_fbr_info,
} from "../../DAL/BusinessConfiguration/business_settings";

// --- Constants ---

const DEFAULT_FORM_INPUTS = {
  invoice_feedback_url: "",
  pra_invoice_template_slug: "",
  pos_invoice_template_slug: "",
  digital_invoice_template_slug: "",
  percentage_for_additional_services: 5,
  sale_withholding_base_amount_type: "",
  additional_services_fee: false,
  label_for_additional_services: "",
  withholding_base_amount_type: "",
  allow_ledger_creation: false,
  filter_date_type: "invoice_date",
  filter_shipment_date_type: "shipment_date",
  show_products: "",
  remaining_amount_in_next_invoice: false,
  terms_description_for_invoice: "",
  monthly_invoices_allowed: false,
  backup_of_years: "",
  staff_login_allowed: false,
  business_year_start: "",
  business_year_end: "",
  branches_allowed: false,
  warehouses_allowed: false,
  yearly_storage_records_allowed: false,
  barcode_generation_and_scanning: false,
  software_type: "cloud",
  allow_offline_software_update: false,
  offline_version: "",
  godown_management_allowed: false,
  allow_partial_shipment_received: false,
  show_action_info: false,
  pos_version: "pos_one",
};

const TEMPLATES_LIST = [
  // General
  {
    id: 1,
    type: "Digital",
    name: "General Invoice Receipt Template",
    slug: "invoice-receipt-v1",
    image: digitalStyle1,
  },
  {
    id: 4,
    type: "POS",
    name: "General Invoice Receipt Template",
    slug: "invoice-receipt-v1",
    image: posStyle1,
  },
  {
    id: 7,
    type: "PRA",
    name: "General Invoice Receipt Template",
    slug: "invoice-receipt-v1",
    image: praStyle1,
  },

  // Doctors
  {
    id: 2,
    type: "Digital",
    name: "Doctors Invoice Receipt Template",
    slug: "invoice-receipt-v2",
    image: digitalStyle2,
  },
  {
    id: 5,
    type: "POS",
    name: "Doctors Invoice Receipt Template",
    slug: "invoice-receipt-v2",
    image: posStyle2,
  },
  {
    id: 8,
    type: "PRA",
    name: "Doctors Invoice Receipt Template",
    slug: "invoice-receipt-v2",
    image: praStyle2,
  },

  // Restaurant
  {
    id: 3,
    type: "Digital",
    name: "Restaurant Invoice Receipt Template",
    slug: "invoice-receipt-v3",
    image: digitalStyle3,
  },
  {
    id: 6,
    type: "POS",
    name: "Restaurant Invoice Receipt Template",
    slug: "invoice-receipt-v3",
    image: posStyle3,
  },
  {
    id: 9,
    type: "PRA",
    name: "Restaurant Invoice Receipt Template",
    slug: "invoice-receipt-v3",
    image: praStyle3,
  },

  // Garments
  {
    id: 10,
    type: "Digital",
    name: "Garments Invoice Receipt Template",
    slug: "invoice-receipt-v4",
    image: digitalStyle4,
  },
  {
    id: 12,
    type: "POS",
    name: "Garments Invoice Receipt Template",
    slug: "invoice-receipt-v4",
    image: posStyle4,
  },
  {
    id: 14,
    type: "PRA",
    name: "Garments Invoice Receipt Template",
    slug: "invoice-receipt-v4",
    image: praStyle4,
  },

  // Pharmacy
  {
    id: 11,
    type: "Digital",
    name: "Pharmacy Invoice Receipt Template",
    slug: "invoice-receipt-v5",
    image: digitalStyle5,
  },
  {
    id: 13,
    type: "POS",
    name: "Pharmacy Invoice Receipt Template",
    slug: "invoice-receipt-v5",
    image: posStyle5,
  },
  {
    id: 15,
    type: "PRA",
    name: "Pharmacy Invoice Receipt Template",
    slug: "invoice-receipt-v5",
    image: praStyle5,
  },
];

const MySwal = withReactContent(Swal);

// --- Component ---

const InvoiceTemplates = ({ screen_path }) => {
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [previewModal, setPreviewModal] = useState({
    open: false,
    image: null,
    title: "",
  });
  const [formInputs, setFormInputs] = useState(DEFAULT_FORM_INPUTS);

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  // Ref to track latest state for async closures (SweetAlert)
  const formInputsRef = useRef(formInputs);

  useEffect(() => {
    formInputsRef.current = formInputs;
  }, [formInputs]);

  useEffect(() => {
    setNavBarTitle("Invoice Templates");
    setIsBackButton(false);
  }, [setNavBarTitle]);

  // Network Handlers
  const fetchSettings = useCallback(async (user_id) => {
    try {
      const response = await _find_business_data_type_base_for_admin(user_id, {
        type: "business_settings",
      });

      if (response.code === 200) {
        const bizPortal = response.business?.business_portal_settings || {};
        const bizSettings = response.business?.business_settings || {};

        setFormInputs({
          ...bizPortal,
          terms_description_for_invoice:
            bizSettings.terms_description_for_invoice || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch business settings:", error);
    }
  }, []);

  const handleUpdateAssignment = async (customerId, row) => {
    const inputs = formInputsRef.current;
    const finalPostObject = {
      type: "business_settings",
      business_portal_settings: {
        invoice_feedback_url: inputs.invoice_feedback_url,
        percentage_for_additional_services: Number(
          inputs.percentage_for_additional_services,
        ),
        sale_withholding_base_amount_type:
          inputs.sale_withholding_base_amount_type,
        additional_services_fee: inputs.additional_services_fee,
        label_for_additional_services: inputs.label_for_additional_services,
        withholding_base_amount_type: inputs.withholding_base_amount_type,
        allow_ledger_creation: inputs.allow_ledger_creation,
        filter_date_type: inputs.filter_date_type,
        filter_shipment_date_type: inputs?.filter_shipment_date_type,
        show_products: inputs.show_products,
        remaining_amount_in_next_invoice:
          inputs.remaining_amount_in_next_invoice,
        terms_description_for_invoice: inputs.terms_description_for_invoice,
        monthly_invoices_allowed: inputs.monthly_invoices_allowed,
        backup_of_years: inputs.backup_of_years,
        staff_login_allowed: inputs.staff_login_allowed,
        business_year_start: inputs.business_year_start,
        business_year_end: inputs.business_year_end,
        branches_allowed: inputs.branches_allowed,
        warehouses_allowed: inputs.warehouses_allowed,
        yearly_storage_records_allowed: inputs.yearly_storage_records_allowed,
        barcode_generation_and_scanning: inputs.barcode_generation_and_scanning,
        software_type: inputs.software_type,
        allow_offline_software_update: inputs.allow_offline_software_update,
        offline_version: inputs.offline_version,
        godown_management_allowed: inputs.godown_management_allowed,
        allow_partial_shipment_received: inputs.allow_partial_shipment_received,
        show_action_info: inputs.show_action_info,
        pos_version: inputs.pos_version,
      },
    };

    if (row.type === "Digital") {
      finalPostObject.business_portal_settings.digital_invoice_template_slug =
        row.slug;
      finalPostObject.business_portal_settings.pra_invoice_template_slug =
        inputs?.pra_invoice_template_slug;
      finalPostObject.business_portal_settings.pos_invoice_template_slug =
        inputs?.pos_invoice_template_slug;
    }
    if (row.type === "POS") {
      finalPostObject.business_portal_settings.pos_invoice_template_slug =
        row.slug;
      finalPostObject.business_portal_settings.digital_invoice_template_slug =
        inputs?.digital_invoice_template_slug;
      finalPostObject.business_portal_settings.pra_invoice_template_slug =
        inputs?.pra_invoice_template_slug;
    }
    if (row.type === "PRA") {
      finalPostObject.business_portal_settings.pra_invoice_template_slug =
        row.slug;
      finalPostObject.business_portal_settings.digital_invoice_template_slug =
        inputs?.digital_invoice_template_slug;
      finalPostObject.business_portal_settings.pos_invoice_template_slug =
        inputs?.pos_invoice_template_slug;
    }

    try {
      const response = await _update_business_settings_fbr_info(
        customerId,
        finalPostObject,
      );
      if (response?.code === 200) {
        enqueueSnackbar(response.message || "Template assigned successfully", {
          variant: "success",
        });
      } else {
        throw new Error(response?.message || "Failed to update settings");
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  console.log("formInputs", formInputs);

  // UI Handlers
  const handleOpenPreview = (image, title) =>
    setPreviewModal({ open: true, image, title });
  const handleClosePreview = () =>
    setPreviewModal({ open: false, image: null, title: "" });

  const handleClickAssign = (row) => {
    let selectedCustomerLocal = null;

    MySwal.fire({
      title: "Assign Template to Business Customer",
      titleText: `Assigning: ${row.name}`,
      html: (
        <div className="p-2 text-start">
          <CustomAutocomplete
            type="business"
            label="Select Business Customer"
            onChange={async (val) => {
              selectedCustomerLocal = val;
              if (val) {
                await fetchSettings(val?.user_id?._id);
                MySwal.enableButtons();
              } else {
                MySwal.disableButtons();
              }
            }}
          />
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: "Assign Template",
      confirmButtonColor: "var(--primary-color)",
      didOpen: () => MySwal.disableButtons(),
      preConfirm: () => {
        if (!selectedCustomerLocal) {
          Swal.showValidationMessage("Please select a business customer");
          return false;
        }
        return selectedCustomerLocal;
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        await handleUpdateAssignment(result.value.user_id?._id, row);
      }
    });
  };

  console.log("formInputsRef", formInputsRef);

  // Table Configuration
  const MENU_OPTIONS = [
    {
      label: "Assign This to business Customer",
      icon: "solar:user-hand-up-bold",
      handleClick: handleClickAssign,
    },
  ];

  const TABLE_HEAD = [
    { id: "action", label: "ACTION", type: "action" },
    {
      id: "name",
      label: "TEMPLATE NAME",
      className: "typography-color-in-table",
    },
    {
      id: "type",
      label: "TYPE",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span
          className="badge"
          style={{
            background: "var(--primary-light)",
            color: "var(--primary-color)",
          }}
        >
          {row.type}
        </span>
      ),
    },
    {
      id: "preview",
      label: "PREVIEW",
      renderData: (row) => (
        <Tooltip title="Preview Template">
          <IconButton
            onClick={() =>
              handleOpenPreview(row.image, `${row.type} - ${row.name}`)
            }
          >
            <Icon
              icon="eva:eye-fill"
              width={25}
              height={25}
              color="var(--primary-color)"
            />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const { table, setTotalCount, setTotalPages } = useTable({
    list: TEMPLATES_LIST,
    TABLE_HEAD,
    MENU_OPTIONS: show ? [] : MENU_OPTIONS,
    is_hide: true,
  });

  useEffect(() => {
    setTotalCount(TEMPLATES_LIST.length);
    setTotalPages(0);
  }, [setTotalCount, setTotalPages]);

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12">{table}</div>
      </div>

      <TemplatePreviewModal {...previewModal} onClose={handleClosePreview} />
    </div>
  );
};

export default InvoiceTemplates;
