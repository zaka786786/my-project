import React, { useEffect, useState } from "react";
import { TextField, MenuItem, Paper, Typography, Divider } from "@mui/material";
import CustomAutocomplete from "../../../components/CustomeAutoComplete/CustomAutoComplete";
import { _get_common_business_categories } from "../../../DAL/BusinessCategories/business_categories";
import { enqueueSnackbar } from "notistack";
import { LEAD_SOURCES, REFERRAL_RELATIONS } from "../../../utils/constant";
import MuiPhoneNumber from "material-ui-phone-number";
import { useAdminContext } from "../../../Hooks/AdminContext";

const LeadFormFields = ({
  form,
  setForm,
  provinceList = [],
  isEdit = false,
}) => {
  const { adminInfo } = useAdminContext();
  const [cityList, setCityList] = useState([]);
  const [citySearch, setCitySearch] = useState("");

  let is_show_assign_to = false;

  if (
    adminInfo?.role?.alias_title == "admin" ||
    adminInfo?.role?.alias_title == "manager"
  ) {
    is_show_assign_to = true;
  }

  console.log("adminInfo  __adminInfo", adminInfo);
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNestedChange = (parent, key, value) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value,
      },
    }));
  };

  const handleSelectOther = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCityList = async () => {
    const response = await _get_common_business_categories({
      type: "cities",
      search: citySearch,
      document_id: form?.province_info?._id,
    });

    if (response?.code === 200) {
      setCityList(response?.data || []);
    } else {
      enqueueSnackbar(response?.message || "Failed to fetch data", {
        variant: "error",
      });
      setCityList([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (form?.province_info) {
        fetchCityList();
      } else {
        setCityList([]);
        setForm((prev) => ({
          ...prev,
          city_info: null,
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form?.province_info, citySearch]);

  const sectionStyle = {
    padding: "0px",
    marginBottom: "24px",
    borderRadius: "0px",
    border: "none",
    backgroundColor: "transparent",
    boxShadow: "none",
  };

  const headingStyle = {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#222",
    marginBottom: "18px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e5e5e5",
  };

  // const sectionStyle = {
  //   padding: "20px",
  //   marginBottom: "24px",
  //   borderRadius: "8px",
  //   border: "1px solid #e0e0e0",
  //   backgroundColor: "#fff",
  // };

  // const headingStyle = {
  //   fontWeight: 600,
  //   fontSize: "0.85rem",
  //   color: "#666",
  //   textTransform: "uppercase",
  //   marginBottom: "15px",
  //   letterSpacing: "0.5px",
  // };

  return (
    <div className="container-fluid px-0">
      <Paper elevation={0} style={sectionStyle}>
        <Typography style={headingStyle}>Basic Information</Typography>
        <div className="row">
          <div className="col-md-4 mb-3">
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              value={form?.name || ""}
              onChange={handleChange}
              required
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <MuiPhoneNumber
              label="Phone Number"
              defaultCountry={"pk"}
              fullWidth
              name="phone_number"
              value={form?.phone_number || ""}
              variant="outlined"
              inputProps={{ min: 11 }}
              onChange={(value) => {
                setForm((prev) => ({
                  ...prev,
                  phone_number: value,
                }));
              }}
              size="small"
              className="phone-number-setting"
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              value={form?.email || ""}
              onChange={handleChange}
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form?.address || ""}
              onChange={handleChange}
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <CustomAutocomplete
              label="Province"
              value={form?.province_info || null}
              onChange={(newValue) =>
                handleSelectOther("province_info", newValue)
              }
              options={null}
              getOptionLabel={(option) => option?.name || ""}
              required={true}
              type="province"
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <CustomAutocomplete
              label="City"
              value={form?.city_info || null}
              onChange={(newValue) => handleSelectOther("city_info", newValue)}
              options={cityList}
              getOptionLabel={(option) => option?.name || ""}
              required={true}
              setSearch={setCitySearch}
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <CustomAutocomplete
              label="Business Category"
              value={form?.category_id || null}
              onChange={(newValue) =>
                handleSelectOther("category_id", newValue)
              }
              options={null}
              getOptionLabel={(option) => option?.title || ""}
              required={true}
              type="business_category"
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              label="Expected Budget (PKR)"
              name="expected_budget"
              type="number"
              fullWidth
              value={form?.expected_budget || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0 || value === "") {
                  setForm((prev) => ({ ...prev, expected_budget: value }));
                }
              }}
              inputProps={{ min: 0 }}
              size="small"
            />
          </div>
        </div>
      </Paper>

      <Paper elevation={0} style={sectionStyle}>
        <Typography style={headingStyle}>Lead Source & Assignment</Typography>
        <div className="row">
          <div className="col-md-4 mb-3">
            <TextField
              select
              label="Lead Source"
              name="lead_source"
              fullWidth
              value={form?.lead_source || ""}
              onChange={handleChange}
              required
              size="small"
            >
              {LEAD_SOURCES.map((item) => (
                <MenuItem key={item?.value} value={item?.value}>
                  {item?.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              label="Platform / Campaign"
              name="platform_campaign"
              fullWidth
              value={form?.platform_campaign || ""}
              onChange={handleChange}
              size="small"
            />
          </div>

          {is_show_assign_to && (
            <div className="col-md-4 mb-3">
              <CustomAutocomplete
                label="Assign To"
                value={form?.assign_to_id || null}
                onChange={(newValue) =>
                  handleSelectOther("assign_to_id", newValue)
                }
                options={null}
                getOptionLabel={(option) =>
                  option?.label ||
                  `${option?.first_name || ""} ${option?.last_name || ""}`
                }
                type="business_filter"
                size="small"
              />
            </div>
          )}
        </div>

        {form?.lead_source === "referral" && (
          <div
            className="mt-2 p-3"
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px dashed #ccc",
            }}
          >
            <Typography
              variant="subtitle2"
              className="mb-3"
              style={{ color: "#d4a017", fontWeight: "bold" }}
            >
              REFERRAL INFORMATION
            </Typography>
            <div className="row">
              <div className="col-md-4 mb-3">
                <TextField
                  label="Referrer Name"
                  fullWidth
                  value={form?.referral_info?.name || ""}
                  onChange={(e) =>
                    handleNestedChange("referral_info", "name", e.target.value)
                  }
                  required
                  size="small"
                />
              </div>
              <div className="col-md-4 mb-3">
                <MuiPhoneNumber
                  label="Phone Number"
                  defaultCountry={"pk"}
                  fullWidth
                  inputProps={{ min: 11 }}
                  name="phoneNumber"
                  value={form?.referral_info?.phone_number || ""}
                  variant="outlined"
                  onChange={(value) =>
                    handleNestedChange("referral_info", "phone_number", value)
                  }
                  size="small"
                  className="phone-number-setting"
                />
              </div>
              <div className="col-md-4 mb-3">
                <TextField
                  select
                  label="Relation"
                  fullWidth
                  value={form?.referral_info?.relation || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "referral_info",
                      "relation",
                      e.target.value,
                    )
                  }
                  required
                  size="small"
                >
                  {REFERRAL_RELATIONS.map((item) => (
                    <MenuItem key={item?.value} value={item?.value}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
          </div>
        )}
      </Paper>

      <Paper elevation={0} style={sectionStyle}>
        <Typography style={headingStyle}>Lead Status & Interest</Typography>
        <div className="row">
          <div className="col-md-4 mb-3">
            <CustomAutocomplete
              label="Current Status"
              value={form?.lead_status_id || null}
              onChange={(newValue) =>
                handleSelectOther("lead_status_id", newValue)
              }
              options={null}
              getOptionLabel={(option) => option?.title || ""}
              required={true}
              type="lead_status"
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              label="Interested Product"
              name="interested_product"
              fullWidth
              value={form?.interested_product || ""}
              onChange={handleChange}
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              type="datetime-local"
              label="Follow Up Date & Time"
              name="follow_up_date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={form?.follow_up_date || ""}
              onChange={handleChange}
              size="small"
            />
          </div>
          <div className="col-md-4 mb-3">
            <TextField
              select
              label="Meeting Scheduled?"
              name="meeting_schedule"
              fullWidth
              value={form?.meeting_schedule ? "true" : "false"}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  meeting_schedule: e.target.value === "true",
                }))
              }
              size="small"
            >
              <MenuItem value={"false"}>No</MenuItem>
              <MenuItem value={"true"}>Yes</MenuItem>
            </TextField>
          </div>
          {form?.meeting_schedule && (
            <div className="col-md-4 mb-3">
              <TextField
                type="datetime-local"
                label="Meeting Schedule Date"
                name="meeting_schedule_date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={form?.meeting_schedule_date || ""}
                onChange={handleChange}
                required
                size="small"
              />
            </div>
          )}
          {!isEdit && (
            <div className="col-12 mt-2">
              <TextField
                label="Initial Note"
                name="initial_note"
                fullWidth
                multiline
                rows={3}
                value={form?.initial_note || ""}
                onChange={handleChange}
                placeholder="Add initial notes, customer's requirements, any important details..."
              />
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default LeadFormFields;
