import React, { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

export const useAdminContext = () => useContext(AdminContext);
export function ContextAdmin({ children }) {
  const [navbarTitle, setNavBarTitle] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [settings, setSettings] = useState({});
  const [navItems, setNavItems] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);
  const [isBackButton, setIsBackButton] = useState(false);
  const [backRoute, setBackRoute] = useState(null);

  const checkNavItemAccessReadOnlyOrAll = (path, screen_type) => {
    let access_type = "disabled";

    if (!path || adminInfo?.role?.name == "Admin") {
      access_type = "all";
      return access_type;
    }

    let navItem = navItems?.find((item) => item.path === path);

    if (!navItem) {
      for (const item of navItems || []) {
        if (item.child_options && item.child_options.length > 0) {
          const childItem = item.child_options.find(
            (child) => child.path === path,
          );
          if (childItem) {
            navItem = childItem;
            break;
          }
        }
      }
    }

    if (!navItem) {
      access_type = "all";
      return access_type;
    } else if (navItem && navItem.access_type === "read_write") {
      access_type = "all";
      return access_type;
    } else {
      if (screen_type === "direct_screen") {
        return "disabled";
      } else {
        return access_type;
      }
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, [localStorage.getItem("user")]);

  const collection = {
    navbarTitle,
    setNavBarTitle,
    setUserInfo,
    userInfo,
    setSettings,
    settings,
    navItems,
    setNavItems,
    checkNavItemAccessReadOnlyOrAll,
    adminInfo,
    setAdminInfo,
    setIsBackButton,
    isBackButton,
    backRoute,
    setBackRoute,
  };

  return (
    <AdminContext.Provider value={collection}>{children}</AdminContext.Provider>
  );
}
