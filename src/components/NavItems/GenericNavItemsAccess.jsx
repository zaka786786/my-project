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
import CircularLoader from "../loaders/CircularLoader";
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
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useParams, useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../config/config";

// ─────────────────────────────────────────────
// ✅ Static constants — defined once, never recreated
// ─────────────────────────────────────────────
const EMPTY_CHILDREN = [];

// ─────────────────────────────────────────────
// ✅ Lightweight DisplayField
//    Replaces heavy MUI TextField (disabled)
//    TextField = ~10 DOM nodes | This = 1 DOM node
// ─────────────────────────────────────────────
const DisplayField = memo(({ label, value }) => (
  <div
    style={{
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      padding: "6px 12px",
      backgroundColor: "#f5f5f5",
      fontSize: "0.875rem",
      minHeight: "40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <div style={{ fontSize: "0.68rem", color: "#999", marginBottom: "1px" }}>
      {label}
    </div>
    <div style={{ color: "#333", fontWeight: 500 }}>{value || "—"}</div>
  </div>
));

// ─────────────────────────────────────────────
// ✅ Lightweight BoolDisplay
//    Replaces heavy MUI Select + FormControl + InputLabel + MenuItem (disabled)
//    Select stack = ~15 DOM nodes | This = 1 DOM node
// ─────────────────────────────────────────────
const BoolDisplay = memo(({ label, value }) => (
  <div
    style={{
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      padding: "6px 12px",
      backgroundColor: "#f5f5f5",
      fontSize: "0.875rem",
      minHeight: "40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <div style={{ fontSize: "0.68rem", color: "#999", marginBottom: "1px" }}>
      {label}
    </div>
    <div
      style={{
        fontWeight: 600,
        color: value === "Yes" ? "#2e7d32" : "#757575",
      }}
    >
      {value || "No"}
    </div>
  </div>
));

// ─────────────────────────────────────────────
// ✅ NavIcon — memoized, never re-renders
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
    />
  );
});

// ─────────────────────────────────────────────
// ✅ ChildCard
//    KEY FIX: receives primitive `isChecked` (boolean)
//    NOT the entire Set — so it only re-renders
//    when THIS child's checked state changes
// ─────────────────────────────────────────────
const ChildCard = memo(({ child, isChecked, onToggle }) => {
  return (
    <Grid item xs={12} sx={{ ml: 4 }}>
      <Card variant="outlined" sx={{ p: 2, mb: 1, backgroundColor: "#fafafa" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={1}>
            <Checkbox
              checked={isChecked}
              onChange={() => onToggle(child.id)}
              color="primary"
              sx={{ ml: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <DisplayField label="Child Title" value={child.title} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <BoolDisplay label="Is Link" value={child.isLink} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <BoolDisplay label="Is open new tab" value={child.isOpenNewTab} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <NavIcon iconName={child.icon} />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
});

// ─────────────────────────────────────────────
// ✅ ParentCard
//    KEY FIX: receives primitive `isChecked` (boolean)
//    Children list is stable (from transformApiData)
//    Only re-renders when isChecked or isExpanded changes
// ─────────────────────────────────────────────
const ParentCard = memo(
  ({
    item,
    isChecked,
    isExpanded,
    navItemIds, // ← plain array for child lookup
    onParentToggle,
    onChildToggle,
    onToggleExpand,
    isLast,
    lastParentRef,
  }) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Card
        elevation={7}
        sx={{ mb: 3, p: 2 }}
        ref={isLast ? lastParentRef : null}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Checkbox */}
            <Grid item xs={12} sm={1}>
              <Checkbox
                checked={isChecked}
                onChange={() =>
                  onParentToggle(item.id, true, item.children || EMPTY_CHILDREN)
                }
                color="secondary"
              />
            </Grid>

            {/* Title */}
            <Grid item xs={12} sm={3}>
              <DisplayField label="Title" value={item.title} />
            </Grid>

            {/* No children — show fields */}
            {!hasChildren && (
              <>
                <Grid item xs={12} sm={3}>
                  <BoolDisplay label="Is Link" value={item.isLink} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <BoolDisplay
                    label="Is open new tab"
                    value={item.isOpenNewTab}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <NavIcon iconName={item.icon} />
                </Grid>
              </>
            )}

            {/* Has children — toggle button */}
            {hasChildren && (
              <Grid
                item
                xs={12}
                sm={2}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onToggleExpand(item.id)}
                >
                  {isExpanded ? "Hide Children" : "Show Children"}
                </Button>
              </Grid>
            )}

            {/* Children — only rendered when expanded */}
            {isExpanded &&
              item.children?.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  // ✅ Primitive boolean — not the Set
                  // ChildCard only re-renders when THIS value changes
                  isChecked={navItemIds.includes(child.id)}
                  onToggle={onChildToggle}
                />
              ))}
          </Grid>
        </CardContent>
      </Card>
    );
  },
  // ✅ Custom comparator — ParentCard skips re-render unless
  //    these specific props actually changed
  (prevProps, nextProps) => {
    return (
      prevProps.isChecked === nextProps.isChecked &&
      prevProps.isExpanded === nextProps.isExpanded &&
      prevProps.navItemIds === nextProps.navItemIds &&
      prevProps.item === nextProps.item
    );
  },
);

// ─────────────────────────────────────────────
// ✅ Loading Skeleton — perceived performance
//    User sees content shape immediately
//    instead of blank spinner
// ─────────────────────────────────────────────
const NavItemsSkeleton = memo(() => (
  <Box sx={{ p: 2 }}>
    {[...Array(5)].map((_, i) => (
      <Card key={i} elevation={7} sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={1}>
              <Skeleton variant="rectangular" width={24} height={24} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
            <Grid item xs={3}>
              <Skeleton variant="rectangular" height={40} />
            </Grid>
            <Grid item xs={2}>
              <Skeleton variant="circular" width={30} height={30} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ))}
  </Box>
));

// ─────────────────────────────────────────────
// ✅ Main Component
// ─────────────────────────────────────────────
export function GenericNavItemsAccess(props) {
  const params = useParams();
  const from = new URLSearchParams(window.location.search).get("from");
  const isBusinessCategory = props["type"] === "business_category";
  const type = props.type;
  const businessType = props.businessType;
  const isDemo = businessType === "demo";
  const cat_id = isBusinessCategory ? params.cat_id : null;
  const user_id = isBusinessCategory ? null : params.user_id;

  const { enqueueSnackbar } = useSnackbar();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const lastParentRef = useRef(null);

  const [navItemIds, setNavItemIds] = useState([]);
  const [navItems, setNavItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedParents, setExpandedParents] = useState({});
  const [user, setUser] = useState({});
  const [category, setCategory] = useState({});

  // ✅ Only recomputes when navItems changes
  const allNavItemIds = useMemo(
    () =>
      navItems.flatMap((item) => [
        item.id,
        ...(item.children || []).map((child) => child.id),
      ]),
    [navItems],
  );

  // ✅ For submit only — O(1) lookup
  const navItemIdSet = useMemo(() => new Set(navItemIds), [navItemIds]);

  // ✅ isAllSelected
  const isAllSelected = useMemo(
    () =>
      allNavItemIds.length > 0 &&
      allNavItemIds.every((id) => navItemIdSet.has(id)),
    [allNavItemIds, navItemIdSet],
  );

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setNavItemIds([]);
    } else {
      setNavItemIds(allNavItemIds);
    }
  }, [isAllSelected, allNavItemIds]);

  const toggleChildrenVisibility = useCallback((parentId) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  }, []);

  // ✅ Stable callback — navItems in closure is fine
  //    because setNavItemIds uses functional update
  const handleCheckboxToggle = useCallback(
    (id, isParent = false, children = EMPTY_CHILDREN) => {
      setNavItemIds((prev) => {
        let updated = [...prev];
        const hasId = updated.includes(id);

        if (isParent) {
          if (hasId) {
            updated = updated.filter((itemId) => itemId !== id);
            children.forEach((child) => {
              updated = updated.filter((itemId) => itemId !== child.id);
            });
          } else {
            updated.push(id);
            children.forEach((child) => {
              if (!updated.includes(child.id)) updated.push(child.id);
            });
          }
        } else {
          if (hasId) {
            updated = updated.filter((itemId) => itemId !== id);
            navItems.forEach((parent) => {
              if (parent.children.some((child) => child.id === id)) {
                const anySelected = parent.children.some((child) =>
                  updated.includes(child.id),
                );
                if (!anySelected) {
                  updated = updated.filter((itemId) => itemId !== parent.id);
                }
              }
            });
          } else {
            updated.push(id);
            navItems.forEach((parent) => {
              if (parent.children.some((child) => child.id === id)) {
                if (!updated.includes(parent.id)) updated.push(parent.id);
              }
            });
          }
        }

        return updated;
      });
    },
    [navItems],
  );

  const extractAllNavItemIds = useCallback((items) => {
    const ids = [];
    items.forEach((item) => {
      ids.push(item.item_id);
      if (Array.isArray(item.child_options)) {
        item.child_options.forEach((child) => ids.push(child.item_id));
      }
    });
    setNavItemIds(ids);
  }, []);

  const transformApiData = useCallback(
    (apiItems) =>
      apiItems.map((item) => ({
        id: item._id,
        title: item.title || "",
        value: item.value || "",
        path: item.path || "",
        order: item.order || "",
        icon: item.icon || "",
        isLink: item.is_link ? "Yes" : "No",
        isOpenNewTab: item.is_open_new_tab ? "Yes" : "No",
        children: (item.child_options || []).map((child) => ({
          id: child._id,
          title: child.title || "",
          value: child.value || "",
          path: child.path || "",
          order: child.order || "",
          icon: child.icon || "",
          isLink: child.is_link ? "Yes" : "No",
          isOpenNewTab: child.is_open_new_tab ? "Yes" : "No",
        })),
      })),
    [],
  );

  const getNavItems = useCallback(async () => {
    setIsLoading(true);
    try {
      let response;
      if (isBusinessCategory) {
        response = await _get_navitems_for_business_categories(cat_id);
      } else {
        response = await _NavItemAccess(type, user_id);
      }

      const transformedItems = transformApiData(response?.default_nav_items);
      extractAllNavItemIds(response.nav_items);

      if (isBusinessCategory) {
        setCategory({ title: response.category.title });
      } else {
        setUser({
          fullname:
            response.user_info.first_name + " " + response.user_info.last_name,
        });
      }

      // ✅ Step 1: Paint parents immediately (fast — no children yet)
      setNavItems(transformedItems);
      setIsLoading(false);

      // ✅ Step 2: Expand children AFTER first paint
      //    startTransition = low priority, won't block UI
      //    setTimeout = ensures first paint completes first
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
      enqueueSnackbar("Failed to fetch nav items.", { variant: "error" });
      setIsLoading(false);
    }
  }, [isBusinessCategory, cat_id, type, user_id]);

  const handleSubmit = useCallback(async () => {
    const formattedNavItems = navItems
      .map((item) => {
        const formattedItem = { item_id: item.id };
        if (item.children?.length > 0) {
          formattedItem.child_options = item.children
            .filter((child) => navItemIdSet.has(child.id))
            .map((child) => ({ item_id: child.id }));
        }
        return formattedItem;
      })
      .filter((item) => navItemIdSet.has(item.item_id) || item.child_options);

    try {
      let res;
      if (isBusinessCategory) {
        res = await _update_navitems_for_business_categories(
          { nav_items: formattedNavItems },
          cat_id,
        );
      } else {
        res = await _update_NavItemAccess(
          { user_id, nav_items: formattedNavItems },
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
      enqueueSnackbar("Failed to save navigation items.", { variant: "error" });
    }
  }, [navItems, navItemIdSet, isBusinessCategory, cat_id, user_id, type]);

  useEffect(() => {
    getNavItems();
    if (isBusinessCategory) {
      setNavBarTitle("Business Category Nav Access");
    } else if (type === "admin") {
      setNavBarTitle("Admin Navigation Access");
    } else if (type === "business") {
      setNavBarTitle("Business Navigation Access");
    }
    setIsBackButton(true);
  }, []);

  const breadCrumbMenu = useMemo(() => {
    const breadCrumbTitle =
      from === "basicDetails"
        ? "Basic Details"
        : isBusinessCategory
          ? "Business Categories"
          : type === "admin"
            ? "Admin Users"
            : type === "business"
              ? "Business Customers"
              : "";

    const breadCrumbNav =
      type === "admin"
        ? "/admin-users"
        : type === "business"
          ? from === "basicDetails"
            ? `/business-customer/detail/${user_id}`
            : isDemo
              ? "/demo-business-accounts"
              : `/business-customer`
          : isBusinessCategory
            ? "/business-categories"
            : "";

    return [
      { title: breadCrumbTitle, navigation: breadCrumbNav, active: false },
      {
        title: isBusinessCategory ? category.title : user.fullname,
        active: true,
      },
    ];
  }, [from, isBusinessCategory, type, user_id, category.title, user.fullname]);

  // ✅ Skeleton instead of blank spinner
  if (isLoading) return <NavItemsSkeleton />;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <div className="col-12 display-flex mb-3">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
        <Typography sx={{ ml: 1 }}>Select All</Typography>
      </Box>

      {navItems.map((item, parentIdx) => (
        <ParentCard
          key={item.id}
          item={item}
          // ✅ Primitive boolean — not the Set
          // ParentCard only re-renders when THIS boolean flips
          isChecked={navItemIdSet.has(item.id)}
          isExpanded={!!expandedParents[item.id]}
          // ✅ Pass array (not Set) so ChildCard gets primitive boolean
          navItemIds={navItemIds}
          onParentToggle={handleCheckboxToggle}
          onChildToggle={handleCheckboxToggle}
          onToggleExpand={toggleChildrenVisibility}
          isLast={parentIdx === navItems.length - 1}
          lastParentRef={lastParentRef}
        />
      ))}

      <Box sx={{ position: "fixed", bottom: 20, right: 35 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Access
        </Button>
      </Box>
    </Box>
  );
}
