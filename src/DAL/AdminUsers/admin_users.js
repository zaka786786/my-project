import { invokeApi } from "../invokeApi";

export const _admin_list = async (text, page, limit) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/admin/admin_list?text=${text}&page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _add_admin_user = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/admin/add_admin_by_admin`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _edit_admin_user = async (data, user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/admin/edit_admin_by_admin/${user_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _delete_admin_user = async (user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/admin/delete_admin_by_admin/${user_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _detail_admin_by_admin = async (user_id) => {
  const requestObj = {
    path: `api/admin/detail_admin_by_admin/${user_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
