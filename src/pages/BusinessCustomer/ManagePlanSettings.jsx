import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminContext } from "../../Hooks/AdminContext";
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import CircularLoader from "../../components/loaders/CircularLoader";
import PlanSettings from "./components/PlanSettings";
import dayjs from "dayjs";
import {
  _get_customer_business_plan,
  _update_customer_business_plan,
} from "../../DAL/CustomerPlans/CustomerBusinessPlan";

const ManagePlanSettings = ({ type }) => {
  const isDemo = type === "demo";
  const { user_id } = useParams();
  const from = new URLSearchParams(window.location.search).get("from");
  const navigate = useNavigate();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();

  const [isLoading, setLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    upfront_amount: "0",
    recurring_type: "monthly",
    recurring_amount: "0",
    grace_period_days: "0",
    customer_access_for: true,
    expiration_date: dayjs(),
    business_plan: null,
  });

  const breadCrumbMenu = [
    {
      title: from === "basicDetails" ? "Business Details" : "Business Customer",
      navigation:
        from === "basicDetails"
          ? `/business-customer/detail/${user_id}`
          : isDemo
            ? "/demo-business-accounts"
            : "/business-customer",
      active: false,
    },
    {
      title: "Manage Plan Settings",
      active: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = formInputs?.customer_access_for
      ? {
          is_plan_free: formInputs.customer_access_for,
          expiry_date: formInputs.expiration_date
            ? formInputs.expiration_date.toISOString()
            : null,
        }
      : {
          is_plan_free: formInputs.customer_access_for,
          upfront_price: formInputs?.upfront_amount,
          price: formInputs?.recurring_amount,
          plan_type: formInputs?.recurring_type,
          grace_period: formInputs?.grace_period_days,
        };
    const result = await _update_customer_business_plan(
      user_id,
      formData,
      "plan_data",
    );
    if (result.code === 200) {
      enqueueSnackbar("Plan settings saved successfully", {
        variant: "success",
      });
      setLoading(false);
      navigate(isDemo ? "/demo-business-accounts" : "/business-customer");
    } else {
      enqueueSnackbar(result.message || "Failed to save settings", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setNavBarTitle("Manage Plan Settings");
    setIsBackButton(false);
    const fetchPlanSettings = async () => {
      setLoading(true);
      const result = await _get_customer_business_plan(user_id, "plan_data");
      if (result.code === 200) {
        setFormInputs({
          upfront_amount:
            result?.business?.plan_settings?.plan?.upfront_price || "0",
          recurring_type:
            result?.business?.plan_settings?.plan?.plan_type || "monthly",
          recurring_amount: result?.business?.plan_settings?.plan?.price || "0",
          grace_period_days:
            result?.business?.plan_settings?.plan?.grace_period || "0",
          customer_access_for: !result?.business?.plan_settings?.plan
            ? true
            : result?.business?.plan_settings?.plan?.is_plan_free === true,
          expiration_date: result?.business?.plan_settings?.expiry_date
            ? dayjs(result.business.plan_settings.expiry_date)
            : null,
          is_plan_paid: result?.business?.plan_settings?.plan?.is_plan_free
            ? false
            : true,
          business_plan: result?.business?.plan_settings?.plan,
        });
      }
      setLoading(false);
    };
    fetchPlanSettings();
  }, [user_id]);

  if (isLoading) return <CircularLoader />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-12 display-flex mb-3">
            <span>
              <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
            </span>
          </div>
        </div>

        <PlanSettings formInputs={formInputs} setFormInputs={setFormInputs} />

        <div className="row">
          <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="outlined"
              type="button"
              onClick={() =>
                navigate(
                  isDemo ? "/demo-business-accounts" : "/business-customer",
                )
              }
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ManagePlanSettings;
