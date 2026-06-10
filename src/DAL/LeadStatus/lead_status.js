import { invokeApi } from "../invokeApi";

export const _list_lead_status = async (page, limit, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/lead_status/list_lead_status?page=${page}&limit=${limit}`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _delete_lead_status_by_id = async (_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/lead_status/delete_lead_status_by_id/${_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _add_lead_status = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/lead_status/add_lead_status`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_lead_status_by_id = async (data, _id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/lead_status/update_lead_status_by_id/${_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _find_lead_status_by_id = async (_id) => {
  const requestObj = {
    path: `api/lead_status/find_lead_status_by_id/${_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
