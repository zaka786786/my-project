import React from "react";
import Iconify from "../../components/Iconify";
import { useAdminContext } from "../../Hooks/AdminContext";

const getIcon = (name) => <Iconify icon={name} width={20} height={20} />;

export const SideBarConfig = () => {
  const { navItems, userInfo } = useAdminContext();
  const { barcode_generation_and_scanning } =
    userInfo?.business_portal_settings || {};
  let sidebarMenus = (navItems || [])
    .map((item) => {
      if (item?.value === "export-management") {
        return null;
      } else {
        const updated = { ...item };
        if (!barcode_generation_and_scanning && updated?.child_options) {
          updated.child_options = updated.child_options.filter(
            (child) => child?.value !== "barcode-listing",
          );
        }
        if (
          updated?.child_options &&
          Array.isArray(updated?.child_options) &&
          updated?.child_options?.length === 0
        ) {
          delete updated?.child_options;
        }

        return updated;
      }
    })
    .filter((item) => item !== null);

  return sidebarMenus;
};

// export const SideBarConfig = ({ setOpenLogout }) => {
//   let sidebarMenus = [];

//   const logout = async () => {
//     setOpenLogout(true);
//   };

//   sidebarMenus.push({
//     title: "Dashboard",
//     path: "/dashboard",
//     icon: getIcon("eva:pie-chart-2-fill"),
//   });

//   sidebarMenus.push({
//     title: "Business Accounts",
//     icon: getIcon("material-symbols:category"),
//     child_options: [
//       {
//         title: "General Business Accounts",
//         path: "/business-customer",
//       },
//       {
//         title: "Demo Business Accounts",
//         path: "/demo-business-accounts",
//       },
//     ],
//   });

//   sidebarMenus.push({
//     title: "Business Category",
//     path: "/business-category",
//     icon: getIcon("material-symbols:category"),
//   });

//   sidebarMenus.push({
//     title: "Manage Team",
//     icon: getIcon("mdi:account-multiple"),
//     child_options: [
//       {
//         title: "Admin Users",
//         path: "/admin-users",
//       },
//       {
//         title: "Roles",
//         path: "/roles",
//       },
//     ],
//   });

//   sidebarMenus.push({
//     title: "Payments",
//     path: "/payments",
//     icon: getIcon("tdesign:undertake-transaction"),
//   });
//   sidebarMenus.push({
//     title: "Help Tech",
//     path: "/help-video-categories",
//     icon: getIcon("mdi:help-circle"),
//   });
//   sidebarMenus.push({
//     title: "Invoice Templates",
//     path: "/invoice-templates",
//     icon: getIcon("mdi:file-document"),
//   });

//   sidebarMenus.push({
//     title: "Navitems",
//     icon: getIcon("mage:dash-menu"),
//     child_options: [
//       {
//         title: "Admin Navitems",
//         path: "/admin-navitems",
//       },
//       {
//         title: "Business Customer Navitems",
//         path: "/business-customer-navitems",
//       },
//     ],
//   });

//   sidebarMenus.push({
//     title: "Settings",
//     icon: getIcon("mdi:settings"),
//     child_options: [
//       {
//         title: "Invoice Reporting Settings",
//         path: "/invoice-reporting-settings",
//       },
//       {
//         title: "Payment Alert Settings",
//         path: "/payment-alert-settings",
//       },
//     ],
//   });

//   sidebarMenus.push({
//     title: "Lead Management",
//     icon: getIcon("ix:user-management-settings-filled"),
//     child_options: [
//       {
//         title: "Lead Status",
//         path: "/lead-status",
//       },
//       {
//         title: "Leads",
//         path: "/leads",
//       },
//     ],
//   });

//   return sidebarMenus;
// };
