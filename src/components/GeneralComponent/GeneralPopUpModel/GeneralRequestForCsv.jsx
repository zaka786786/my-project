import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useState } from "react";
import { Csv_request_api } from "../../../DAL/GeneralApis/GeneralRequestCSV";
import { show_proper_words } from "../../../utils/constant_new";

const GeneralRequestForCsv = ({
  options_array,
  collection_name,
  filter_data,
  setShowExportcsvFile,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [option, setOptions] = useState([...options_array]);
  const [loading, setIsLoading] = useState(false);
  const [IsAllChecked, setIsAllChecked] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    isCSVOrPDF: "csv",
  });
  const handleCheckSelected = (index) => {
    if (index === "all") {
      const newOptions = option.map((opt, _) => {
        if (opt.is_disabled) {
          return { ...opt, is_checked: true };
        } else {
          return { ...opt, is_checked: !IsAllChecked };
        }
      });
      setOptions(newOptions);
      setIsAllChecked(!IsAllChecked);
    } else {
      const newOptions = option.map((opt, i) =>
        i === index ? { ...opt, is_checked: !opt.is_checked } : opt,
      );
      setOptions(newOptions);
    }
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (inputs.title.length === 0) {
      enqueueSnackbar(
        `${
          inputs.isCSVOrPDF === "csv" ? "CSV" : "PDF"
        } file name is not allowed to be empty`,
        {
          variant: "error",
        },
      );
    } else {
      const checkedOptions = option
        .filter((option) => option.is_checked)
        .map((option) => option.value);

      let postData = {
        csv_name: inputs.title,
        columns_to_export: checkedOptions,
        csv_query: filter_data,
        collection_name: collection_name,
        export_type: inputs.isCSVOrPDF,
      };

      const result = await Csv_request_api(postData);

      if (result.code === 200) {
        setOptions(false);
        setIsLoading(false);
        setShowExportcsvFile(false);
        setIsAllChecked(false);
        enqueueSnackbar(result.message, { variant: "success" });
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (option && option.length > 0) {
      let isAllChecked = option.every((item) => item.is_checked === true);
      setIsAllChecked(isAllChecked);
    }
  }, [option]);

  return (
    <>
      <div className="container-fluid csv-export-wrapper">
        <form onSubmit={handleSubmit} className="csv-export-form">
          <div className="csv-export-body">
            <div className="col-lg-12 col-md-12 col-sm-12 my-2">
              <FormControl>
                <h6>Select Export Type</h6>
                <RadioGroup
                  row
                  name="isCSVOrPDF"
                  value={inputs.isCSVOrPDF}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="csv"
                    control={<Radio size="small" />}
                    label="CSV"
                  />
                  <FormControlLabel
                    value="pdf"
                    control={<Radio size="small" />}
                    label="PDF"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Alert
                severity="warning"
                style={{
                  background: "var(--menu-active-gradient)",
                  color: "#3C668C",
                }}
              >
                Generated {inputs.isCSVOrPDF === "csv" ? "CSV" : "PDF"} result
                will be according to current applied filter
              </Alert>
            </div>{" "}
            <div className="col-lg-12 col-md-12 col-sm-12 mt-2">
              <TextField
                id="outlined-basic"
                label={
                  inputs.isCSVOrPDF === "csv"
                    ? "CSV file name"
                    : "PDF file name"
                }
                variant="outlined"
                fullWidth
                name="title"
                value={inputs.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
              <div
                className={`csv-card p-2 ps-0 cursor-pointer ${
                  IsAllChecked ? "csv-selected" : "csv-default"
                }`}
                onClick={() => handleCheckSelected("all")}
              >
                <div
                  className="d-flex align-items-center"
                  style={{ color: "#170F12", textTransform: "capitalize" }}
                >
                  <Checkbox checked={IsAllChecked} />
                  Selects All
                </div>
              </div>
            </div>
            {option &&
              option.map((item, index) => {
                return (
                  <>
                    <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                      <div
                        className={`csv-card p-2 ps-0 cursor-pointer ${
                          item.is_checked ? "csv-selected" : "csv-default"
                        }`}
                        onClick={() => {
                          if (!item.is_disabled) {
                            handleCheckSelected(index);
                          }
                        }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{
                            color: "#170F12",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.is_disabled ? (
                            <Tooltip title="This filter column is not editable">
                              <span>
                                <Checkbox checked={true} readOnly />
                              </span>
                            </Tooltip>
                          ) : (
                            <Checkbox checked={item.is_checked} />
                          )}
                          {show_proper_words(item.label)}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
          <div className="csv-export-footer">
            <button
              className="small-contained-button"
              disabled={loading}
              type="submit"
            >
              {loading ? "Please Wait..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GeneralRequestForCsv;
