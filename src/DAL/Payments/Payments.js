import { invokeApi } from "../invokeApi";

export const _list_payment = (filter, page, limit, business_data = "") => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/payments/list_payments_for_admin?page=${page}&limit=${limit}&business_data=${business_data}`,
    method: "POST",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: filter || {},
  };
  return invokeApi(requestObj);
};

export const _add_payment = (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/payments/add_payments_of_business_subscription`,
    method: "POST",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: data || {},
  };
  return invokeApi(requestObj);
};

export const _update_payment = (id, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/payments/update_payments_of_business_subscription/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: data || {},
  };
  return invokeApi(requestObj);
};

export const _delete_payment = (id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/payments/delete_payments_by_id_admin/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _get_payment = (id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/payments/find_payments_by_id_admin/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_payment_status = (id, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/payments/change_payment_status_recurring_admin/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: data || {},
  };
  return invokeApi(requestObj);
};

export const _cancel_payment = (id, data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/payments/cancel_payments_by_id_admin/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: data || {},
  };
  return invokeApi(requestObj);
};
