// localStorage setitem

import { encryptToken } from "../utils/constant_new";

export const _set_token_in_localStorage = (token) => {
  localStorage.setItem("token", encryptToken(token));
};

export const _set_user_in_localStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const _get_user_in_localStorage = () => {
  localStorage.getItem("user");
};
