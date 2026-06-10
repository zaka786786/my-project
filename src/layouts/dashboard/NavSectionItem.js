import React, { useEffect, useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  matchPath,
  NavLink as RouterLink,
  useLocation,
} from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Iconify from "../../components/Iconify";
import { imageBaseUrl } from "../../config/config";

export default function NavSectionItem({
  data,
  searchInput,
  isCollapsed,
  isHovered,
  isMembershipExpired,
}) {
  const { pathname, search } = useLocation();

  const moduleParam = new URLSearchParams(search).get("module");

  const [openDropdown, setOpenDropdown] = useState(false);
  const [itemData, setItemData] = useState({});
  const [imageError, setImageError] = useState({});

  const handleClickDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleClickChildDropdown = (index) => {
    setItemData((old) => {
      let options = old.child_options.map((child, c_index) => {
        if (c_index === index) {
          child.is_open = !Boolean(child.is_open);
        }
        return child;
      });

      return { ...old, child_options: options };
    });
  };

  const handleImageError = (key) => {
    setImageError((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const match = ({ path, matches }) => {
    const testPath = moduleParam || pathname;

    if (matches) {
      return matches.some(
        (m) => m && !!matchPath({ path: m, end: false }, testPath),
      );
    }

    return !!(path && matchPath({ path, end: false }, testPath));
  };

  const open_dropdown = (match_str) => {
    const testPath = moduleParam || pathname;

    const is_matched =
      match_str && !!matchPath({ path: match_str, end: false }, testPath);

    if (is_matched) {
      setOpenDropdown(true);
    }
  };

  useEffect(() => {
    if (searchInput) {
      setOpenDropdown(true);
    } else {
      setOpenDropdown(false);
    }

    let ch_options = data.child_options?.map((child_option) => {
      if (child_option?.child_options?.length > 0) {
        child_option.child_options.forEach((c_option) => {
          const is_active = match({
            path: c_option.path,
            matches: c_option.matches,
          });

          if (is_active || searchInput) {
            setOpenDropdown(true);
            child_option.is_open = true;
          }
        });
      } else {
        if (child_option.matches) {
          child_option.matches.forEach((m) => open_dropdown(m));
        }

        open_dropdown(child_option.path);
      }

      return child_option;
    });

    setItemData({
      ...data,
      child_options: ch_options,
    });
  }, [searchInput, pathname, moduleParam, data]);

  const mainButton = (
    <ListItemButton
      component={data.path && !isMembershipExpired ? RouterLink : "div"}
      to={data.path && !isMembershipExpired ? data.path : ""}
      onClick={(e) => {
        if (isMembershipExpired) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        data.on_click ? data.on_click() : handleClickDropdown();
      }}
      className={`${
        match({ path: data.path, matches: data.matches })
          ? "menuActive menus-list"
          : "menus-list"
      } ${isMembershipExpired ? "disabled-membership" : ""}`}
      sx={{
        display: "flex",
        minHeight: 48,
        justifyContent: isCollapsed && !isHovered ? "center" : "initial",
        px: isCollapsed && !isHovered ? 0 : 2.5,
      }}
    >
      <div
        className="sidebar-icons"
        style={{
          marginRight: isCollapsed && !isHovered ? 0 : "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {data.icon && !imageError[`main-${data.title}`] ? (
          <img
            alt={data?.title || ""}
            src={imageBaseUrl + data.icon}
            onError={() => handleImageError(`main-${data.title}`)}
            width={20}
            height={20}
          />
        ) : (
          <Iconify icon="mdi:menu" width={20} height={20} />
        )}
      </div>

      {(!isCollapsed || isHovered) && (
        <>
          <ListItemText className="sidebar-text" primary={data.title} />

          {data.child_options &&
            (openDropdown ? (
              <ExpandLess
                style={{
                  marginLeft: "auto",
                }}
              />
            ) : (
              <ExpandMore />
            ))}
        </>
      )}
    </ListItemButton>
  );

  return (
    <>
      <div className={isMembershipExpired ? "disabled-membership-wrapper" : ""}>
        {isCollapsed && !isHovered ? (
          <Tooltip title={data.title} placement="right">
            {mainButton}
          </Tooltip>
        ) : (
          mainButton
        )}
      </div>

      {(!isCollapsed || isHovered) && itemData.child_options && (
        <Collapse in={openDropdown} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {itemData.child_options.map((child_option, child_index) => (
              <React.Fragment key={child_index}>
                <ListItemButton
                  component={
                    child_option.path && !isMembershipExpired
                      ? RouterLink
                      : "div"
                  }
                  to={
                    child_option.path && !isMembershipExpired
                      ? child_option.path
                      : ""
                  }
                  onClick={() => {
                    child_option.on_click
                      ? child_option.on_click()
                      : handleClickChildDropdown(child_index);
                  }}
                  className={`${
                    match({
                      path: child_option.path,
                      matches: child_option.matches,
                    })
                      ? "menuActive menus-list"
                      : "menus-list child-menus-list"
                  }`}
                >
                  <div className="child_dot d-flex align-items-center w-100">
                    <ListItemText primary={child_option.title} />

                    {child_option.child_options &&
                      (child_option.is_open ? (
                        <ExpandLess
                          style={{
                            marginLeft: "auto",
                          }}
                        />
                      ) : (
                        <ExpandMore />
                      ))}
                  </div>
                </ListItemButton>

                <Collapse
                  in={child_option.is_open}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {child_option?.child_options?.map(
                      (child_option1, child_index1) => (
                        <ListItemButton
                          key={child_index1}
                          component={
                            child_option1.path && !isMembershipExpired
                              ? RouterLink
                              : "div"
                          }
                          to={
                            child_option1.path && !isMembershipExpired
                              ? child_option1.path
                              : ""
                          }
                          className={`${
                            match({
                              path: child_option1.path,
                              matches: child_option1.matches,
                            })
                              ? "menuActive menus-list"
                              : "menus-list child-menus-list"
                          }`}
                        >
                          <div className="child_dot d-flex align-items-center ms-3">
                            <Iconify
                              icon="mdi:circle-small"
                              width={14}
                              height={14}
                              style={{
                                marginRight: 6,
                              }}
                            />

                            <ListItemText primary={child_option1.title} />
                          </div>
                        </ListItemButton>
                      ),
                    )}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
