import { invokeApi } from "../invokeApi";
export const _business_categories_list = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/list_business_category`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

// Add Business Categories
export const _add_business_categories = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/add_business_category`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

// Edit Business Categories
export const _edit_business_categories = async (data, category_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/update_business_category_by_id/${category_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

// Delete Business Categories
export const _delete_business_categories = async (category_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/delete_business_category_by_id/${category_id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _get_common_business_categories = async (data, pathEndPoint) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: pathEndPoint || `api/app_api/type_base_data_for_admin`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _get_navitems_for_business_categories = async (cat_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/get_nav_items_of_business_category/${cat_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

// Edit Business Categories
export const _update_navitems_for_business_categories = async (
  data,
  category_id,
) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/update_nav_items_business_category/${category_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _find_business_category_by_id = async (category_id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/find_business_category_by_id/${category_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
export const _get_business_settings_of_business_category = async (
  category_id,
) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/get_business_settings_of_business_category/${category_id}`,
    method: "GET",
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _update_business_category_business_settings = async (
  category_id,
  data,
) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business_category/update_business_category_business_settings/${category_id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
