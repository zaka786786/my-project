import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useNavigate } from "react-router-dom";

export default function ActiveLastBreadcrumb({ breadCrumbMenu }) {
  const navigate = useNavigate();
  function handleClick(event, value) {
    event.preventDefault();
    navigate(value);
  }

  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {breadCrumbMenu?.map((item, index) => {
          return (
            <>
              {item?.navigation ? (
                <Link
                  underline="hover"
                  to={item.navigation}
                  className={
                    item.active ? "active-bread-crum" : "bread-crum-text"
                  }
                >
                  <span style={{ cursor: "pointer" }}>{item?.title}</span>
                </Link>
              ) : (
                <span
                  className={
                    item.active ? "active-bread-crum" : "bread-crum-text"
                  }
                >
                  {item?.title}
                </span>
              )}
            </>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
