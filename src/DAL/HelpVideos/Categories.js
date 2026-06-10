import { invokeApi } from "../invokeApi";

export const help_video_categories_list_api = async (data, page, limit) => {
  const requestObj = {
    path: `api/help_video_category/list_help_video_category?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const badge_list_api = async (page, limit, search) => {
  const requestObj = {
    path: `/api/badge??page=${page}&limit=${limit}&search_text=${
      search ? search : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const card_list_api = async (page, limit, search) => {
  const requestObj = {
    path: `/api/card/list?page=${page}&limit=${limit}&search_text=${
      search ? search : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const Member_Delete_Request = async (page, limit, search) => {
  const requestObj = {
    path: `/admin/api/member/delete_requested/list?page=${page}&limit=${limit}&search_text=${
      search ? search : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const cancel_subscription_Request = async (
  page,
  limit,
  search,
  type
) => {
  const requestObj = {
    path: `/admin/api/subscription/cancellation_requests/list?page=${page}&limit=${limit}&type=${type}&search_text=${
      search ? search : ""
    }`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const delete_category_api = async (id) => {
  const requestObj = {
    path: `api/help_video_category/delete_help_video_category_by_id/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const delete_bedge_api = async (id) => {
  const requestObj = {
    path: `/api/badge/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const delete_card_api = async (id) => {
  const requestObj = {
    path: `/api/card/delete/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const delete_member_account_api = async (id, data) => {
  const requestObj = {
    path: `/admin/api/member/manage_delete_member_request/${id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const change_request_status_api = async (id, data) => {
  const requestObj = {
    path: `/admin/api/subscription/cancellation_requests/update/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const card_bedge_api = async (id) => {
  const requestObj = {
    path: `/api/badge/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const add_category_api = async (data) => {
  const requestObj = {
    path: `api/help_video_category/add_help_video_category`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const add_bedge = async (data) => {
  const requestObj = {
    path: `/api/badge`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const add_card = async (data) => {
  const requestObj = {
    path: `/api/card/add`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
      "Content-Type": "multipart/form-data",
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const add_dynamite_lifestyle_settings = async (data) => {
  const requestObj = {
    path: `/admin/api/default_setting/update/delegate_portal_access_settings`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const add_dynamite_lifestyle_settings_spacific = async (id, data) => {
  const requestObj = {
    path: `/admin/api/consultant/update_delegate_portal_access_settings/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const get_dynamite_lifestyle_settings = async (access_settings_type) => {
  const requestObj = {
    path: `/admin/api/default_setting/get/delegate_portal_access_settings/${access_settings_type}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const get_slots_reminder_settings = async (access_settings_type) => {
  const requestObj = {
    path: `/admin/api/default_setting/get_slot_reminder_settings/get/${access_settings_type}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const get_dynamite_lifestyle_settings_spacific = async (id) => {
  const requestObj = {
    path: `/admin/api/consultant/get_delegate_portal_access_settings/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const update_category_api = async (data, id) => {
  const requestObj = {
    path: `api/help_video_category/update_help_video_category_by_id/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const update_badge_api = async (data, slug) => {
  const requestObj = {
    path: `/api/badge/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const update_card = async (data, slug) => {
  const requestObj = {
    path: `/api/card/update/${slug}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const category_detail_api = async (id) => {
  const requestObj = {
    path: `api/help_video_category/find_help_video_category_by_id/${id}`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const active_category_list_api = async () => {
  const requestObj = {
    path: `/api/help_video_category/list_help_video_category_active`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
export const active_category_departments_list_api = async () => {
  const requestObj = {
    path: `/admin/app/categories_and_departments/list`,
    method: "GET",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};
