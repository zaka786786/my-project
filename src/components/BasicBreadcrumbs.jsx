import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";

function BasicBreadcrumbs({ items = [] }) {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item, index) => {
        return (
          <Link
            key={index}
            to={item?.navigation}
            className={
              item?.status === "Active" ? "nav_active" : "nav_inactive"
            }
          >
            {item.title}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default BasicBreadcrumbs;
