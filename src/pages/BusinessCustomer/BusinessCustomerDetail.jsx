import { useEffect, useState } from "react";
import { useAdminContext } from "../../Hooks/AdminContext";
import { useParams } from "react-router-dom";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import CircularLoader from "../../components/loaders/CircularLoader";
import BusinessPayments from "./BusinessPayments";
import UserBasicDetails from "./components/UserBasicDetails";
import { Get_Business_Settings } from "../../DAL/BusinessConfiguration/business_settings";

import { permission_string } from "../../utils/constant";
import TooltipShowing from "../../components/TooltipShowing";

const TabGetter = (TabCurrentValue) => {
  let currentTab;
  if (TabCurrentValue === 0) {
    currentTab = "payment";
  } else if (TabCurrentValue === 1) {
    currentTab = "session";
  } else {
    currentTab = "payment";
  }

  return currentTab;
};

const BusinessCustomerDetail = ({ type, screen_path }) => {
  const isDemo = type && type === "demo";
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusModalLoading, setStatusModalLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelModalLoading, setCancelModalLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(3);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { id } = useParams();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();

  const [payments, setPayments] = useState([]);
  const [customerData, setCustomerData] = useState({
    first_name: "",
    last_name: "",
    profile_image: "",
    email: "",
    phone: "",
    company_name: "",
    category: "",
    address: "",
    city: "",
    status: "",
    created_at: "",
    updated_at: "",
    plan_settings: {
      plan: {
        name: "",
        is_paid: false,
        plan_type: "",
        save_in_yearly: "",
        description: "",
        upfront_price: 0,
        price: 0,
        grace_period: 0,
        features: [],
        status: false,
        is_plan_free: false,
      },
      invoice_start_date: "",
      next_invoice_date: "",
      expiry_date: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  let breadCrumbMenu = [
    {
      title: "Business Customer",
      navigation: isDemo ? "/demo-business-accounts" : "/business-customer",
      active: false,
    },
    {
      title: "Details",
      active: true,
    },
  ];

  // Payment status modal handlers
  const handleStatusClick = (row) => {
    if (row.status === "pending" || row.status === "due") {
      setSelectedPayment(row);
      setOpenStatusModal(true);
    }
  };

  const handleStatusModalClose = () => {
    setOpenStatusModal(false);
    setSelectedPayment(null);
  };

  const handleTabChange = (_, newValue) => {
    setPage(0);
    setPageCount(1);
    setTabValue(newValue);
    fetchCustomerData(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCancelClick = (row) => {
    setSelectedPayment(row);
    setOpenCancelModal(true);
  };

  const handleCancelModalClose = () => {
    setOpenCancelModal(false);
    setSelectedPayment(null);
  };

  const handleMenu = (item) => {
    const MENU_OPTIONS = [];

    if (item.payment_for === "recurring" && item.status === "pending") {
      MENU_OPTIONS.push({
        label: "Cancel Payment",
        icon: "mdi:cancel",
        handleClick: handleCancelClick,
      });
    }
    if (item.status === "pending" || item.status === "due") {
      MENU_OPTIONS.push({
        label: "Make Payment",
        icon: "ic:round-payment",
        handleClick: handleStatusClick,
      });
    }

    return MENU_OPTIONS;
  };

  const fetchCustomerData = async (newValue, isInitialLoading = false) => {
    const type = TabGetter(newValue);
    initialLoading ? setInitialLoading(true) : setIsLoading(true);
    const response = await Get_Business_Settings(id, type, page, rowsPerPage);
    if (response.code === 200) {
      const PaymentDataWithHandleMenu = response?.payments?.map((row) => {
        return {
          ...row,
          MENU_OPTIONS: handleMenu(row),
        };
      });
      setTotalCount(response?.total_count);
      setTotalPages(response?.total_pages);
      setSessions(response?.sessions);
      setPayments(PaymentDataWithHandleMenu);
      if (initialLoading || isInitialLoading) {
        const data = {
          fbr_environment:
            response?.business?.business_settings?.fbr_environment,
          fbr_production_secret_key:
            response?.business?.business_settings?.fbr_production_secret_key,
          fbr_secret_token:
            response?.business?.business_settings?.fbr_secret_token,
          use_fbr_invoice:
            response?.business?.business_settings?.use_fbr_invoice,
          data_access: response?.business?.data_access,
          two_factor_auth: response?.business?.user_id?.two_factor_auth,
          ntn_cnic: response?.business?.business_settings?.ntn_cnic,
          total_paid: response?.stat?.total_paid,
          total_pending: response?.stat?.total_pending,
          first_name: response?.business?.first_name,
          last_name: response?.business?.last_name,
          user_name: response?.business?.user_id?._id,
          profile_image: response?.business?.profile_image,
          email: response?.business?.user_id?.email,
          phone: response?.business?.phone_number,
          company_name: response?.business?.company_name,
          category: response?.business?.category,
          address: response?.business?.address,
          city: response?.business?.business_settings?.business_address?.city,
          state: response?.business?.business_settings?.business_address?.state,
          zip: response?.business?.zip,
          country:
            response?.business?.business_settings?.business_address?.country,
          status: response?.business?.status,
          bussiness_name: response?.business?.business_settings?.business_name,
          busines_currency: response?.business?.business_settings?.currency,
          bussiness_logo: response?.business?.business_settings?.business_logo,
          favicon: response?.business?.business_settings?.favicon,
          product_types: response?.business?.business_settings?.product_types,
          createdAt: response?.business?.createdAt,
          updatedAt: response?.business?.updatedAt,
          plan_settings: response?.business?.plan_settings || {
            plan: {
              name: "",
              is_paid: false,
              plan_type: "",
              save_in_yearly: "",
              description: "",
              upfront_price: 0,
              price: 0,
              grace_period: 0,
              features: [],
              status: false,
              is_plan_free: false,
            },
            invoice_start_date: "",
            next_invoice_date: "",
            expiry_date: "",
          },
        };
        setCustomerData(data);
      }
    }
    setInitialLoading(false);
    setIsLoading(false);
  };
  useEffect(() => {
    setNavBarTitle("Business Customer Details");
    setIsBackButton(false);
    fetchCustomerData(tabValue);
  }, [id, rowsPerPage, page]);

  console.log(isLoading, "isLoading");

  if (initialLoading) {
    return <CircularLoader />;
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 display-flex mb-3 mt-3">
            <span>
              <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 offset-lg-0 col-md-12">
            <UserBasicDetails
              customer={{
                ...customerData,
                user_id: {
                  _id: customerData?.user_name,
                  two_factor_auth: customerData?.two_factor_auth,
                  email: customerData?.email,
                },
              }}
              payments={payments}
              setCustomerData={setCustomerData}
              id={id}
              fetchCustomerData={fetchCustomerData}
              tabValue={tabValue}
              setInitialLoading={setInitialLoading}
              show={show}
            />
          </div>
        </div>

        <BusinessPayments
          isLoading={isLoading}
          handleCancelModalClose={handleCancelModalClose}
          payments={payments}
          fetchCustomerData={fetchCustomerData}
          openCancelModal={openCancelModal}
          cancelModalLoading={cancelModalLoading}
          setCancelModalLoading={setCancelModalLoading}
          selectedPayment={selectedPayment}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          handleChangePages={handleChangePages}
          totalPages={totalPages}
          pageCount={pageCount}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          handleTabChange={handleTabChange}
          tabValue={tabValue}
          sessions={sessions}
          setSessions={setSessions}
          statusModalLoading={statusModalLoading}
          setStatusModalLoading={setStatusModalLoading}
          openStatusModal={openStatusModal}
          handleStatusModalClose={handleStatusModalClose}
          handleStatusClick={handleStatusClick}
          show={show}
        />
      </div>
    </>
  );
};

export default BusinessCustomerDetail;
