import { useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconButton, Autocomplete, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { debounce } from "lodash";
import CircularLoader from "../../../../components/loaders/CircularLoader";
import { imageBaseUrl } from "../../../../config/config";
import { Input } from "../../../../utils/domUtils";
import {
  add_video_api,
  category_video_api,
  update_video_api,
} from "../../../../DAL/HelpVideos/HelpVideos";
import Editor from "../../../../components/editor/Editor";
import { useAdminContext } from "../../../../Hooks/AdminContext";
import CustomAutocomplete from "../../../../components/CustomeAutoComplete/CustomAutoComplete";
import { _get_common_business_categories } from "../../../../DAL/BusinessCategories/business_categories";
import { uploadImage } from "../../../../utils/constant";

export default function AddOrUpdateVideo() {
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const navigate = useNavigate();
  const params = useParams();
  const { category_id, video_id } = params;
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [file, setProfileImage] = useState();
  const [formType, setFormType] = useState("ADD");
  const [oldImage, setOldImage] = useState("");
  const [businessIncludedOptions, setBusinessIncludedOptions] = useState([]);
  const [businessExcludedOptions, setBusinessExcludedOptions] = useState([]);
  const [businessIncludedLoading, setBusinessIncludedLoading] = useState(false);
  const [businessExcludedLoading, setBusinessExcludedLoading] = useState(false);
  const [businessIncludedInputValue, setBusinessIncludedInputValue] =
    useState("");
  const [businessExcludedInputValue, setBusinessExcludedInputValue] =
    useState("");

  const [inputs, setInputs] = useState({
    title: "",
    order: 0,
    status: true,
    image: null,
    video_url: "",
    short_description: "",
    detailed_description: "",
    category: null,
    video_type: "general",
    business_excluded: [],
    business_included: [],
  });

  const fileChangedHandler = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    setInputs({
      ...inputs,
      ["image"]: e.target.files[0],
    });
  };

  // Fetch business options for included businesses
  const fetchBusinessIncludedOptions = useCallback(
    debounce(async (searchText) => {
      if (!inputs?.category?._id) {
        setBusinessIncludedOptions([]);
        return;
      }

      console.log("fetching included business options");
      setBusinessIncludedLoading(true);
      try {
        const response = await _get_common_business_categories({
          type: "business_v1",
          search: searchText,
          category_id: inputs?.category?._id,
        });

        if (response.code === 200 && Array.isArray(response.data)) {
          const formattedOptions = response.data.map((item) => ({
            ...item,
            value: item._id,
            label: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
          }));

          // Filter out already selected businesses (included and excluded)
          const selectedBusinessIds = [
            ...inputs.business_included.map((b) => b.value),
            ...inputs.business_excluded.map((b) => b.value),
          ];

          const filteredOptions = formattedOptions.filter(
            (option) => !selectedBusinessIds.includes(option.value),
          );
          setBusinessIncludedOptions(filteredOptions);
        } else {
          setBusinessIncludedOptions([]);
        }
      } catch (error) {
        console.error("Error fetching included business data:", error);
        setBusinessIncludedOptions([]);
      } finally {
        setBusinessIncludedLoading(false);
      }
    }, 300),
    [inputs?.category?._id, inputs.business_included, inputs.business_excluded],
  );

  // Fetch business options for excluded businesses
  const fetchBusinessExcludedOptions = useCallback(
    debounce(async (searchText) => {
      if (!inputs?.category?._id) {
        setBusinessExcludedOptions([]);
        return;
      }
      console.log("fetching excluded business options");
      setBusinessExcludedLoading(true);
      try {
        const response = await _get_common_business_categories({
          type: "business_v1",
          search: searchText,
          category_id: inputs?.category?._id,
        });

        if (response.code === 200 && Array.isArray(response.data)) {
          const formattedOptions = response.data.map((item) => ({
            ...item,
            value: item._id,
            label: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
          }));

          // Filter out already selected businesses (included and excluded)
          const selectedBusinessIds = [
            ...inputs.business_included.map((b) => b.value),
            ...inputs.business_excluded.map((b) => b.value),
          ];

          const filteredOptions = formattedOptions.filter(
            (option) => !selectedBusinessIds.includes(option.value),
          );

          setBusinessExcludedOptions(filteredOptions);
        } else {
          setBusinessExcludedOptions([]);
        }
      } catch (error) {
        console.error("Error fetching excluded business data:", error);
        setBusinessExcludedOptions([]);
      } finally {
        setBusinessExcludedLoading(false);
      }
    }, 300),
    [inputs?.category?._id, inputs.business_included, inputs.business_excluded],
  );

  // Effect to fetch business options when category changes
  useEffect(() => {
    if (inputs?.category?._id) {
      fetchBusinessIncludedOptions("");
      fetchBusinessExcludedOptions("");
    }
  }, [
    inputs?.category?._id,
    inputs.business_included,
    inputs.business_excluded,
    fetchBusinessIncludedOptions,
    fetchBusinessExcludedOptions,
  ]);

  // Update the handleChange function to reset business selections when category changes
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((values) => ({ ...values, [name]: value }));

    // Reset business selections when category changes
    if (name === "category") {
      setInputs((prev) => ({
        ...prev,
        business_included: [],
        business_excluded: [],
      }));
    }
  };

  // Update the getVideoData function to include business data
  const getVideoData = async () => {
    setIsLoading(true);
    let result = await category_video_api(video_id);
    if (result.code == 200) {
      setFormType("EDIT");
      setInputs({
        ...result.video,
        category: result?.video?.business_category,
        detailed_description: result.video.detail_description,
        business_included:
          result?.video?.business_included?.map((business) => {
            return {
              ...business,
              value: business._id,
              user_id: {
                _id: business.user_id,
                email: business.email,
              },
              label: `${business.first_name} ${business.last_name}`,
            };
          }) || [],
        business_excluded:
          result?.video?.business_excluded?.map((business) => {
            return {
              ...business,
              value: business._id,
              user_id: {
                _id: business.user_id,
                email: business.email,
              },
              label: `${business.first_name} ${business.last_name}`,
            };
          }) || [],
      });
      setOldImage(result?.video?.image);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.image == null) {
      enqueueSnackbar("Please Upload Image", { variant: "error" });
      setIsLoading(false);
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
      video_url: inputs.video_url,
      image: img,
      status: inputs.status,
      video_category: {
        _id: category_id,
      },
      video_type: inputs.video_type,
      business_category: inputs.category
        ? {
            _id: inputs?.category?._id,
            title: inputs?.category?.title,
          }
        : null,
      business_included:
        inputs.business_included.length > 0
          ? inputs.business_included.map((business) => business.user_id._id)
          : null,
      business_excluded:
        inputs.business_excluded.length > 0
          ? inputs.business_excluded.map((business) => business.user_id._id)
          : null,
    };

    if (formType === "EDIT") {
      formData.order = inputs?.order;
      delete formData?.video_category;
    }

    const result =
      formType === "ADD"
        ? await add_video_api(formData)
        : await update_video_api(formData, video_id);
    if (result.code === 200) {
      navigate(`/help-video-categories/help-videos/${category_id}`);
      enqueueSnackbar(result.message, { variant: "success" });
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNavBarTitle("");
    setIsBackButton(false);
    if (params && video_id) {
      getVideoData();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="container-fluid position-relative">
      <div className="row mobile-margin display-flex">
        <div className="col-12 d-flex mt-2">
          <span>
            <IconButton
              className="back-screen-button mb-1"
              onClick={() => {
                navigate(`/help-video-categories/help-videos/${category_id}`);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </span>

          <h2 className="ms-1">{`${
            formType === "ADD" ? "Add" : "Edit"
          } Video`}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <TextField
              id="outlined-basic"
              label="Video Title"
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
            <TextField
              id="outlined-basic"
              label="Video Url"
              variant="outlined"
              fullWidth
              required
              name="video_url"
              value={inputs.video_url}
              onChange={handleChange}
              size="small"
            />
          </div>

          {formType !== "ADD" && (
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
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <FormControl fullWidth>
              <InputLabel id="video-type-label">Video Type *</InputLabel>
              <Select
                labelId="video-type-label"
                id="video-type-select"
                name="video_type"
                required
                value={inputs.video_type || ""}
                label="Video Type *"
                onChange={handleChange}
                size="small"
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="business_specific">Business Specific</MenuItem>
              </Select>
            </FormControl>
          </div>
          {inputs.video_type === "business_specific" && (
            <>
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <CustomAutocomplete
                  fullWidth
                  options={null}
                  label={"Business Category"}
                  getOptionLabel={(option) => option.title || ""}
                  value={inputs.category}
                  onChange={(newValue) => {
                    handleChange({
                      target: {
                        name: "category",
                        value: newValue,
                      },
                    });
                  }}
                  type="business_category"
                  size="small"
                />
              </div>
              {/* Included Business Multi Select */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <Autocomplete
                  multiple
                  size="small"
                  fullWidth
                  value={inputs.business_included}
                  inputValue={businessIncludedInputValue}
                  onInputChange={(event, newInputValue) => {
                    setBusinessIncludedInputValue(newInputValue);
                    fetchBusinessIncludedOptions(newInputValue);
                  }}
                  options={businessIncludedOptions}
                  loading={businessIncludedLoading}
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={(event, newValue) => {
                    setInputs((prev) => ({
                      ...prev,
                      business_included: newValue,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Included Businesses"
                      variant="outlined"
                      placeholder="Search and select businesses to include"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {businessIncludedLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </div>

              {/* Excluded Business Multi Select */}
              <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                <Autocomplete
                  multiple
                  size="small"
                  fullWidth
                  value={inputs.business_excluded}
                  inputValue={businessExcludedInputValue}
                  onInputChange={(event, newInputValue) => {
                    setBusinessExcludedInputValue(newInputValue);
                    fetchBusinessExcludedOptions(newInputValue);
                  }}
                  options={businessExcludedOptions}
                  loading={businessExcludedLoading}
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={(event, newValue) => {
                    setInputs((prev) => ({
                      ...prev,
                      business_excluded: newValue,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Excluded Businesses"
                      variant="outlined"
                      placeholder="Search and select businesses to exclude"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {businessExcludedLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </>
          )}
          <div className="col-lg-12 col-md-12 col-sm-12 mt-4">
            <div className="row w-100 div-style ms-0 pt-0">
              <div className="col-5">
                <p className="">Upload Image *</p>
                <FormHelperText className="pt-0">
                  Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")
                </FormHelperText>
              </div>
              <div className="col-2">
                {file ? (
                  <img src={file} height="50" />
                ) : (
                  oldImage && <img src={imageBaseUrl + oldImage} height="50" />
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
                size="small"
                id="outlined-multiline-flexible"
                label="Short Description"
                multiline
                rows={4}
                required
                name="short_description"
                value={inputs.short_description}
                onChange={handleChange}
              />
              <FormHelperText>Maximum limit 500 characters</FormHelperText>
            </FormControl>
          </div>
          <div className="col-12 mt-4">
            <h4>Detail Description</h4>
            <Editor
              onChange={(e) => {
                handleChange({
                  target: { name: "detailed_description", value: e },
                });
              }}
              value={inputs?.detailed_description}
            />
          </div>
          <div className="text-end mt-4">
            <Button
              variant="contained"
              className="position-fixed-button"
              type="submit"
              id={formType == "ADD" ? "" : "fixedbutton"}
            >
              {formType == "ADD" ? "Submit" : "Update"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
