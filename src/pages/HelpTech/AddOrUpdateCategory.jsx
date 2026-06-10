import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { imageBaseUrl } from "../../config/config";
import CircularLoader from "../../components/loaders/CircularLoader";
import CustomAutocomplete from "../../components/CustomeAutoComplete/CustomAutoComplete";
import { Input } from "../../utils/domUtils";
import Editor from "../../components/editor/Editor";
import ActiveLastBreadcrumb from "../../components/BreadCrums";
import { useAdminContext } from "../../Hooks/AdminContext";
import {
  add_category_api,
  category_detail_api,
  update_category_api,
} from "../../DAL/HelpVideos/Categories";
import { uploadImage } from "../../utils/constant";

export default function AddOrUpdateCategory({ type }) {
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [file, setProfileImage] = useState();
  const [formType, setFormType] = useState("ADD");
  const [oldImage, setOldImage] = useState("");

  const [groupList, setGroupList] = useState([]);
  const [delegatesList, setDelegatesList] = useState([]);
  const [inputs, setInputs] = useState({
    title: "",
    category_for: "internal_team",
    order: 0,
    status: true,
    image: null,
    short_description: "",
    detailed_description: "",
    groups: [],
    delegates: [],
    exclude_delegates: [],
  });

  const getCategoryList = async () => {
    setIsLoading(true);
    // const result = await active_category_departments_list_api();
    const result = {};
    if (result.code == 200) {
      setGroupList(result?.groups);
      setDelegatesList(
        result?.delegates.map((item) => {
          return {
            _id: item._id,
            title: `${item.first_name} ${item.last_name} (${item.email})`,
          };
        }),
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };
  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  const getCategoryData = async () => {
    setIsLoading(true);
    let result = await category_detail_api(params.id);
    if (result.code == 200) {
      setFormType("EDIT");
      const { category = {} } = result;
      setInputs({
        ...category,
        title: category.title,
        short_description: category.short_description,
        detailed_description: category.detail_description,
        status: category.status,
        image: category.image,
        category_for: category?.category_for || "internal_team",
      });

      setOldImage(result.image);
      setIsLoading(false);
    } else {
      navigate(`/help-video-categories`);
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.image === null) {
      enqueueSnackbar("Please Upload a Icon", { variant: "error" });
      return;
    }
    setIsLoading(true);
    let img;
    if (inputs.image instanceof File) {
      img = await uploadImage(inputs.image);
    } else {
      img = inputs.image;
    }
    const formData = {
      title: inputs.title,
      short_description: inputs.short_description,
      detail_description: inputs.detailed_description,
      image: img,
      status: inputs.status,
      category_for: inputs?.category_for || "internal_team",
    };
    if (formType !== "ADD") {
      formData.order = inputs.order;
    }
    const result =
      formType === "ADD"
        ? await add_category_api(formData)
        : await update_category_api(formData, params.id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      navigate(`/help-video-categories`);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const breadCrumbMenu = [
    {
      title: "Help Video Categories",
      navigation: "/help-video-categories",
      active: false,
    },
    {
      title: params.id
        ? `Update Help Video Category`
        : "Add Help Video Category",
      active: true,
    },
  ];

  if (params.id) {
    breadCrumbMenu.splice(1, 0, {
      title: inputs.title,
      active: true,
    });
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChangeOthers = (event, name) => {
    setInputs((values) => ({ ...values, [name]: event }));
  };

  useEffect(() => {
    setNavBarTitle(
      params?.id ? "Update Help Video Category" : "Add Help Video Category",
    );
    setIsBackButton(true);

    if (params && params.id) {
      setIsLoading(true);
    }

    if (params && params.id) {
      getCategoryData();
    }
    getCategoryList();
  }, []);

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="container-fluid">
      {/* <div className="row mobile-margin display-flex">
        <div className="col-12 d-flex my-2">
          <span>
            <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
          </span>
        </div>
      </div> */}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Category Title"
              variant="outlined"
              fullWidth
              required
              name="title"
              value={inputs.title}
              onChange={handleChange}
              size="small"
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status *</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                required
                value={inputs.status}
                label="Status *"
                onChange={handleChange}
                size="small"
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Category For*
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="category_for"
                required
                value={inputs?.category_for}
                label="Category For*"
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="internal_team">Internal Team</MenuItem>
                <MenuItem value="business_portal">Bussiness Portal</MenuItem>
              </Select>
            </FormControl>
          </div>
          {formType == "EDIT" && (
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <TextField
                id="outlined-basic"
                label="Order"
                variant="outlined"
                fullWidth
                required
                name="order"
                value={inputs.order}
                onChange={handleChange}
                size="small"
              />
            </div>
          )}
          {type == "delegate" && (
            <>
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <CustomAutocomplete
                  label="Groups"
                  value={inputs?.groups ?? []}
                  onChange={(e) => {
                    handleChangeOthers(e, "groups");
                  }}
                  options={groupList}
                  size="small"
                />
              </div>{" "}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <CustomAutocomplete
                  label="Delegates"
                  value={inputs?.delegates ?? []}
                  onChange={(e) => {
                    handleChangeOthers(e, "delegates");
                  }}
                  options={delegatesList}
                  size="small"
                />
              </div>{" "}
              <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
                <CustomAutocomplete
                  label="Exclude Delegates"
                  value={inputs?.exclude_delegates ?? []}
                  onChange={(e) => {
                    handleChangeOthers(e, "exclude_delegates");
                  }}
                  options={delegatesList}
                  size="small"
                />
              </div>
            </>
          )}
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Icon *</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {inputs.image && (
                  <img
                    src={
                      inputs.image instanceof File
                        ? URL.createObjectURL(inputs.image)
                        : imageBaseUrl + inputs.image
                    }
                    height="50"
                  />
                )}
              </div>
              <div className="col-5 text-end pt-2">
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="image"
                    onChange={fileChangedHandler}
                  />

                  <Button
                    className="small-contained-button"
                    startIcon={<FileUploadIcon />}
                    component="span"
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </div>
            {inputs?.image?.name == "" ? (
              ""
            ) : (
              <p className="text-secondary">{inputs?.image?.name}</p>
            )}
          </div>
          <div className="col-12 mt-3">
            <FormControl fullWidth>
              <TextField
                id="outlined-multiline-flexible"
                label="Short Description"
                multiline
                rows={4}
                required
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
                size="small"
              />
              <FormHelperText>Maximum limit 500 characters</FormHelperText>
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <h4>Detail Description</h4>
            <Editor
              value={inputs.detailed_description}
              onChange={(e) => {
                handleChange({
                  target: { name: "detailed_description", value: e },
                });
              }}
            />
          </div>
          <div
            className="text-end mt-4"
            id={formType == "ADD" ? "" : "fixedbutton"}
          >
            <Button
              variant="contained"
              type="submit"
              className="position-fixed-button"
            >
              {formType == "ADD" ? "Submit" : "Update"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
