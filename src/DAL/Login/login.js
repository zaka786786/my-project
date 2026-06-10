import { invokeApi } from "../invokeApi";

export const _admin_login_api = async (data) => {
  const requestObj = {
    path: `api/app_api/login`,
    method: "POST",
    postData: data,
  };
  return invokeApi(requestObj);
};

export const _email_verification_api = async (data) => {
  const requestObj = {
    path: `api/app_api/email_verification`,
    method: "POST",
    postData: data,
  };
  return invokeApi(requestObj);
};

export const _code_verification_api = async (data) => {
  const requestObj = {
    path: `api/app_api/code_verification`,
    method: "POST",
    postData: data,
  };
  return invokeApi(requestObj);
};

export const _reset_password_api = async (data) => {
  const requestObj = {
    path: `api/app_api/reset_password`,
    method: "POST",
    postData: data,
  };
  console.log("Reset Password Data: ", data);
  return invokeApi(requestObj);
};

export const _admin_init_with_token = async () => {
  let requestObj = {
    path: `api/admin/admin_init_with_token`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const _logout_api = async (data) => {
  const requestObj = {
    path: `api/app_api/logout?logout_from=${data}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const _change_password_user_admin = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/app_api/change_password`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _edit_admin_profile = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/admin/edit_admin`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _get_init_admin = async () => {
  const requestObj = {
    path: `api/admin/init_admin`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
