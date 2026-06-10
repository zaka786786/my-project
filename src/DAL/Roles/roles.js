import { invokeApi } from "../invokeApi";

export const _roles_list = async (page, limit, data = {}) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/role/list_roles?page=${page}&limit=${limit}`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _add_role = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/role/add_role`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_role_by_id = async (data, user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/role/update_role_by_id/${user_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _delete_role = async (user_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/role/delete_role_by_id/${user_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _find_role_by_id = async (id) => {
  const requestObj = {
    path: `api/role/find_role_by_id/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const _get_role_nav_items = async (_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/role/get_role_nav_items/${_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_nav_items_role = async (data, _id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/role/update_nav_items_role/${_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
