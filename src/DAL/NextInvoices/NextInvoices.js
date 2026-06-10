import { invokeApi } from "../invokeApi";

export const _list_next_invoices = (filter, page, limit) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/next-invoices/list_next_invoices_for_admin?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
    postData: filter || {},
  };
  return invokeApi(requestObj);
};

export const _get_next_invoice = (id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/next-invoices/get_next_invoice_by_id/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
