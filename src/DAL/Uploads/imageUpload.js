import { invokeApi } from "../invokeApi";

export const _upload_image = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/app_api/upload_image_s3`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      //   "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};

export const _Delete_Image = async (data) => {
  const token = localStorage.getItem("token");
  const requestObj = {
    path: `api/app_api/delete_files_from_s3`,
    method: "POST",
    postData: data,
    headers: {
      "x-sh-auth": token,
      //   "Content-Type": "application/json",
    },
  };
  return invokeApi(requestObj);
};
