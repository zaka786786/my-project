import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
  startTransition,
} from "react";

import {
  _update_NavItemAccess,
  _NavItemAccess,
} from "../../DAL/Navitems/generalNavitems";

import {
  _get_navitems_for_business_categories,
  _update_navitems_for_business_categories,
} from "../../DAL/BusinessCategories/business_categories";

import { useAdminContext } from "../../Hooks/AdminContext";

import ActiveLastBreadcrumb from "../../components/BreadCrums";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Checkbox,
  Skeleton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

import { imageBaseUrl } from "../../config/config";

import Iconify from "../../components/Iconify";
import {
  _get_role_nav_items,
  _update_nav_items_role,
} from "../../DAL/Roles/roles";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const EMPTY_CHILDREN = [];

// ─────────────────────────────────────────────
// DisplayField
// ─────────────────────────────────────────────
const DisplayField = memo(({ label, value }) => (
  <TextField
    label={label}
    value={value || ""}
    size="small"
    fullWidth
    disabled
  />
));

// ─────────────────────────────────────────────
// NavIcon
// ─────────────────────────────────────────────
const NavIcon = memo(({ iconName }) => {
  if (!iconName) {
    return (
      <Typography variant="body2" color="textSecondary">
        No icon
      </Typography>
    );
  }

  return (
    <img
      src={imageBaseUrl + iconName}
      width={30}
      height={30}
      alt="nav-icon"
      loading="lazy"
      style={{ objectFit: "contain" }}
    />
  );
});

// ─────────────────────────────────────────────
// ChildCard
// ─────────────────────────────────────────────
const ChildCard = memo(
  ({
    child,
    isChecked,
    onToggle,
    onAccessTypeChange,
    parentIndex,
    childIndex,
  }) => {
    return (
      <Grid item xs={12}>
        <Box
          sx={{
            background: "#fafafa",
            borderRadius: "8px",
            p: 2,
            mb: 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Checkbox */}
            <Grid item xs={12} sm={1}>
              <Checkbox
                checked={isChecked}
                onChange={() => onToggle(child.id)}
                color="primary"
              />
            </Grid>

            {/* Title */}
            <Grid item xs={12} sm={5}>
              <DisplayField label="Child Title" value={child.title} />
            </Grid>

            {/* Access Type */}
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth size="small">
                <InputLabel id={`child-access-${child.id}`}>
                  Access Type
                </InputLabel>

                <Select
                  disabled={!isChecked}
                  label="Access Type"
                  labelId={`child-access-${child.id}`}
                  value={child.accessType}
                  onChange={(e) =>
                    onAccessTypeChange(e, parentIndex, childIndex, "child")
                  }
                >
                  <MenuItem value="read_only">Read Only</MenuItem>

                  <MenuItem value="read_write">Read & Write</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Icon */}
            <Grid item xs={12} sm={1}>
              <NavIcon iconName={child.icon} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  },
);

// ─────────────────────────────────────────────
// ParentCard
// ─────────────────────────────────────────────
const ParentCard = memo(
  ({
    item,
    parentIndex,
    isChecked,
    isExpanded,
    isIndeterminate,
    isParentChecked,
    onParentToggle,
    onChildToggle,
    onToggleExpand,
    onAccessTypeChange,
    selectedNavItems,
    isLast,
    lastParentRef,
  }) => {
    const hasChildren = item.children?.length > 0;

    return (
      <Card
        elevation={4}
        sx={{ mb: 3, p: 2 }}
        ref={isLast ? lastParentRef : null}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Checkbox */}
            <Grid item xs={12} sm={1}>
              <Checkbox
                checked={isParentChecked(item.id, item.children)}
                indeterminate={isIndeterminate(item.children)}
                onChange={() =>
                  onParentToggle(
                    item.id,
                    true,
                    item.children || EMPTY_CHILDREN,
                    item.accessType,
                  )
                }
                color="primary"
              />
            </Grid>

            {/* Title */}
            <Grid item xs={12} sm={5}>
              <DisplayField label="Title" value={item.title} />
            </Grid>

            {/* Parent without children */}
            {!hasChildren && (
              <>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`access-type-${item.id}`}>
                      Access Type
                    </InputLabel>

                    <Select
                      label="Access Type"
                      labelId={`access-type-${item.id}`}
                      disabled={!isParentChecked(item.id, item.children)}
                      value={item.accessType}
                      onChange={(e) =>
                        onAccessTypeChange(e, parentIndex, 0, "parent")
                      }
                    >
                      <MenuItem value="read_only">Read Only</MenuItem>

                      <MenuItem value="read_write">Read & Write</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={1}>
                  <NavIcon iconName={item.icon} />
                </Grid>
              </>
            )}

            {/* Expand Button */}
            {hasChildren && (
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={() => onToggleExpand(item.id)}>
                  <Iconify
                    icon={
                      isExpanded
                        ? "eva:arrow-ios-upward-outline"
                        : "eva:arrow-ios-downward-outline"
                    }
                  />
                </IconButton>
              </Grid>
            )}

            {/* Children */}
            {isExpanded &&
              item.children?.map((child, childIndex) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  isChecked={!!selectedNavItems[child.id]}
                  onToggle={(childId) =>
                    onChildToggle(
                      childId,
                      false,
                      null,
                      child.accessType,
                      item.id,
                    )
                  }
                  onAccessTypeChange={onAccessTypeChange}
                  parentIndex={parentIndex}
                  childIndex={childIndex}
                />
              ))}
          </Grid>
        </CardContent>
      </Card>
    );
  },
);

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
const NavItemsSkeleton = memo(() => (
  <Box sx={{ p: 2 }}>
    {[...Array(5)].map((_, i) => (
      <Card key={i} elevation={3} sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <Skeleton variant="rectangular" width={24} height={24} />
            </Grid>

            <Grid item xs={5}>
              <Skeleton height={40} />
            </Grid>

            <Grid item xs={5}>
              <Skeleton height={40} />
            </Grid>

            <Grid item xs={1}>
              <Skeleton variant="circular" width={30} height={30} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ))}
  </Box>
));

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export function AdminNavItemsAccess(props) {
  const params = useParams();

  const from = new URLSearchParams(window.location.search).get("from");

  const isRoleCategory = props["componentType"] === "roles";

  const type = props.type;
  const componentType = props.componentType;

  const cat_id = isRoleCategory ? params?.user_id : null;

  const user_id = isRoleCategory ? null : params?.user_id;

  const { enqueueSnackbar } = useSnackbar();

  const { setNavBarTitle, setIsBackButton } = useAdminContext();

  const lastParentRef = useRef(null);

  const [selectedNavItems, setSelectedNavItems] = useState({});

  const [navItems, setNavItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [expandedParents, setExpandedParents] = useState({});

  const [user, setUser] = useState({});

  const [category, setCategory] = useState({});

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const allNavItemIds = useMemo(
    () =>
      navItems.flatMap((item) => [
        item.id,
        ...(item.children || []).map((child) => child.id),
      ]),
    [navItems],
  );

  const isAllSelected = useMemo(
    () =>
      allNavItemIds.length > 0 &&
      allNavItemIds.every((id) => selectedNavItems[id]),
    [allNavItemIds, selectedNavItems],
  );

  const isIndeterminate = useCallback(
    (children = []) => {
      const selectedChildren = children.filter(
        (child) => selectedNavItems[child.id],
      ).length;

      return selectedChildren > 0 && selectedChildren < children.length;
    },
    [selectedNavItems],
  );

  const isParentChecked = useCallback(
    (parentId, children = []) => {
      if (selectedNavItems[parentId]) return true;

      if (!children.length) return false;

      return children.every((child) => selectedNavItems[child.id]);
    },
    [selectedNavItems],
  );

  // ─────────────────────────────────────────────
  // Select All
  // ─────────────────────────────────────────────
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedNavItems({});
    } else {
      const selections = {};

      navItems.forEach((item) => {
        selections[item.id] = {
          accessType: item.accessType,
        };

        item.children?.forEach((child) => {
          selections[child.id] = {
            accessType: child.accessType,
          };
        });
      });

      setSelectedNavItems(selections);
    }
  }, [isAllSelected, navItems]);

  // ─────────────────────────────────────────────
  // Expand
  // ─────────────────────────────────────────────
  const toggleChildrenVisibility = useCallback((parentId) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  }, []);

  // ─────────────────────────────────────────────
  // Checkbox Toggle
  // ─────────────────────────────────────────────
  const handleCheckboxToggle = useCallback(
    (id, isParent = false, children = [], accessType, parentId = null) => {
      setSelectedNavItems((prev) => {
        const updated = {
          ...prev,
        };

        const isSelected = !!updated[id];

        if (isSelected) {
          delete updated[id];

          if (isParent) {
            children.forEach((child) => {
              delete updated[child.id];
            });
          }
        } else {
          updated[id] = {
            accessType,
          };

          if (isParent) {
            children.forEach((child) => {
              updated[child.id] = {
                accessType: child.accessType,
              };
            });
          }

          if (parentId) {
            const parent = navItems.find((item) => item.id === parentId);

            if (parent) {
              updated[parentId] = {
                accessType: parent.accessType,
              };
            }
          }
        }

        return updated;
      });
    },
    [navItems],
  );

  // ─────────────────────────────────────────────
  // Access Type Change
  // ─────────────────────────────────────────────
  const handleAccessTypeChange = useCallback(
    (e, parentIndex, childIndex, itemType) => {
      const newValue = e.target.value;

      setNavItems((prev) => {
        const updated = [...prev];

        if (itemType === "parent") {
          updated[parentIndex] = {
            ...updated[parentIndex],
            accessType: newValue,
          };

          setSelectedNavItems((old) => ({
            ...old,
            [updated[parentIndex].id]: {
              ...old[updated[parentIndex].id],
              accessType: newValue,
            },
          }));
        } else {
          updated[parentIndex].children[childIndex] = {
            ...updated[parentIndex].children[childIndex],
            accessType: newValue,
          };

          const childId = updated[parentIndex].children[childIndex].id;

          setSelectedNavItems((old) => ({
            ...old,
            [childId]: {
              ...old[childId],
              accessType: newValue,
            },
          }));
        }

        return updated;
      });
    },
    [],
  );

  // ─────────────────────────────────────────────
  // Transform API Data
  // ─────────────────────────────────────────────
  const transformApiData = useCallback((apiItems, userNavItems = []) => {
    const userNavItemsMap = {};

    userNavItems.forEach((item) => {
      userNavItemsMap[item.item_id] = {
        access_type: item.access_type,
      };

      if (Array.isArray(item.child_options)) {
        item.child_options.forEach((child) => {
          userNavItemsMap[child.item_id] = {
            access_type: child.access_type,
          };
        });
      }
    });

    return apiItems.map((item) => {
      const userItem = userNavItemsMap[item._id];

      return {
        id: item._id,
        title: item.title || "",
        path: item.path || "",
        icon: item.icon || "",

        accessType: userItem?.access_type || item?.access_type || "read_write",

        children: (item.child_options || []).map((child) => {
          const userChild = userNavItemsMap[child._id];

          return {
            id: child._id,
            title: child.title || "",
            path: child.path || "",
            icon: child.icon || "",

            accessType:
              userChild?.access_type || child?.access_type || "read_write",
          };
        }),
      };
    });
  }, []);

  // ─────────────────────────────────────────────
  // Get Nav Items
  // ─────────────────────────────────────────────
  const getNavItems = useCallback(async () => {
    setIsLoading(true);

    try {
      let response;

      if (isRoleCategory) {
        response = await _get_role_nav_items(cat_id);
      } else {
        response = await _NavItemAccess(type, user_id);
      }

      const transformedItems = transformApiData(
        response?.default_nav_items,
        response?.nav_items || [],
      );

      const selections = {};

      (response?.nav_items || []).forEach((item) => {
        selections[item.item_id] = {
          accessType: item.access_type || "read_write",
        };

        (item.child_options || []).forEach((child) => {
          selections[child.item_id] = {
            accessType: child.access_type || "read_write",
          };
        });
      });

      setSelectedNavItems(selections);

      if (isRoleCategory) {
        setCategory({
          title: response?.role?.name,
        });
      } else {
        setUser({
          fullname: `${response.user_info.first_name} ${response.user_info.last_name}`,
        });
      }

      setNavItems(transformedItems);

      setIsLoading(false);

      setTimeout(() => {
        startTransition(() => {
          const expanded = {};

          transformedItems.forEach((item) => {
            if (item.children?.length > 0) {
              expanded[item.id] = true;
            }
          });

          setExpandedParents(expanded);
        });
      }, 0);
    } catch {
      enqueueSnackbar("Failed to fetch nav items.", {
        variant: "error",
      });

      setIsLoading(false);
    }
  }, [isRoleCategory, cat_id, type, user_id]);

  // ─────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const formattedNavItems = navItems
      .map((item) => {
        const isItemSelected = !!selectedNavItems[item.id];

        const selectedChildren =
          item.children?.filter((child) => !!selectedNavItems[child.id]) || [];

        if (!isItemSelected && selectedChildren.length === 0) {
          return null;
        }

        const formattedItem = {
          item_id: item.id,

          access_type:
            selectedNavItems[item.id]?.accessType ||
            item.accessType ||
            "read_write",
        };

        if (item.path) {
          formattedItem.screen_path = item.path;
        }

        if (selectedChildren.length > 0) {
          formattedItem.child_options = selectedChildren.map((child) => ({
            item_id: child.id,

            access_type:
              selectedNavItems[child.id]?.accessType ||
              child.accessType ||
              "read_write",

            ...(child.path && {
              screen_path: child.path,
            }),
          }));
        }

        return formattedItem;
      })
      .filter(Boolean);

    try {
      let res;

      if (isRoleCategory) {
        res = await _update_nav_items_role(
          {
            nav_items: formattedNavItems,
          },
          cat_id,
        );
      } else {
        res = await _update_NavItemAccess(
          {
            user_id,
            nav_items: formattedNavItems,
          },
          type,
          user_id,
        );
      }

      if (res.code === 200) {
        enqueueSnackbar(res.message || "Navigation items saved successfully!", {
          variant: "success",
        });

        getNavItems();
      } else {
        enqueueSnackbar(res.message || "Failed to save navigation items.", {
          variant: "error",
        });
      }
    } catch {
      enqueueSnackbar("Failed to save navigation items.", {
        variant: "error",
      });
    }
  }, [navItems, selectedNavItems, isRoleCategory, cat_id, user_id, type]);

  // ─────────────────────────────────────────────
  // Init
  // ─────────────────────────────────────────────
  useEffect(() => {
    getNavItems();

    if (componentType == "roles") {
      setNavBarTitle("Manage Nav Access");
    } else if (type === "admin") {
      setNavBarTitle("Admin Navigation Access");
    } else if (type === "business") {
      setNavBarTitle("Business Navigation Access");
    }
    setIsBackButton(false);
  }, []);

  // ─────────────────────────────────────────────
  // Breadcrumb
  // ─────────────────────────────────────────────
  const breadCrumbMenu = useMemo(() => {
    const breadCrumbTitle =
      from === "basicDetails"
        ? "Basic Details"
        : componentType == "roles"
          ? "Roles"
          : type === "admin"
            ? "Admin Users"
            : type === "business"
              ? "Business Customers"
              : "";

    const breadCrumbNav =
      componentType == "roles"
        ? "/roles"
        : type === "admin"
          ? "/admin-users"
          : type === "business"
            ? from === "basicDetails"
              ? `/business-customer/detail/${user_id}`
              : "/business-customer"
            : "/business-category";

    return [
      {
        title: breadCrumbTitle,
        navigation: breadCrumbNav,
        active: false,
      },
      {
        title: isRoleCategory ? category.title : user.fullname,
        active: true,
      },
    ];
  }, [from, isRoleCategory, type, user_id, category.title, user.fullname]);

  // ─────────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────────
  if (isLoading) return <NavItemsSkeleton />;

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <div className="col-12 display-flex mb-3">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
      </Box>

      {/* Select All */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Checkbox checked={isAllSelected} onChange={handleSelectAll} />

        <Typography sx={{ ml: 1 }}>Select All</Typography>
      </Box>

      {/* Parent Cards */}
      {navItems.map((item, parentIndex) => (
        <ParentCard
          key={item.id}
          item={item}
          parentIndex={parentIndex}
          isChecked={!!selectedNavItems[item.id]}
          isExpanded={!!expandedParents[item.id]}
          isIndeterminate={isIndeterminate}
          isParentChecked={isParentChecked}
          selectedNavItems={selectedNavItems}
          onParentToggle={handleCheckboxToggle}
          onChildToggle={handleCheckboxToggle}
          onToggleExpand={toggleChildrenVisibility}
          onAccessTypeChange={handleAccessTypeChange}
          isLast={parentIndex === navItems.length - 1}
          lastParentRef={lastParentRef}
        />
      ))}

      {/* Save Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 35,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Access
        </Button>
      </Box>
    </Box>
  );
}
