import { List } from "@mui/material";
import React, { useState } from "react";
import NavSectionItem from "./NavSectionItem";
import { Icon } from "@iconify/react";

export default function NavSection({ navConfig, isCollapsed, isHovered }) {
  const [searchInput, setSearchInput] = useState("");

  const getNavItemsList = (array, query) => {
    if (query) {
      const _nav_list = array
        .map((data) => {
          const is_main =
            data.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
          const match_child = data.child_options?.filter(
            (item) =>
              item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1,
          );
          if (is_main) {
            return data;
          } else if (match_child?.length > 0) {
            return {
              ...data,
              child_options: match_child,
            };
          }
          return null;
        })
        .filter(Boolean);
      return _nav_list;
    }
    return array;
  };
  return (
    <>
      {(!isCollapsed || isHovered) && (
        <div className="my-1 p-2">
          <div className="sidebar-search-box">
            <Icon
              fontSize={20}
              className="sidebar-search-icon"
              icon="akar-icons:search"
            />
            <input
              className="sidebar-search-input"
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      )}
      <List className="py-0">
        {getNavItemsList(navConfig, searchInput).map((item, i) => {
          return (
            <NavSectionItem
              data={item}
              key={i}
              searchInput={searchInput}
              isCollapsed={isCollapsed}
              isHovered={isHovered}
            />
          );
        })}
      </List>
    </>
  );
}
