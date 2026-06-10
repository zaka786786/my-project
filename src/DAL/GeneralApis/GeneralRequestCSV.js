import { invokeApi } from "../invokeApi";

export const Csv_request_api = async (data) => {
  const requestObj = {
    path: `api/export_csv/add_export_csv_admin`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const Requested_csv_files_api = async (data, page, limit) => {
  const requestObj = {
    path: `api/export_csv/list_export_csv_admin?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const delete_csv_file_api = async (id) => {
  const requestObj = {
    path: `api/export_csv/delete_export_csv_admin/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
