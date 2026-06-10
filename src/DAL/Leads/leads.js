import { invokeApi } from "../invokeApi";

export const _list_leads = async (page, limit, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/list_leads?page=${page}&limit=${limit}`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _delete_lead_by_id = async (_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/delete_lead_by_id/${_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _add_lead = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/add_lead`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _edit_lead_by_id = async (data, _id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/edit_lead_by_id/${_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _detail_lead_by_id = async (_id, type) => {
  let path = `api/leads/detail_lead_by_id/${_id}`;
  if (type) {
    path = `api/leads/detail_lead_by_id/${_id}?type=${type}`;
  }
  const requestObj = {
    path: path,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

//

export const _list_lead_note = async (page, limit, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/list_lead_note?page=${page}&limit=${limit}`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _delete_lead_note_by_id = async (data, _id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/delete_lead_note_by_id/${_id}`,
    method: "DELETE",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _add_lead_note = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/add_lead_note`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _edit_lead_note_by_id = async (data, _id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/edit_lead_note_by_id/${_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _list_lead_history = async (page, limit, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/list_lead_history?page=${page}&limit=${limit}`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _change_lead_status = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/change_lead_status`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _assign_lead = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/assign_lead`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _partial_update_lead_by_id = async (data, _id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/leads/partial_update_lead_by_id/${_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
