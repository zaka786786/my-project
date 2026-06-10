import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import AddOrUpdateComponent from "./components/AddOrUpdateComponent";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import CircularLoader from "../../components/loaders/CircularLoader";
import { useAdminContext } from "../../Hooks/AdminContext";
import { debounce } from "lodash";
import {
  _add_admin_user,
  _detail_admin_by_admin,
  _edit_admin_user,
} from "../../DAL/AdminUsers/admin_users";

import { _upload_image } from "../../DAL/Uploads/imageUpload";
import {
  validatePassword,
  validatePhoneNumber,
  validateField,
  validateOnlyCharacters,
} from "../../utils/constant";
import { encryptPassword } from "../../utils/constant_new";
import { _roles_list } from "../../DAL/Roles/roles";

const EMPTYDATA = {
  first_name: "",
  last_name: "",
  user_name: "",
  email: "",
  password: "",
  profile_image: "",
  status: false,
  address: "",
  two_factor_auth: false,
  role: null,
};

const AddOrUpdateAdminUsers = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const [isStatusActive, setIsStatusActive] = useState(true);
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formInputs, setFormInputs] = useState(EMPTYDATA);
  const [isLoading, setIsLoading] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [roleSearch, setRoleSearch] = useState("");
  const isEdit = !!params.id;

  const breadCrumbMenu = [
    {
      title: "Admin Users",
      navigation: "/admin-users",
      active: false,
    },
    {
      title: isEdit ? "Update Admin User" : "Add Admin User",
      active: true,
    },
  ];

  function handleFile(e) {
    const file = e.target.files[0];
    setFormInputs((prev) => ({
      ...prev,
      profile_image: file,
    }));
  }

  function handleRemoveImage() {
    setFormInputs((prev) => ({
      ...prev,
      profile_image: "",
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputs({ ...formInputs, [name]: value });
  };

  const validateForm = () => {
    if (!formInputs?._id) {
      let passwordError = validatePassword(formInputs.password, "Password");
      if (passwordError)
        return enqueueSnackbar(passwordError, { variant: "error" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formInputs.email.trim())) {
      return enqueueSnackbar("Please enter a valid email address", {
        variant: "error",
      });
    }
    if (!formInputs?.role) {
      return enqueueSnackbar("Role is required", {
        variant: "error",
      });
    }

    // const phoneNumberError = validatePhoneNumber(phoneNumber, "Phone number");
    // if (phoneNumberError)
    //   return enqueueSnackbar(phoneNumberError, { variant: "error" });

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitButtonLoader(true);

    if (formInputs.profile_image instanceof File) {
      const formDataLogo = new FormData();
      formDataLogo.append("image", formInputs.profile_image);
      let resultLogo = await _upload_image(formDataLogo);
      if (resultLogo.code == 200) {
        formInputs.profile_image = resultLogo.path;
      }
    }

    const encryptedPassword = encryptPassword(formInputs?.password?.trim());

    let updatedPhoneNumber = phoneNumber == "+" ? "" : phoneNumber;

    if (updatedPhoneNumber == "+92") {
      updatedPhoneNumber = "";
    }
    const postData = {
      two_factor_auth: formInputs?.two_factor_auth,
      first_name: formInputs?.first_name,
      last_name: formInputs?.last_name,
      email: formInputs?.email,
      phone_number: updatedPhoneNumber,
      profile_image: formInputs.profile_image,
      role_id: formInputs?.role?._id,
      status: isStatusActive,
      address: formInputs?.address || "",
      ...(formInputs._id ? {} : { password: encryptedPassword }),
    };

    let response;

    if (formInputs?._id) {
      response = await _edit_admin_user(postData, formInputs?.admin_id);
    } else {
      response = await _add_admin_user(postData);
    }

    if (response?.code === 200) {
      enqueueSnackbar(response?.message || "Success", { variant: "success" });
      navigate("/admin-users");
    } else {
      enqueueSnackbar(response?.message || "Failed", { variant: "error" });
      setSubmitButtonLoader(false);
    }
  };

  const get_active_roles = async (search = "") => {
    const response = await _roles_list(0, 50, {
      search: search,
    });
    if (response?.code === 200) {
      setRolesList(response?.roles || []);
    } else {
      enqueueSnackbar(response?.message, {
        variant: "error",
      });
    }
  };

  const get_detail_admin_by_admin = async () => {
    setIsLoading(true);
    const response = await _detail_admin_by_admin(params.id);
    if (response?.code === 200) {
      let rowData = response?.admin || null;

      setIsStatusActive(rowData?.status);
      setPhoneNumber(rowData?.phone_number || "");
      setFormInputs({
        _id: rowData?._id || "",
        first_name: rowData?.first_name,
        last_name: rowData?.last_name,
        email: rowData?.user_id?.email,
        profile_image: rowData?.profile_image,
        password: rowData?.password || "",
        phoneNumber: rowData?.phone_number,
        address: rowData?.address || "",
        admin_id: rowData?.user_id?._id || "",
        two_factor_auth: rowData?.user_id?.two_factor_auth ?? false,
        role: rowData?.role ?? null,
      });
      setIsLoading(false);
    } else {
      enqueueSnackbar(response?.message, {
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce((value) => {
    get_active_roles(value);
  }, 600);

  useEffect(() => {
    setNavBarTitle(isEdit ? "Update Admin User" : "Add Admin User");
    if (isEdit) {
      get_detail_admin_by_admin();
    } else {
      setIsLoading(false);
    }
    setIsBackButton(true);
  }, []);

  useEffect(() => {
    debouncedSearch(roleSearch);

    return () => {
      debouncedSearch.cancel();
    };
  }, [roleSearch]);

  if (isLoading) return <CircularLoader />;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 my-2">
          <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AddOrUpdateComponent
          formInputs={formInputs}
          setFormInputs={setFormInputs}
          handleFile={handleFile}
          handleChange={handleChange}
          handleRemoveImage={handleRemoveImage}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          rolesList={rolesList}
          setRoleSearch={setRoleSearch}
        />

        <div className="text-end mt-4">
          <Button variant="contained" type="submit">
            {isEdit ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOrUpdateAdminUsers;
