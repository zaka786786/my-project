import { useEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Stack,
  MenuItem,
} from "@mui/material";
import { UserIcon } from "../../assets";
import { useAdminContext } from "../../Hooks/AdminContext";
import { imageBaseUrl } from "../../config/config";
import MenuPopover from "../../components/menuOption/MenuPopover";
import { Icon } from "@iconify/react";
import { _logout_api } from "../../DAL/Login/login";
import { useSnackbar } from "notistack";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import ChangePassword from "../../components/ChangePassword";
import LogoutConfirmation from "../../components/LogoutConfirmation";
// ----------------------------------------------------------------------

export default function AccountPopover({ setIsLoading }) {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const { userInfo } = useAdminContext();
  const [open, setOpen] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  // const [openUpdateProfile, setOpenUpdateProfile] = useState(false);
  const [selectedValue, setSelectedValue] = useState("this");
  const [modalStateChangePassword, setModalStateChangePassword] =
    useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { pathname } = useLocation();

  const match = (path) =>
    path ? !!matchPath({ path, end: false }, pathname) : false;

  useEffect(() => {
    setTimeout(() => {
      const is_path_includes = (path) => {
        return pathname.toString().includes(path);
      };
      if (!is_path_includes("/payments")) {
        localStorage.removeItem("FilterData_Payments_List");
        localStorage.removeItem("PaymentStatusTabValue");
      }
      if (!is_path_includes("/next-invoices")) {
        localStorage.removeItem("FilterData_NextInvoices_List");
      }
      if (!is_path_includes("/help-video-categories")) {
        localStorage.removeItem("help-video-search");
        localStorage.removeItem("video-list-search");
      }
      if (!is_path_includes("/business-customer")) {
        localStorage.removeItem("FilterData_Business_List");
        localStorage.removeItem("business-customer-search");
      }
      if (!is_path_includes("/business-customer")) {
        sessionStorage.removeItem("search-text-general-users");
      }
      if (!is_path_includes("/demo-business-accounts")) {
        sessionStorage.removeItem("search-text-demo-users");
      }
    }, 300);
  }, [pathname]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickEditProfile = () => {
    // setOpenUpdateProfile(true);
    handleClose();
    navigate("/edit-profile");
  };

  const handleClickChangePassword = () => {
    setModalStateChangePassword(true);
    handleClose();
  };
  const handleClickLogout = () => {
    handleClose();
    setOpenLogout(true);
  };

  const logoutConfirmed = async () => {
    setLogoutLoading(true);
    const result = await _logout_api(selectedValue);
    if (result.code === 200) {
      localStorage.removeItem("token");
      navigate("/login");
      setOpenLogout(false);
      setLogoutLoading(false);
      setOpen(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setOpenLogout(false);
      setLogoutLoading(false);
      setOpenLogout(false);
    }
  };

  const MENU_OPTIONS = [
    // {
    //   label: "Edit Profile",
    //   icon: "iconoir:page-edit",
    //   color: "#5792c9",
    //   path: "/edit-profile",
    //   handleClick: handleClickEditProfile,
    // },
    // {
    //   label: "Change Password",
    //   icon: "qlementine-icons:password-16",
    //   color: "#5792c9",
    //   path: "/change-password",
    //   handleClick: handleClickChangePassword,
    // },

    {
      label: "Logout",
      icon: "mdi:logout",
      color: "#5792c9",
      path: "/logout",
      handleClick: handleClickLogout,
    },
  ];

  return (
    <>
      <LogoutConfirmation
        open={openLogout}
        setOpen={setOpenLogout}
        handleAgree={logoutConfirmed}
        isLoading={logoutLoading}
        title={"Are you sure you want to Logout?"}
        // buttonText="Logout"
        selected={selectedValue}
        setSelected={setSelectedValue}
      />

      {/* <UpdateProfile
        modalState={openUpdateProfile}
        setModalState={setOpenUpdateProfile}
      /> */}

      <ChangePassword
        modalState={modalStateChangePassword}
        setModalState={setModalStateChangePassword}
      />

      <div className=" px-0 ">
        <div ref={anchorRef} className="d-flex justify-content-between">
          <div className="left-item">{/* <Notifications /> */}</div>
          <div className="right-item ms-3">
            <div className="profile-container" onClick={handleOpen}>
              <div className="profile-avatar">
                <Avatar
                  variant="rounded"
                  sx={{ width: 30, height: 30 }}
                  src={
                    userInfo?.profile_image
                      ? imageBaseUrl + userInfo?.profile_image
                      : UserIcon
                  }
                  // src={
                  //   "https://www.interactivebrokers.com/images/web/hero-microsite-fund-admin.jpg"
                  // }
                />
              </div>
              <div className="profile-info">
                <span className="user-name">{userInfo?.first_name}</span>
                {/* <span className="user-role">
                {userInfo?.user_id?.type == 0 ? "Admin" : "User"}
              </span> */}
              </div>

              <span className="chevron-icon pointer">
                <i
                  className={`ms-3 me-2 fa-solid ${
                    open ? "fa-chevron-up" : "fa-chevron-down"
                  } `}
                ></i>
              </span>
            </div>
          </div>
        </div>

        <MenuPopover
          open={Boolean(open)}
          anchorEl={anchorRef.current}
          // anchorEl={open}
          onClose={handleClose}
          sx={{
            p: 0,
            mt: 1.5,
            ml: 0.75,
            minWidth: 220,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          }}
        >
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {userInfo?.first_name} {userInfo?.last_name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              {userInfo?.user_id?.email}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: "dashed" }} />

          <Stack sx={{ p: 1 }}>
            {MENU_OPTIONS.map((option) => (
              <MenuItem
                key={option.label}
                // to={option.path}
                // component={RouterLink}
                onClick={option.handleClick}
                sx={{
                  color: match(option.path)
                    ? (theme) => theme.palette.primary.main
                    : "black",
                  lineHeight: 1.83,
                  "&:hover": {
                    color: "#5792c9",
                  },
                  bgcolor: match(option.path)
                    ? (theme) =>
                        alpha(
                          theme.palette.primary.main,
                          theme.palette.action.selectedOpacity,
                        )
                    : "",
                }}
                // onClick={handleClose}
                className="profile-menu"
              >
                {option.icon && (
                  <Icon
                    fontSize="18"
                    style={{ color: option.color }}
                    className="me-2"
                    icon={option.icon}
                  />
                )}
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        </MenuPopover>
      </div>
    </>
  );
}
