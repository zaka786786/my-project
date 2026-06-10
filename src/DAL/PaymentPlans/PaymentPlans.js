import { invokeApi } from "../invokeApi";

export const _List_Payment_Plans = (filter, page, limit) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/plan/list_plan?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: filter || {},
  };
  return invokeApi(requestObj);
};

export const _Add_Payment_Plans = (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/plan/add_plan`,
    method: "POST",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: data || {},
  };
  return invokeApi(requestObj);
};

export const _Edit_Payment_Plans = (id, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/plan/update_plan_by_id/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: data || {},
  };
  return invokeApi(requestObj);
};

export const _Delete_Payment_Plans = (id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/plan/delete_plan_by_id/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _Get_Payment_Plan = (id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/plan/get_plan_by_id/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
