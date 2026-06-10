import { invokeApi } from "../invokeApi";

export const help_videos_list_api = async (data, page, limit) => {
  const requestObj = {
    path: `api/help_video/list_help_video?page=${page}&limit=${limit}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
export const help_videos_list_api_delegate = async (data) => {
  const requestObj = {
    path: `/api/help_video/list`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const delete_video_api = async (id) => {
  const requestObj = {
    path: `api/help_video/delete_help_video_by_id/${id}`,
    method: "DELETE",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
  };
  return invokeApi(requestObj);
};

export const add_video_api = async (data) => {
  const requestObj = {
    path: `api/help_video/add_help_video`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const update_video_api = async (data, id) => {
  const requestObj = {
    path: `api/help_video/update_help_video_by_id/${id}`,
    method: "PUT",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const category_video_api = async (id) => {
  const requestObj = {
    path: `api/help_video/find_help_video_by_id/${id}`,
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
