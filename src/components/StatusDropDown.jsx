import React, { useState } from "react";
import { Chip, Menu, MenuItem } from "@mui/material";

const StatusDropDown = ({
  row,
  onStatusChange,
  setList,
  options = [
    { value: true, name: "Active", color: "active_status" },
    { value: false, name: "Inactive", color: "inactive_status" },
  ],
  isVariant = false,
  isAuth = false,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const currentStatus = options.find((s) => s.value === row.status);

  const handleClick = (event) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (newStatus) => {
    if (typeof onStatusChange === "function") {
      onStatusChange({
        ...row,
        status: newStatus,
      });
    } else if (typeof setList === "function") {
      setList((prev) =>
        prev.map((item) =>
          item._id === row._id ? { ...item, status: newStatus } : item,
        ),
      );
    }
    handleClose();
  };

  return (
    <div>
      <Chip
        label={currentStatus?.name}
        className={currentStatus?.color}
        variant="outlined"
        size="small"
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          minWidth: "80px",
          fontWeight: "medium",
          borderWidth: "1px",
          borderStyle: "solid",
          "&:hover": {
            borderWidth: "1px",
          },
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {options?.map((option) => {
          const selected = isAuth
            ? option?.value === row?.user_id?.two_factor_auth
            : option?.value === row?.status;
          return (
            <MenuItem
              disabled={selected}
              key={option?.value?.toString()}
              onClick={() => handleStatusChange(option?.value)}
              selected={selected}
              // className={option.color}
              sx={{
                fontWeight: "medium",
              }}
            >
              {option?.name}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default StatusDropDown;
