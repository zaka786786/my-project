import { invokeApi } from "../invokeApi";

export const _Dashboard_Data = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/dashboard/get_admin_dashboard_data`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
