import { invokeApi } from "../invokeApi";

export const Type_Base_Listing_FBR = (data, user_id) => {
  const requestObj = {
    path: `api/fbr/type_base_data_fbr_for_admin/${user_id}`,
    method: "POST",
    headers: {
      "x-sh-auth": localStorage.getItem("token"),
    },
    postData: data || {},
  };
  return invokeApi(requestObj);
};
