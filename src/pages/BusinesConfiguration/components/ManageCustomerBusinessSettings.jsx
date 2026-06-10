import React from "react";
import MainFBRAndBusinessSettingComponent from "../MainFBRAndBusinessSettingComponent";

const ManageCustomerBusinessSettings = ({ type }) => {
  return (
    <>
      <MainFBRAndBusinessSettingComponent
        type="business_settings"
        businessType={type}
      />
    </>
  );
};

export default ManageCustomerBusinessSettings;
