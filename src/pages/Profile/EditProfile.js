import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import Iconify from "../../components/Iconify";
import { useAdminContext } from "../../Hooks/AdminContext";
import MuiPhoneNumber from "material-ui-phone-number";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { _set_user_in_localStorage } from "../../local_storage/local_storage";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { imageBaseUrl } from "../../config/config";
import { _upload_image } from "../../DAL/Uploads/imageUpload";
import { _edit_admin_profile } from "../../DAL/Login/login";

const Input = styled("input")({
  display: "none",
});

const EditProfile = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setNavBarTitle, userInfo, setUserInfo, setIsBackButton } =
    useAdminContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadImage, setIsUploadImage] = useState(false);
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    address: "",
    email: "",
    phone_number: "",
    profile_image: "",
    avatar: "",
  });

  const handleChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const hanldeNavigate = () => {
    navigate(-1);
    // navigate(`/dashboard`);
  };

  const image_handler = async (file) => {
    let formData = new FormData();
    formData.append("image", file);
    setIsUploadImage(true);
    const result = await _upload_image(formData);
    if (result.code === 200) {
      setProfile((pre) => ({
        ...pre,
        profile_image: result?.path,
      }));
      setIsUploadImage(false);
    } else {
      enqueueSnackbar(result?.message, { variant: "error" });
      setProfile((pre) => ({
        ...pre,
        profile_image: "",
      }));
      setIsUploadImage(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      image_handler(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };
  const handleSubmit = async () => {
    // setSubmitButtonLoader(true);
    console.log("Profile saved", profile);

    let postData = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      address: profile.address,
      phone_number: phoneNumber,
    };

    if (profile?.profile_image) {
      postData.profile_image = profile?.profile_image;
    }

    const result = await _edit_admin_profile(postData);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      setUserInfo(result.admin);
      _set_user_in_localStorage(result.admin);

      // setUserInfo(result.user);
      //     _set_user_in_localStorage(result.user);

      setSubmitButtonLoader(false);
      hanldeNavigate();
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setSubmitButtonLoader(false);
    }
  };

  useEffect(() => {
    setNavBarTitle("Edit Profile");
    setIsBackButton(false);
    setPhoneNumber(userInfo?.phone_number);

    setProfile((pre) => ({
      ...pre,
      ...userInfo,
      email: userInfo?.user_id?.email,
    }));

    if (userInfo?.profile_image) {
      setAvatarPreview(imageBaseUrl + userInfo?.profile_image);
    }

    if (userInfo) {
      setIsLoading(false);
    }
  }, [userInfo]);

  if (isLoading == true) {
    return <CircularProgress color="primary" />;
  }

  return (
    <div className="container-fluid pt-3">
      <div className="row justify-content-center mb-4">
        <div className="col-md-6 text-center">
          <div className="mb-3">
            <Avatar
              src={avatarPreview}
              alt={userInfo?.first_name}
              sx={{
                width: 120,
                height: 120,
                margin: "0 auto",
                border: "3px solid #ddd",
              }}
            />
          </div>
          <label htmlFor="avatar-upload">
            <Input
              accept="image/*"
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
              disabled={isUploadImage}
            />

            <LoadingButton
              variant="outlined"
              component="span"
              startIcon={<Iconify icon="mdi:camera" />}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
                py: 1,
              }}
              loading={isUploadImage}
            >
              Change Photo
            </LoadingButton>

            {/* <Button
              variant="outlined"
              component="span"
              startIcon={<Iconify icon="mdi:camera" />}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
                py: 1,
              }}
            >
              Change Photo
            </Button> */}
          </label>
          <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
            Upload a profile image (JPG, PNG). Max size 2MB.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col-12 col-md-6">
          <TextField
            label="First Name"
            fullWidth
            value={profile.first_name}
            onChange={handleChange("first_name")}
            required
            size="small"
          />
        </div>
        <div className="mb-3 col-12 col-md-6">
          <TextField
            label="Last Name"
            fullWidth
            value={profile.last_name}
            onChange={handleChange("last_name")}
            required
            size="small"
          />
        </div>

        <div className="mb-3 col-12 col-md-6">
          <MuiPhoneNumber
            label="Phone Number"
            defaultCountry={"pk"}
            fullWidth
            required
            inputProps={{ min: 11 }}
            name="phoneNumber"
            value={phoneNumber}
            variant="outlined"
            onChange={(value) => {
              setPhoneNumber(value);
            }}
          />
        </div>
        <div className="mb-3 col-12 col-md-6">
          <TextField
            label="Email Address"
            fullWidth
            value={profile.email}
            onChange={handleChange("email")}
            disabled
            size="small"
          />
        </div>

        <div className="mb-3 col-12">
          <TextField
            label="Address"
            fullWidth
            multiline
            rows={4}
            value={profile.address}
            onChange={handleChange("address")}
            size="small"
          />
        </div>
      </div>
      <div className="d-flex justify-content-end mt-4">
        <LoadingButton
          variant="contained"
          color="primary"
          // type="submit"
          // className="popover-apply-button"
          loading={submitButtonLoader}
          onClick={handleSubmit}
          startIcon={<Iconify icon="mdi:content-save-outline" />}
        >
          Update
        </LoadingButton>

        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={<Iconify icon="mdi:content-save-outline" />}
        >
          Update
        </Button> */}
      </div>
    </div>
  );
};

export default EditProfile;
