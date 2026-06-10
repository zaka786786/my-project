import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LogoNew } from "../assets";

export default function LoginLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>{"Testing Project"}</title>
        <meta name="description" content={"Testing Project"} />
      </Helmet>
      <Outlet />
    </>
  );
}
