import React, { useEffect } from "react";
import SummaryCard from "./components/SummaryCard";
import { useAdminContext } from "../../Hooks/AdminContext";
import RevenueChart from "./components/RevenueChart";
import CircularLoader from "../../components/loaders/CircularLoader";
import { getTableHead } from "../../utils/TableHead";
import { _Dashboard_Data } from "../../DAL/Dashboard/Dashboard";
import { fShortenNumber } from "../../utils/constant";
import DashboardTableCard from "./components/DashboardTableCard";
import DashboardUpcomingLeads from "./components/DashboardUpcomingLeads";
import LeadsStatusChart from "./components/LeadsStatusChart";
import { useQuery } from "@tanstack/react-query";

const Dashboard = ({ screen_path }) => {
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();

  const BUSINESS_LIST_TABLE_HEAD =
    getTableHead("dashboard_business_list") || [];
  const RECENT_PAYMENTS_TABLE_HEAD =
    getTableHead("dashboard_recent_payments") || [];
  const ON_TRIAL_BUSINESS_TABLE_HEAD =
    getTableHead("dashboard_on_trial_business") || [];
  const PAID_BUSINESS_CUSTOMERS_TABLE_HEAD =
    getTableHead("dashboard_paid_business_customers") || [];
  const UPCOMING_INVOICES_BUSINESS_TABLE_HEAD =
    getTableHead("dashboard_upcoming_invoices_business") || [];

  const accessTypeBusinessCustomer = checkNavItemAccessReadOnlyOrAll(
    "/business-customer",
    "direct_screen",
  );

  const accessTypePayments = checkNavItemAccessReadOnlyOrAll(
    "/payments",
    "direct_screen",
  );

  const showBusinessCustomer = accessTypeBusinessCustomer === "disabled";
  const showPayments = accessTypePayments === "disabled";

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => _Dashboard_Data({ search: "" }),
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const dashboardResponse = data?.data || {};

  const {
    revenue_graph = [],
    recent_businesses = [],
    total_businesses = 0,
    total_revenue = 0,
    free_businesses = 0,
    paid_businesses = 0,
    latest_payments = [],
    recent_free_businesses = [],
    recent_paid_businesses = [],
    upcoming_invoices_business = [],
    latest_leads = [],
    leads_status_graph = [],
  } = dashboardResponse;

  const stats = [
    {
      color: "#5792c9",
      title: "Total Business Customers",
      count: total_businesses,
      icon: "ri:group-line",
    },
    {
      color: "#5792c9",
      title: "Total Paid Business",
      count: paid_businesses,
      icon: "ix:customer",
    },
    {
      color: "#5792c9",
      title: "Total On Trial Business",
      count: free_businesses,
      icon: "carbon:customer",
    },
    {
      color: "#5792c9",
      title: "Total Revenue",
      count: `Rs ${fShortenNumber(total_revenue)}`,
      icon: "streamline-cyber:cash-hand-4",
    },
  ];

  const businessList = recent_businesses.map((item) => ({
    ...item,
    full_name: `${item?.first_name || ""} ${item?.last_name || ""}`.trim(),
    email: item?.user_id?.email || "",
    business_id: item?._id || "_ _",
    contact_number: item?.phone_number || "_ _",
    business_type: item?.category || "_ _",
    company_name: item?.business_name || "_ _",
  }));

  useEffect(() => {
    setNavBarTitle("Dashboard");
    setIsBackButton(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <CircularLoader />;
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger mt-3">
          Something went wrong while loading dashboard data.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Summary Cards */}
      <div className="row">
        {stats.map((item, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-3 mt-3">
            <SummaryCard {...item} />
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Business */}
        <div className="col-12 col-md-6 mt-3">
          <DashboardTableCard
            title="Recent Business"
            data={businessList}
            tableHead={BUSINESS_LIST_TABLE_HEAD}
            show={showBusinessCustomer}
          />
        </div>

        {/* Recent Payments */}
        <div className="col-12 col-md-6 mt-3">
          <DashboardTableCard
            title="Recent Payments"
            data={latest_payments}
            tableHead={RECENT_PAYMENTS_TABLE_HEAD}
            show={showPayments}
          />
        </div>

        {/* On Trial Business */}
        <div className="col-12 col-md-6 mt-3">
          <DashboardTableCard
            title="On Trial Business"
            data={recent_free_businesses}
            tableHead={ON_TRIAL_BUSINESS_TABLE_HEAD}
            show={showBusinessCustomer}
          />
        </div>

        {/* Paid Business Customers */}
        <div className="col-12 col-md-6 mt-3">
          <DashboardTableCard
            title="Paid Business Customers"
            data={recent_paid_businesses}
            tableHead={PAID_BUSINESS_CUSTOMERS_TABLE_HEAD}
            show={showBusinessCustomer}
          />
        </div>

        {/* Pending Invoices */}
        <div className="col-12 col-md-6 mt-3">
          <DashboardTableCard
            title="Businesses with Pending Invoices"
            data={upcoming_invoices_business}
            tableHead={UPCOMING_INVOICES_BUSINESS_TABLE_HEAD}
            show={showBusinessCustomer}
          />
        </div>

        {/* Revenue Chart */}
        <div className="col-12 col-md-6 mt-3">
          <RevenueChart revenue_graph={revenue_graph} />
        </div>

        {/* Upcoming Leads */}
        <div className="col-12 col-md-6 mt-3">
          <DashboardUpcomingLeads
            data={latest_leads}
            show={showBusinessCustomer}
          />
        </div>

        {/* Leads Status Chart */}
        <div className="col-12 col-md-6 mt-3">
          <LeadsStatusChart leads_status_graph={leads_status_graph} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
