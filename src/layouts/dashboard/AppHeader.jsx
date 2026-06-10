import React from "react";
import { Toolbar, CssBaseline, AppBar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountPopover from "./AccountPopover";
import { useAdminContext } from "../../Hooks/AdminContext";
import Iconify from "../../components/Iconify";
import { useNavigate } from "react-router-dom";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

const drawerWidth = 260;
const collapsedDrawerWidth = 70;

function AppHeader({
  handleDrawerToggle,
  setIsLoading,
  sidebarCollapsed,
  sidebarHovered,
  handleSidebarToggle,
}) {
  const { navbarTitle, isBackButton, backRoute } = useAdminContext();
  const navigate = useNavigate();

  const sidebarWidth =
    sidebarCollapsed && !sidebarHovered ? collapsedDrawerWidth : drawerWidth;

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          ml: { sm: `${sidebarWidth}px` },
          bgcolor: "#fff",
        }}
        elevation={0}
      >
        <Toolbar className="d-flex justify-content-between align-items-center shadow-sm py-1 mui-toolbar">
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" }, color: "#555" }}
          >
            <MenuIcon />
          </IconButton>

          <div className="d-flex align-items-center w-100">
            {/* <IconButton
              onClick={handleSidebarToggle}
              //  sx={{ display: { xs: "none", sm: "block" }  }}

              // sx={{
              //   display: { xs: "none", sm: "inline-flex" },
              //   width: 36,
              //   height: 36,
              //   minWidth: 36,
              //   minHeight: 36,
              //   padding: 0,
              //   borderRadius: "8px",
              // }}
            >
              <Iconify icon={sidebarCollapsed ? "mdi:menu" : "mdi:menu-open"} />
            </IconButton> */}

            <IconButton
              onClick={handleSidebarToggle}
              className="me-1"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                width: { xs: "30px", sm: "35px" },
                height: { xs: "30px", sm: "35px" },
                zIndex: "99999",
              }}
            >
              {/* <Iconify
                icon={sidebarCollapsed ? "mdi:menu" : "mdi:menu-open"}
                width={24}
                height={24}
                // style={{
                //   display: "block",
                // }}

                sx={{
                  color: "#555555",
                  transition:
                    "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                  zIndex: "-99999",
                  display: "block",
                }}
              /> */}

              {/* {sidebarCollapsed ? (
                <MenuIcon sx={{ fontSize: 24, color: "#555555" }} />
              ) : (
                <MenuOpenIcon sx={{ fontSize: 24, color: "#555555" }} />
              )} */}

              <span className="menu-icon-setting">
                {sidebarCollapsed ? "☰" : "☰❮"}
              </span>
              {/* a */}
            </IconButton>

            {isBackButton && (
              <IconButton
                onClick={() => {
                  if (backRoute) {
                    navigate(backRoute, { replace: true });
                  } else {
                    window.history.back();
                  }
                }}
                className="me-2 shadow-sm"
                sx={{
                  width: { xs: "30px", sm: "35px" },
                  height: { xs: "30px", sm: "35px" },
                  backgroundColor: "rgba(221, 233, 244, 0.7)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(221, 233, 244, 1)",
                  },
                }}
              >
                <Iconify
                  icon={"mdi:arrow-left"}
                  sx={{
                    fontSize: { xs: 14, sm: 16 },
                    color: "#3C668C",
                    transition:
                      "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                  }}
                />
              </IconButton>
            )}

            <h3 className="header-title my-0 d-none d-sm-block">
              {navbarTitle?.en || navbarTitle || ""}
              <span className="urdu-label">{navbarTitle?.ur}</span>
            </h3>
          </div>

          <AccountPopover setIsLoading={setIsLoading} />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default AppHeader;
