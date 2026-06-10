import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout, LoginLayout } from "../layouts";
import { Dashboard } from "../pages";
import Login from "../pages/Login/Login";
import BusinessCustomer from "../pages/BusinessCustomer/BusinessCustomer";
import AdminUsers from "../pages/AdminUsers/AdminUsers";
import BusinessType from "../pages/BusinessType/BusinessType";
import EditProfile from "../pages/Profile/EditProfile";
import Sales from "../pages/Sales/Sales";
import CustomerPayments from "../pages/CustomerPayments/CustomerPayments";
import CustomerInvoice from "../pages/CustomerInvoice/CustomerInvoice";
// import ForgotPassword from "../pages/Login/components/ForgotPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import { GenericNavItemsLayout } from "../components/NavItems/GenericNavItemsLayout";
import { GenericNavItemsAccess } from "../components/NavItems/GenericNavItemsAccess";
import BusinessConfiguration from "../pages/BusinesConfiguration/BusinessConfiguration";
import BusinessCustomerDetail from "../pages/BusinessCustomer/BusinessCustomerDetail";
import AddOrUpdateTransaction from "../pages/CustomerPayments/AddOrUpdateTransaction";
import NextInvoice from "../pages/NextInvoices/NextInvoice";
import HelpTech from "../pages/HelpTech/HelpVideoCategories";
import Videos from "../pages/HelpTech/Videos/Videos";
import { AddOrUpdateHelpTech } from "../pages/HelpTech";
import { HelpVideoList } from "../pages/HelpTech/Videos";
import AddOrUpdateVideo from "../pages/HelpTech/Videos/components/AddOrUpdateVideo";
import ManageBusinessSettings from "../pages/BusinessType/ManageBusinessSettings";
import ManageCustomerBusinessSettings from "../pages/BusinesConfiguration/components/ManageCustomerBusinessSettings";
import ManageCustomerFBRSettings from "../pages/BusinesConfiguration/components/ManageCustomerFBRSettings";
import InvoiceReportingSettings from "../pages/Settings/InvoiceReportingSettings";
import ManagePlanSettings from "../pages/BusinessCustomer/ManagePlanSettings";
import PaymentAlertSettings from "../pages/Settings/PaymentAlertSettings";
import InvoiceTemplates from "../pages/InvoiceTemplates/InvoiceTemplates";
import RolesList from "../pages/Roles/RolesList";
import AddOrUpdateAdminUsers from "../pages/AdminUsers/AddOrUpdateAdminUsers";
import LeadStatusList from "../pages/LeadStatus/LeadStatusList";
import LeadsList from "../pages/Leads/LeadsList";
import LeadInternalNotes from "../pages/Leads/LeadInternalNotes";
import LeadDetail from "../pages/Leads/LeadDetail";
import AddOrEditLead from "../pages/Leads/AddOrEditLead";
import { AdminNavItemsAccess } from "../components/NavItems/AdminNavItemsAccess";
import LeadHistory from "../pages/Leads/LeadHistory";
import RequestedCsvFiles from "../pages/RequestedCSVFIles/RequestedCsvFiles";
import HelpVideoDetail from "../pages/HelpTech/Videos/HelpVideoDetail";

const Authentication = () => {
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard"> </Navigate>;
  } else {
    return <Navigate to="/login"> </Navigate>;
  }
};

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />

      {/* Login Layout */}
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            {" "}
            <DashboardLayout />{" "}
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard screen_path="/dashboard" />}
        />

        {/* Business Types Category */}
        <Route
          path="/business-category"
          element={<BusinessType screen_path="/business-category" />}
        />
        <Route
          path="/business-customer"
          element={<BusinessCustomer screen_path="/business-customer" />}
        />
      </Route>
    </Routes>
  );
}
