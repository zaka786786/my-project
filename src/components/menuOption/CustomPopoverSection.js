import { useEffect, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuPopover from "./MenuPopover";
import CustomPopoverSectionItems from "./CustomPopoverSectionItems";
import { InputAdornment, TextField, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function CustomPopoverSection(props) {
  const anchorRef = useRef(null);
  const { menu, data } = props;
  const [NewMenu, setNewMenu] = useState(menu || []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleMenuSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const TrimmedSearchValue = searchValue?.trim();
    const filteredMenu = menu.filter((option) =>
      option.label.toLowerCase().includes(TrimmedSearchValue)
    );
    setNewMenu(filteredMenu);
  };

  useEffect(() => {
    if (!open) {
      setNewMenu(menu);
    }
  }, [open]);

  return (
    <div
      className={`pointer table-menu-more-option ${
        NewMenu.length === 0 ? "disabled" : ""
      }`}
    >
      <Tooltip title={NewMenu.length === 0 ? "No options" : ""}>
        <span>
          <MoreVertIcon
            ref={anchorRef}
            onClick={handleOpen}
            style={{
              opacity: NewMenu.length === 0 ? 0.5 : 1,
              pointerEvents: NewMenu.length === 0 ? "none" : "auto",
            }}
          />
        </span>
      </Tooltip>

      <MenuPopover
        className="custom-popover"
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ marginLeft: 1.8, maxHeight: 300 }}
        PaperProps={{
          sx: {
            maxHeight: 300,
            overflow: "auto",
          },
        }}
      >
        {menu?.length > 5 && (
          <div
            style={{
              padding: "8px 16px",
            }}
          >
            <TextField
              type="text"
              placeholder="Search menus..."
              // autoFocus
              autoComplete="off"
              size="small"
              onChange={handleMenuSearch}
              sx={{
                zIndex: 99999,
                "& .MuiInputBase-inputAdornedStart": {
                  paddingLeft: "0px !important",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon
                      icon="mdi:magnify"
                      width={20}
                      height={20}
                      style={{ color: "#757575" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        {NewMenu.map((option, index) => (
          <CustomPopoverSectionItems
            key={index}
            item={option}
            data={data}
            setOpen={setOpen}
          />
        ))}
      </MenuPopover>
    </div>
  );
}
