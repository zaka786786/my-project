import { invokeApi } from "../invokeApi";

export const set_invoice_reporting_settings = async (data) => {
  const requestObj = {
    path: `api/website_setting/update_website_setting_type_base`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const get_invoice_reporting_settings = async (data) => {
  const requestObj = {
    path: `api/website_setting/get_website_setting_type_base?type=${data.type}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
