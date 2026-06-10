import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import {
  _get_navitems,
  _update_navitems,
} from "../../DAL/Navitems/generalNavitems";
import { useAdminContext } from "../../Hooks/AdminContext";
import CircularLoader from "../loaders/CircularLoader";
import { v4 as uuidv4 } from "uuid";
import Iconify from "../Iconify";
import { useSnackbar } from "notistack";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { uploadImage } from "../../utils/constant_new";
import UploadImageBox from "./UploadImageBox";
import { _Delete_Image } from "../../DAL/Uploads/imageUpload";
import "./GenericNavItems.css"; // Import the optimized CSS
import { permission_string } from "../../utils/constant";
import TooltipShowing from "../TooltipShowing";

const boolOptions = ["Yes", "No"];

// Optimized Sub-component for Child Items
const ChildItem = memo(
  ({
    child,
    parentIdx,
    childIdx,
    onChildChange,
    onRemoveChild,
    onChildIconDelete,
  }) => {
    return (
      <Draggable key={child.id} draggableId={String(child.id)} index={childIdx}>
        {(provided) => (
          <div
            className="nav-child-card"
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div className="nav-item-header">
              <button
                className="btn btn-link delete-item-btn p-0"
                onClick={() => onRemoveChild(parentIdx, childIdx)}
              >
                <Iconify icon="mdi:delete" width={20} />
              </button>
              <div className="drag-handle-btn" {...provided.dragHandleProps}>
                <Iconify icon="icon-park-outline:drag" width={20} />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-3">
                <label className="nav-custom-label">Title</label>
                <input
                  className="form-control nav-custom-input shadow-none"
                  value={child.title}
                  onChange={(e) =>
                    onChildChange(parentIdx, childIdx, "title", e.target.value)
                  }
                />
              </div>
              <div className="col-md-1">
                <label className="nav-custom-label">Order</label>
                <input
                  className="form-control nav-custom-input shadow-none"
                  value={childIdx + 1}
                  disabled
                />
              </div>
              <div className="col-md-2">
                <label className="nav-custom-label">Value</label>
                <input
                  className="form-control nav-custom-input shadow-none"
                  value={child.value}
                  onChange={(e) =>
                    onChildChange(parentIdx, childIdx, "value", e.target.value)
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="nav-custom-label">Path</label>
                <input
                  className="form-control nav-custom-input shadow-none"
                  value={child.path}
                  onChange={(e) =>
                    onChildChange(parentIdx, childIdx, "path", e.target.value)
                  }
                />
              </div>
              <div className="col-md-2">
                <label className="nav-custom-label">New Tab</label>
                <select
                  className="form-select nav-custom-input shadow-none"
                  value={child.isOpenNewTab}
                  onChange={(e) =>
                    onChildChange(
                      parentIdx,
                      childIdx,
                      "isOpenNewTab",
                      e.target.value,
                    )
                  }
                >
                  {boolOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <UploadImageBox
                  item={child}
                  handleChange={(e) => {
                    const file = e.target.files[0];
                    onChildChange(parentIdx, childIdx, "icon", file);
                    e.target.value = null;
                  }}
                  handleRemove={() =>
                    onChildIconDelete(parentIdx, childIdx, child?.icon)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  },
);

// Optimized Sub-component for Parent Items
const ParentItem = memo(
  ({
    item,
    index,
    onParentChange,
    onRemoveParent,
    onParentIconDelete,
    onAddChild,
    onChildChange,
    onRemoveChild,
    onChildIconDelete,
    isLast,
    lastParentRef,
  }) => {
    return (
      <Draggable key={item.id} draggableId={String(item.id)} index={index}>
        {(provided) => (
          <div
            className="nav-parent-card"
            ref={(el) => {
              provided.innerRef(el);
              if (isLast) lastParentRef.current = el;
            }}
            {...provided.draggableProps}
          >
            <div className="nav-item-header">
              <button
                className="btn btn-link delete-item-btn p-0"
                onClick={() => onRemoveParent(index)}
              >
                <Iconify icon="mdi:delete" width={20} />
              </button>
              <div className="drag-handle-btn" {...provided.dragHandleProps}>
                <Iconify icon="icon-park-outline:drag" width={20} />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-3">
                <label className="nav-custom-label">Title</label>
                <input
                  className="form-control nav-custom-input shadow-none"
                  value={item.title}
                  onChange={(e) =>
                    onParentChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="col-md-1">
                <label className="nav-custom-label">Order</label>
                <input
                  className="form-control nav-custom-input shadow-none"
                  value={index + 1}
                  disabled
                />
              </div>
              <div className="col-md-2">
                <label className="nav-custom-label">Value</label>
                <input
                  className="form-control nav-custom-input shadow-none"
                  value={item.value}
                  onChange={(e) =>
                    onParentChange(index, "value", e.target.value)
                  }
                />
              </div>
              {item.children.length === 0 && (
                <>
                  <div className="col-md-3">
                    <label className="nav-custom-label">Path</label>
                    <input
                      className="form-control nav-custom-input shadow-none"
                      value={item.path}
                      onChange={(e) =>
                        onParentChange(index, "path", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="nav-custom-label">New Tab</label>
                    <select
                      className="form-select nav-custom-input shadow-none"
                      value={item.isOpenNewTab}
                      onChange={(e) =>
                        onParentChange(index, "isOpenNewTab", e.target.value)
                      }
                    >
                      {boolOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="col-md-1 d-flex align-items-end">
                <UploadImageBox
                  item={item}
                  handleChange={(e) => {
                    const file = e.target.files[0];
                    onParentChange(index, "icon", file);
                    e.target.value = null;
                  }}
                  handleRemove={() => onParentIconDelete(item.icon, index)}
                />
              </div>
            </div>

            {/* Children List with DragDrop */}
            <div className="nav-child-container">
              <Droppable droppableId={`children-${item.id}`} type="CHILD">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {item.children.length === 0 && (
                      <div className="child-placeholder-box">
                        No children added yet. Drop items here.
                      </div>
                    )}
                    {item.children.map((child, childIdx) => (
                      <ChildItem
                        key={child.id}
                        child={child}
                        parentIdx={index}
                        childIdx={childIdx}
                        onChildChange={onChildChange}
                        onRemoveChild={onRemoveChild}
                        onChildIconDelete={onChildIconDelete}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="text-start my-2 px-2">
                <button
                  className="btn btn-sm add-child-item-button btn-o"
                  onClick={() => onAddChild(index)}
                >
                  + Add Child
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  },
);

export function GenericNavItemsLayout(props) {
  const type = props["type"];
  const screen_path = props["screen_path"] || "";
  const [navItems, setNavItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastParentRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const [deletedParentIcons, setDeletedParentIcons] = useState([]);
  const [deletedChildIcons, setDeletedChildIcons] = useState([]);

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  // Optimized Handlers using useCallback to prevent re-renders
  const handleParentChange = useCallback(async (index, field, value) => {
    if (field === "icon" && value instanceof File) {
      setNavItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], is_loading: true };
        return updated;
      });
      const icon = await uploadImage(value);
      setNavItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], icon, is_loading: false };
        return updated;
      });
    } else {
      setNavItems((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    }
  }, []);

  const handleParentIconDelete = useCallback(
    (serverPath, parentIndex) => {
      setDeletedParentIcons((prev) => [...prev, serverPath]);
      handleParentChange(parentIndex, "icon", "");
    },
    [handleParentChange],
  );

  const handleChildChange = useCallback(
    async (parentIndex, childIndex, field, value) => {
      if (field === "icon" && value instanceof File) {
        setNavItems((prev) => {
          const updated = [...prev];
          const children = [...updated[parentIndex].children];
          children[childIndex] = { ...children[childIndex], is_loading: true };
          updated[parentIndex] = { ...updated[parentIndex], children };
          return updated;
        });
        const icon = await uploadImage(value);
        setNavItems((prev) => {
          const updated = [...prev];
          const children = [...updated[parentIndex].children];
          children[childIndex] = {
            ...children[childIndex],
            icon,
            is_loading: false,
          };
          updated[parentIndex] = { ...updated[parentIndex], children };
          return updated;
        });
      } else {
        setNavItems((prev) => {
          const updated = [...prev];
          const children = [...updated[parentIndex].children];
          children[childIndex] = { ...children[childIndex], [field]: value };
          updated[parentIndex] = { ...updated[parentIndex], children };
          return updated;
        });
      }
    },
    [],
  );

  const handleChildIconDelete = useCallback(
    (parentIndex, childIndex, serverPath) => {
      setDeletedChildIcons((prev) => [...prev, serverPath]);
      handleChildChange(parentIndex, childIndex, "icon", "");
    },
    [handleChildChange],
  );

  const addChild = useCallback((parentIndex) => {
    setNavItems((prev) => {
      const updated = [...prev];
      const parent = { ...updated[parentIndex] };
      parent.children = [
        ...parent.children,
        {
          id: uuidv4(),
          title: "",
          value: "",
          path: "",
          isLink: "No",
          isOpenNewTab: "No",
          icon: "",
        },
      ];
      updated[parentIndex] = parent;
      return updated;
    });
  }, []);

  const removeChild = useCallback((parentIndex, childIndex) => {
    setNavItems((prev) => {
      const updated = [...prev];
      const parent = { ...updated[parentIndex] };
      const newChildren = [...parent.children];
      newChildren.splice(childIndex, 1);
      parent.children = newChildren;
      updated[parentIndex] = parent;
      return updated;
    });
  }, []);

  const addParent = () => {
    setNavItems([
      ...navItems,
      {
        id: uuidv4(),
        title: "",
        value: "",
        path: "",
        isLink: "No",
        isOpenNewTab: "No",
        icon: "",
        children: [],
      },
    ]);
    setTimeout(() => {
      lastParentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const removeParent = useCallback((parentIndex) => {
    setNavItems((prev) => {
      const updated = [...prev];
      updated.splice(parentIndex, 1);
      return updated;
    });
  }, []);

  const imageDeleter = async (childIds, parentIds) => {
    const updated = [...childIds, ...parentIds];
    await _Delete_Image({ path: updated });
  };

  const handleSubmit = async () => {
    const formattedNavItems = navItems.map((item, idx) => ({
      _id: item.id,
      icon: item.icon || "",
      is_link: item.isLink === "Yes",
      is_open_new_tab: item.isOpenNewTab === "Yes",
      link: item.path,
      order: idx + 1,
      path: item.path,
      title: item.title,
      value: item.value,
      child_options: (item.children || []).map((child, cIdx) => ({
        _id: child.id,
        icon: child.icon || "",
        is_link: child.isLink === "Yes",
        is_open_new_tab: child.isOpenNewTab === "Yes",
        link: child.path,
        order: cIdx + 1,
        path: child.path,
        title: child.title,
        value: child.value,
      })),
    }));

    try {
      const res = await _update_navitems(
        { nav_items: formattedNavItems },
        type,
      );
      if (res.code === 200) {
        if (deletedChildIcons.length > 0 || deletedParentIcons.length > 0) {
          await imageDeleter(deletedChildIcons, deletedParentIcons);
          setDeletedChildIcons([]);
          setDeletedParentIcons([]);
        }
        enqueueSnackbar(
          res?.message || "Navigation items saved successfully!",
          { variant: "success" },
        );
        getNavItems();
      } else {
        enqueueSnackbar(res?.message || "Failed to save items.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Failed to save items.", { variant: "error" });
    }
  };

  const getNavItems = async () => {
    setIsLoading(true);
    try {
      const response = await _get_navitems(type);
      const transformedData = (response.nav_items || []).map((item) => ({
        id: item._id,
        title: item.title || "",
        value: item.value || "",
        path: item.path || "",
        icon: item.icon || "",
        order: item.order || "",
        isLink: item.is_link ? "Yes" : "No",
        isOpenNewTab: item.is_open_new_tab ? "Yes" : "No",
        children: (item.child_options || []).map((child) => ({
          id: child._id,
          title: child.title || "",
          value: child.value || "",
          path: child.path || "",
          icon: child.icon || "",
          order: child.order || "",
          isLink: child.is_link ? "Yes" : "No",
          isOpenNewTab: child.is_open_new_tab ? "Yes" : "No",
        })),
      }));
      setNavItems(transformedData);
    } catch (err) {
      enqueueSnackbar("Failed to fetch nav items.", { variant: "error" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getNavItems();
    setNavBarTitle(
      type === "admin" ? "Admin Navigation Items" : "Business Navigation Items",
    );
    setIsBackButton(false);
  }, [type]);

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "PARENT") {
      const newItems = Array.from(navItems);
      const [moved] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, moved);
      setNavItems(newItems);
    } else if (type === "CHILD") {
      const sourceParentId = source.droppableId.split("children-")[1];
      const destParentId = destination.droppableId.split("children-")[1];
      const sourceIdx = navItems.findIndex(
        (it) => String(it.id) === sourceParentId,
      );
      const destIdx = navItems.findIndex(
        (it) => String(it.id) === destParentId,
      );

      if (sourceIdx === -1 || destIdx === -1) return;

      const newItems = [...navItems];
      if (sourceParentId === destParentId) {
        const children = Array.from(newItems[sourceIdx].children);
        const [moved] = children.splice(source.index, 1);
        children.splice(destination.index, 0, moved);
        newItems[sourceIdx] = { ...newItems[sourceIdx], children };
      } else {
        const srcChildren = Array.from(newItems[sourceIdx].children);
        const [moved] = srcChildren.splice(source.index, 1);
        const destChildren = Array.from(newItems[destIdx].children);
        destChildren.splice(destination.index, 0, moved);
        newItems[sourceIdx] = { ...newItems[sourceIdx], children: srcChildren };
        newItems[destIdx] = { ...newItems[destIdx], children: destChildren };
      }
      setNavItems(newItems);
    }
  };

  if (isLoading) return <CircularLoader />;

  return (
    <div className="nav-items-layout-container">
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-md btn-add-parent text-white"
          onClick={addParent}
          disabled={isLoading || navItems.length === 0}
        >
          <Iconify icon="mdi:plus-circle" width={20} className="me-1" /> Add
          Parent Item
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="navItems" type="PARENT">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {navItems.map((item, idx) => (
                <ParentItem
                  key={item.id}
                  item={item}
                  index={idx}
                  onParentChange={handleParentChange}
                  onRemoveParent={removeParent}
                  onParentIconDelete={handleParentIconDelete}
                  onAddChild={addChild}
                  onChildChange={handleChildChange}
                  onRemoveChild={removeChild}
                  onChildIconDelete={handleChildIconDelete}
                  isLast={idx === navItems.length - 1}
                  lastParentRef={lastParentRef}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="nav-floating-footer">
        <TooltipShowing
          accessType={accessType}
          component={
            <button
              className="btn btn-md nav-items-submit-button"
              onClick={() => {
                if (show) {
                  enqueueSnackbar(permission_string, {
                    variant: "error",
                  });
                  return;
                }
                handleSubmit();
              }}
              disabled={show || isLoading || navItems.length === 0}
            >
              <Iconify icon="mdi:content-save" width={24} className="me-2" />
              Submit
            </button>
          }
        />
      </div>
    </div>
  );
}
