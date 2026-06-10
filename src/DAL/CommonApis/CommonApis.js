import { invokeApi } from "../invokeApi";

export const _is_user_name_exist = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/app_api/is_user_name_exist`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _Change_Status = async (data, id) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/business/update_business_status/${id}`,
    method: "PUT",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
