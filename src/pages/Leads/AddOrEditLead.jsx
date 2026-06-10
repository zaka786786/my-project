import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminContext } from "../../Hooks/AdminContext";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import CircularLoader from "../../components/loaders/CircularLoader";
import LeadFormFields from "./components/LeadFormFields";
import {
  _add_lead,
  _detail_lead_by_id,
  _edit_lead_by_id,
} from "../../DAL/Leads/leads";
import { enqueueSnackbar } from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSearchParams } from "react-router-dom";

const EMPTY = {
  name: "",
  phone_number: "",
  email: "",
  province_info: null,
  city_info: null,
  address: "",
  lead_source: "",
  platform_campaign: "",
  interested_product: "",
  follow_up_date: "",
  lead_status_id: null,
  assign_to_id: null,
  initial_note: "",
  referral_info: {
    name: "",
    phone_number: "",
    relation: "",
  },
  category_id: null,
  meeting_schedule: false,
  meeting_schedule_date: "",
  expected_budget: "",
};

const AddOrEditLead = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setNavBarTitle, userInfo, adminInfo, setIsBackButton } =
    useAdminContext();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);
  const from = searchParams.get("from");
  const isEdit = !!id;

  const breadCrumbMenu = [
    {
      title: "Leads",
      navigation: "/leads",
    },
    {
      title: isEdit ? "Update Lead" : "Add Lead",
      active: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (
    //   !form?.phone_number ||
    //   form?.phone_number === "+" ||
    //   form?.phone_number.trim() === ""
    // ) {
    //   enqueueSnackbar("Please enter a valid phone number", {
    //     variant: "error",
    //   });
    //   return;
    // }

    // if (
    //   form?.lead_source === "referral" &&
    //   (!form?.referral_info?.phone_number ||
    //     form?.referral_info?.phone_number === "+" ||
    //     form?.referral_info?.phone_number.trim() === "")
    // ) {
    //   enqueueSnackbar("Please enter a valid referrer phone number", {
    //     variant: "error",
    //   });
    //   return;
    // }

    let province_info = {
      _id: form?.province_info?._id,
      name: form?.province_info?.name,
    };
    let city_info = {
      _id: form?.city_info?._id,
      name: form?.city_info?.name,
    };

    const postData = {
      name: form?.name,
      phone_number: form?.phone_number === "+" ? "" : form?.phone_number,
      email: form?.email,
      province_info: province_info,
      city_info: city_info,
      address: form?.address,
      lead_source: form?.lead_source,
      platform_campaign: form?.platform_campaign,
      interested_product: form?.interested_product,
      lead_status_id: form?.lead_status_id?._id,

      category_id: form?.category_id?._id || "",
      meeting_schedule: form?.meeting_schedule || false,
      expected_budget: Number(form?.expected_budget) || 0,
    };

    if (form?.meeting_schedule && form?.meeting_schedule_date) {
      postData.meeting_schedule_date = form?.meeting_schedule_date;
    }

    if (form?.lead_source === "referral") {
      let updatedReferralInfo = form?.referral_info || null;
      if (form?.referral_info?.phone_number === "+" && updatedReferralInfo) {
        updatedReferralInfo.phone_number = "";
      }
      postData.referral_info = updatedReferralInfo;
    }

    if (form?.follow_up_date) {
      postData.follow_up_date = form?.follow_up_date || "";
    }

    if (!isEdit) {
      postData.initial_note = form?.initial_note || "";

      if (
        adminInfo?.role?.alias_title == "admin" ||
        adminInfo?.role?.alias_title == "manager"
      ) {
        postData.assign_to_id = form?.assign_to_id?.user_id?._id || "";
      } else {
        postData.assign_to_id = userInfo?.user_id?._id;
      }
    } else {
      postData.assign_to_id = form?.assign_to_id?.user_id?._id || "";
    }

    setSubmitButtonLoader(true);
    console.log("postData  __postData :", postData);
    let response = isEdit
      ? await _edit_lead_by_id(postData, id)
      : await _add_lead(postData);

    console.log("response  __response :", response);
    if (response?.code === 200) {
      navigate("/leads");
    } else {
      enqueueSnackbar(response?.message || "Failed", { variant: "error" });
    }
    setSubmitButtonLoader(false);
  };

  const getLeadDetail = async () => {
    let response = await _detail_lead_by_id(id);
    if (response?.code === 200) {
      const lead = response?.lead;
      setForm({
        name: lead?.name || "",
        phone_number: lead?.phone_number || "",
        email: lead?.email || "",
        province_info: lead?.province_info || null,
        city_info: lead?.city_info || null,
        address: lead?.address || "",
        lead_source: lead?.lead_source || "",
        platform_campaign: lead?.platform_campaign || "",
        interested_product: lead?.interested_product || "",
        follow_up_date: lead?.follow_up_date
          ? new Date(lead.follow_up_date).toISOString().slice(0, 16)
          : "",
        lead_status_id: lead?.lead_status || null,
        referral_info: {
          name: lead?.referral_info?.name || "",
          phone_number: lead?.referral_info?.phone_number || "",
          relation: lead?.referral_info?.relation || "",
        },

        assign_to_id: lead?.assigned_to
          ? {
              label: `${lead?.assigned_to?.first_name || ""} ${lead?.assigned_to?.last_name || ""}`,
              value: lead?.assigned_to?.user_id,
              ...lead?.assigned_to,
              user_id: { _id: lead?.assigned_to?.user_id },
            }
          : null,

        category_id: lead?.category || null,

        meeting_schedule: lead?.meeting_schedule || false,

        meeting_schedule_date: lead?.meeting_schedule_date
          ? new Date(lead.meeting_schedule_date).toISOString().slice(0, 16)
          : "",

        expected_budget: lead?.expected_budget || "",
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(response?.message || "Failed", {
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNavBarTitle(isEdit ? "Update Lead" : "Add Lead");
    setIsBackButton(true);
    if (isEdit) {
      getLeadDetail();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) return <CircularLoader />;

  return (
    <div className="container-fluid px-0">
      <div className="mt-2 mb-3 row">
        <div className="col-12 col-sm-10">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>

        {/* {from == "detail" && (
          <div className="col-12 col-sm-2 d-flex justify-content-end">
            <Button
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                color: "#000",
                border: "1px solid #DDD",
                height: 36,
                px: 2,
              }}
            >
              Back
            </Button>
          </div>
        )} */}
      </div>

      <form className="popover-mid-container" onSubmit={handleSubmit}>
        <LeadFormFields form={form} setForm={setForm} isEdit={isEdit} />

        <div className="text-end mt-4">
          <Button
            variant="contained"
            type="submit"
            disabled={submitButtonLoader}
          >
            {isEdit ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOrEditLead;
