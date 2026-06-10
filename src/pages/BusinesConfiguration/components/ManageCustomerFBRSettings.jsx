import React from "react";
import MainFBRAndBusinessSettingComponent from "../MainFBRAndBusinessSettingComponent";

const ManageCustomerFBRSettings = ({ type }) => {
  return (
    <>
      <MainFBRAndBusinessSettingComponent type="fbr_info" businessType={type} />
    </>
  );
};

export default ManageCustomerFBRSettings;
