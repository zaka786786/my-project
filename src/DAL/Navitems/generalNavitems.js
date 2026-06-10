import { invokeApi } from "../invokeApi";

export const _get_navitems = async (type) => {
  const token = localStorage.getItem("token");
  let requestObj = {
    path: `api/website_setting/get_nav_items?type=${type}`,
    method: "GET",
    headers: {
        "x-sh-auth": token,
        "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_navitems = async (data, type) => {
  const token = localStorage.getItem("token");
  let requestObj = {
    path: `api/website_setting/update_nav_items?type=${type}`,
    method: "POST",
    postData: data,
    headers: {
        "x-sh-auth": token,
        "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};


export const _NavItemAccess = async (type, user_id) => {
  const token = localStorage.getItem("token");
  let requestObj = {
    path: `api/app_api/get_nav_items?type=${type}&user_id=${user_id}`,
    method: "GET",
    headers: {
        "x-sh-auth": token,
        "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};


export const _update_NavItemAccess = async (data, type, user_id) => {
  const token = localStorage.getItem("token");
  let requestObj = {
    path: `api/app_api/update_nav_items?type=${type}&user_id=${user_id}`,
    method: "POST",
    postData: data,
    headers: {
        "x-sh-auth": token,
        "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
