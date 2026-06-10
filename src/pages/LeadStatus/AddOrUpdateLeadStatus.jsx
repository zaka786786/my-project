import React, { useEffect, useState } from "react";
import CustomPopover from "../../components/CustomPopover";
import { useSnackbar } from "notistack";
import AddOrUpdateLeadStatusForm from "./components/AddOrUpdateLeadStatusForm";
import {
  _add_lead_status,
  _update_lead_status_by_id,
} from "../../DAL/LeadStatus/lead_status";

const EMPTY = {
  title: "",
  description: "",
  text_color: "",
  background_color: "",
  order: "",
};

const AddOrUpdateLeadStatus = ({
  modalState,
  setModalState,
  rowData,
  setRowData,
  list,
  setList,
  setTotalCount,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(EMPTY);
  const [isActive, setIsActive] = useState(true);
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      enqueueSnackbar("Title required", { variant: "error" });
      return;
    }

    const postData = {
      title: form?.title,
      description: form?.description,
      text_color: form?.text_color || "#000000",
      background_color: form?.background_color || "#ffffff",
      status: isActive,
    };

    if (rowData?._id) {
      postData.order = form?.order;
    }

    setSubmitButtonLoader(true);

    let response = rowData?._id
      ? await _update_lead_status_by_id(postData, rowData?._id)
      : await _add_lead_status(postData);

    if (response?.code === 200) {
      let responseObject = response?.lead_status || {};

      if (rowData?._id) {
        setList((prev) =>
          prev.map((i) =>
            i._id === rowData._id ? { ...i, ...responseObject } : i,
          ),
        );
      } else {
        setList((prev) => [...prev, responseObject]);
        setTotalCount((prev) => prev + 1);
      }
      setModalState(false);
      enqueueSnackbar(response?.message || "Success", { variant: "success" });
    } else {
      enqueueSnackbar(response?.message || "Failed", { variant: "error" });
    }
    setSubmitButtonLoader(false);
  };

  useEffect(() => {
    if (rowData) {
      setForm({
        ...rowData,
      });
      setIsActive(rowData?.status);
    } else {
      setForm(EMPTY);
      setIsActive(true);
    }
  }, [rowData]);

  return (
    <CustomPopover
      isOpenPop={modalState}
      isClosePop={setModalState}
      title={rowData ? "Edit Lead Status" : "Add Lead Status"}
      submitButtonText="Submit"
      handleSubmit={handleSubmit}
      showStatus
      isStatusActive={isActive}
      setIsStatusActive={setIsActive}
      setRowData={setRowData}
      submitButtonLoader={submitButtonLoader}
      componentToPassDown={
        <AddOrUpdateLeadStatusForm
          form={form}
          handleChange={handleChange}
          rowData={rowData}
        />
      }
    />
  );
};

export default AddOrUpdateLeadStatus;
