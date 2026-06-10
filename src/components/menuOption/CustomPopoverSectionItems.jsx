import { Icon } from "@iconify/react";
import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Collapse, ListItemButton } from "@mui/material";

// ----------------------------------------------------------------------

export default function CustomPopoverSectionItems(props) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { item, data, setOpen } = props;

  // Check if the item should be hidden
  if (item.hidden && typeof item.hidden === "function" && item.hidden(data)) {
    return null; // Don't render hidden items
  }

  // Get custom styles for the item
  const customStyle =
    item.style && typeof item.style === "function" ? item.style(data) : {};

  const handleClickDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const isDelete = item.label === "Delete";

  return (
    <div className="table-menu-more-option-dropdown">
      <ListItemButton
        key={item.label}
        onClick={(e) => {
          if (item.child_options) {
            handleClickDropdown();
          } else {
            e.preventDefault();
            setOpen(false);
            item.handleClick(data);
          }
        }}
        className="d-block"
        style={customStyle} // Apply custom styles
      >
        {item.icon && (
          <Icon
            icon={item.icon}
            fontSize="18"
            className={`me-2 ${
              isDelete ? "red-icon" : "table-menu-more-option-dropdown"
            }`}
          />
        )}
        <span style={{ color: isDelete ? "red" : "inherit" }}>
          {item.label}
        </span>
        <span className="menu-dropdown-icon">
          {item.child_options &&
            (openDropdown ? <ExpandLess /> : <ExpandMore />)}
        </span>
      </ListItemButton>
      {item.child_options && item.child_options.length > 0 && (
        <Collapse in={openDropdown} timeout="auto" unmountOnExit>
          {item.child_options.map((child_option, index) => {
            const isDeleteChild = child_option.label === "Delete";

            return (
              <ListItemButton
                key={index}
                className="menus-child-items"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  child_option.handleClick(data);
                }}
              >
                {child_option.icon && (
                  <Icon
                    fontSize="18"
                    style={{
                      color: isDeleteChild
                        ? "red"
                        : "var(--portal-theme-primary)",
                    }}
                    className="me-2"
                    icon={child_option.icon}
                  />
                )}
                <span style={{ color: isDeleteChild ? "red" : "inherit" }}>
                  {child_option.label}
                </span>
              </ListItemButton>
            );
          })}
        </Collapse>
      )}
    </div>
  );
}
