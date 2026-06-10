import { invokeApi } from "../invokeApi";

export const _get_customer_business_plan = async (id, type) => {
  const token = localStorage.getItem("token");
  let requestObj = {
    path: `api/business/find_business_data_type_base_for_admin/${id}`,
    method: "POST",
    postData: {
      type: type,
    },
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_customer_business_plan = async (id, data, type) => {
  const token = localStorage.getItem("token");
  let requestObj = {
    path: `api/business/update_business_settings_fbr_info/${id}`,
    method: "PUT",
    postData: {
      ...data,
      type: type,
    },
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
