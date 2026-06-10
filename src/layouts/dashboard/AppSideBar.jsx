import React, { useEffect, useState } from "react";
import { Toolbar, Drawer, Divider, Box, Tooltip } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavSection from "./NavSection";
import { SideBarConfig } from "./SideBarConfig";
import { LogoNew } from "../../assets";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { _logout_api } from "../../DAL/Login/login";
import { useSnackbar } from "notistack";

const drawerWidth = 260;
const collapsedDrawerWidth = 70;

function AppSideBar({
  mobileOpen,
  handleDrawerToggle,
  sidebarCollapsed,
  sidebarHovered,
  setSidebarHovered,
}) {
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const location = useLocation();
  const [openLogout, setOpenLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isLeadNotesPage = location.pathname.includes("/leads/notes/");

  let nav_items = SideBarConfig({ setOpenLogout });

  const drawerWidthFinal =
    sidebarCollapsed && !sidebarHovered ? collapsedDrawerWidth : drawerWidth;

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  function handleScroll() {
    const isScrolled =
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop) > window.innerHeight;
    setShowScrollArrow(isScrolled);
  }
  const drawer = (
    <>
      <div className="text-center p-2">
        <img
          src={LogoNew}
          alt="Logo"
          style={{
            maxWidth: sidebarCollapsed && !sidebarHovered ? "40px" : "120px",
            transition: "all 0.3s ease",
          }}
        />
      </div>

      <Divider />

      <NavSection
        navConfig={nav_items}
        isCollapsed={sidebarCollapsed}
        isHovered={sidebarHovered}
      />
    </>
  );

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const isScrolled = window.pageYOffset > window.innerHeight;
      setShowScrollArrow(isScrolled);
    });

    return () => window.removeEventListener("scroll", () => {});
  }, []);

  return (
    <>
      <DeleteConfirmation
        open={openLogout}
        isLoading={logoutLoading}
        setOpen={setOpenLogout}
        title={"Are you sure you want to Logout?"}
      />

      <Box component="nav" sx={{ width: { sm: drawerWidthFinal } }}>
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidthFinal,
              transition: "width 0.3s ease",
              borderRight: "2px dashed #cecece80",
            },
          }}
          open
          onMouseEnter={() => sidebarCollapsed && setSidebarHovered(true)}
          onMouseLeave={() => sidebarCollapsed && setSidebarHovered(false)}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: { xs: 3, sm: 0, md: 0 },
          pb: { xs: 3, sm: 0, md: 0 },

          paddingBottom: {
            md: "100px",
          },
          minHeight: "100vh",
          width: "100%",
          width: { sm: `calc(100% - ${drawerWidthFinal}px)` },
          //  width: { sm: `calc(100% - ${sidebarWidth}px)`},

          overflow: "auto",
        }}
        // sx={{ flexGrow: 1, p: 3 }}
        className={isLeadNotesPage ? "pb-0" : ""}
      >
        <Toolbar />
        <Outlet />

        <div
          className="scroll-top-community"
          style={{
            bottom: showScrollArrow ? "40px" : "-80px",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Tooltip title="Scroll to top">
            <div>
              <i className="fa-solid fa-arrow-up"></i>
            </div>
          </Tooltip>
        </div>
      </Box>
    </>
  );
}

export default AppSideBar;
