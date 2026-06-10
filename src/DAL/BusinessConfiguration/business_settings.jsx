import { invokeApi } from "../invokeApi";

export const Get_Business = async (user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/find_business_by_id/${user_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const Get_Business_Settings = async (user_id, type, page, limit) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/find_business_by_id_with_payments/${user_id}?type=${type}&page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_business_by_id_v1 = async (user_id, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/update_business_by_id_v1/${user_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_business_settings_fbr_info = async (user_id, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/update_business_settings_fbr_info/${user_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const Update_Expiry_Date = async (user_id, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/update_business_plan_expiry/${user_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _Logout_Session = async (sessionId) => {
  const requestObj = {
    path: `api/app_api/session_expire_by_business/${sessionId}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const _find_business_data_type_base_for_admin = async (
  user_id,
  data,
) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/find_business_data_type_base_for_admin/${user_id}`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const loginAsBusinessCustomer = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/app_api/generate_token_for_business_by_admin`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
