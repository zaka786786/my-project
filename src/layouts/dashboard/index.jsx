import React, { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import AppSideBar from "./AppSideBar";
import { useLocation, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useSnackbar } from "notistack";
import { useAdminContext } from "../../Hooks/AdminContext";
import { _get_init_admin } from "../../DAL/Login/login";
import { useRef } from "react";
import { clearPreviousRouteSession } from "../../utils/sessionUtils";

const useStyles = makeStyles(() => ({
  loading: {
    marginLeft: "50%",
    marginTop: "20%",
  },
}));

export default function DashboardLayout() {
  const classes = useStyles();
  const pathname = useLocation();
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setNavItems, setAdminInfo } = useAdminContext();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SavedSidebarCollapsed = localStorage.getItem("sidebarCollapsed");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    SavedSidebarCollapsed === "false" ? false : true,
  );

  const [sidebarHovered, setSidebarHovered] = useState(false);

  const handleSidebarToggle = () => {
    localStorage.setItem("sidebarCollapsed", !sidebarCollapsed);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleInit = async () => {
    let data = {
      code: 200,
      message: "Init Admin Successfully",
      admin: {
        role: {
          _id: "6a018796a6fa4c206ce5b07e",
          name: "Admin",
          alias_title: "admin",
        },
        _id: "6835c6b36af90cac1ad90d0f",
        user_id: {
          _id: "6835c6b36af90cac1ad90d0d",
          email: "dynamiclogix@gmail.com",
          two_factor_auth: false,
        },
        first_name: "Dynamic",
        last_name: "Logix",
        address:
          "Saeed Center 1st Floor office no 2, Sahiwal, Sahiwal District, Punjab 57000",
        status: true,
        createdAt: "2025-05-27T14:05:39.170Z",
        updatedAt: "2026-05-06T12:08:37.536Z",
        __v: 2,
        profile_image: "images/e002b814-5fc2-47a7-a39e-db18cd801a87.jpeg",
        phone_number: "+92 341-3267901",
        email: "dynamiclogix@gmail.com",
      },

      nav_items: [
        {
          _id: "f768a0e3-5e6a-4b54-b69f-0bab65578dd3",
          icon: "images/8093635e-d276-4e55-831c-692b74b181eb.jpeg",
          is_link: true,
          is_open_new_tab: false,
          link: "/dashboard",
          order: 1,
          path: "/dashboard",
          title: "Dashboard",
          value: "dashbaord",
          child_options: [],
        },
        {
          _id: "f271c5f4-599c-45a1-81af-3f8cbac60c37",
          icon: "images/d2581887-c01f-40c7-9e43-59fbfb505cea.jpeg",
          is_link: true,
          is_open_new_tab: false,
          link: "/business-category",
          order: 3,
          path: "/business-category",
          title: "Business Category",
          value: "business-category",
          child_options: [],
        },
        {
          _id: "f271c5f4-599c-45a1-81af-3f8cbac60c37",
          icon: "images/d2581887-c01f-40c7-9e43-59fbfb505cea.jpeg",
          is_link: true,
          is_open_new_tab: false,
          link: "/business-customer",
          order: 3,
          path: "/business-customer",
          title: "General Business Accounts",
          value: "business-customer",
          child_options: [],
        },
      ],
    };
    // const result = await _get_init_admin();
    const result = data;
    if (result?.code === 200) {
      setNavItems(result?.nav_items);
      setAdminInfo(result?.admin);
    }
  };

  useEffect(() => {
    clearPreviousRouteSession(previousPath.current, location.pathname);
    previousPath.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else handleInit();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }

  return (
    <>
      <Helmet>
        <title>Testing Project</title>
      </Helmet>

      <div className="d-flex position-relative">
        <AppHeader
          handleDrawerToggle={handleDrawerToggle}
          setIsLoading={setIsLoading}
          // sidebarCollapsed={sidebarCollapsed}
          sidebarCollapsed={mobileOpen ? false : sidebarCollapsed}
          sidebarHovered={sidebarHovered}
          handleSidebarToggle={handleSidebarToggle}
        />

        <AppSideBar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          // sidebarCollapsed={sidebarCollapsed}
          sidebarCollapsed={mobileOpen ? false : sidebarCollapsed}
          sidebarHovered={sidebarHovered}
          setSidebarHovered={setSidebarHovered}
        />
      </div>
    </>
  );
}
