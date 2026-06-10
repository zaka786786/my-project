import axios from "axios";
import { baseApikey, baseUrl } from "../config/config";
import {
  decryptToken,
  encryptPassword,
  getPathFromUrl,
} from "../utils/constant_new";

axios.defaults.headers.post["Content-Type"] = "application/json";

export async function invokeApi({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}) {
  const reqObj = {
    method,
    url: baseUrl + path,
    headers: {
      ...headers,
      "x-sh-key": baseApikey,
    },
  };

  if (reqObj.headers["x-sh-auth"]) {
    if (
      !reqObj.headers["x-sh-auth"].startsWith(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      )
    ) {
      reqObj.headers["x-sh-auth"] = decryptToken(reqObj.headers["x-sh-auth"]);
    }
  }

  reqObj.headers["x-ni-key"] = encryptPassword(
    getPathFromUrl(window?.location?.href),
  );

  reqObj.params = queryParams;

  if (method === "POST") {
    reqObj.data = postData;
  }
  if (method === "PUT") {
    reqObj.data = postData;
  }
  if (method === "DELETE") {
    reqObj.data = postData;
  }

  let results;
  if (postData instanceof FormData) {
    console.log(...postData, "<=REQUEST-DATA=>");
    reqObj.headers["Content-Type"] = "multipart/form-data";
  }

  console.log("<=REQUEST-OBJECT=>", reqObj);

  try {
    results = await axios(reqObj);
    console.log("<=Api-Success-Result=>", results);

    return results.data;
  } catch (error) {
    console.log("<=Api-Error=>", error?.response?.data);

    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    return {
      code: error?.response?.status,
      message: error?.response?.data?.message
        ? error.response.data.message
        : "",
    };
  }
}
