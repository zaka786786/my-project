import { invokeApi } from "../invokeApi";
export const _business_customers_list = async (data, page, rowsPerPage) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/list_business?page=${page}&limit=${rowsPerPage}`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _add_business_customer = async (data) => {
  console.log("data in add business customer", data);
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/add_business`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _delete_business_customer = async (user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/delete_business_by_id/${user_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _change_password_by_admin = async (data, user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/app_api/change_password_by_admin/${user_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _get_business_customer_for_admin = async (user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/app_api/type_base_data_for_business/${user_id}`,
    method: "PUT",
    postData: {
      type: "customer",
    },
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
