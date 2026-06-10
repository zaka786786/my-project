import React, { useEffect, useState } from "react";
import CustomPopover from "../../components/CustomPopover";
import { useSnackbar } from "notistack";
import { _add_role, _update_role_by_id } from "../../DAL/Roles/roles";
import AddOrUpdateRoleForm from "./components/AddOrUpdateRoleForm";

const EMPTY = {
  name: "",
  description: "",
};

const AddOrUpdateRole = ({
  modalState,
  setModalState,
  rowData,
  refreshList,
  setRowData,
  rolesList,
  setRolesList,
  setTotalCount,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState(EMPTY);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      enqueueSnackbar("Role name is required", { variant: "error" });
      return;
    }

    setLoading(true);
    const payload = {
      name: form?.name,
      description: form?.description,
      status: isActive,
    };

    let res = rowData?._id
      ? await _update_role_by_id(payload, rowData?._id)
      : await _add_role(payload);

    if (res?.code === 200) {
      let responseData = res?.role;
      if (rowData?._id) {
        setRolesList((prevList) =>
          prevList.map((item) =>
            item._id === rowData._id ? { ...item, ...responseData } : item,
          ),
        );
      } else {
        setRolesList((prevList) => [responseData, ...prevList]);
        setTotalCount = (prev) => prev + 1;
      }

      enqueueSnackbar(res?.message, { variant: "success" });
      setModalState(false);
      setLoading(false);
    } else {
      enqueueSnackbar(res?.message, { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rowData) {
      setForm({
        name: rowData.name || "",
        description: rowData.description || "",
      });
      setIsActive(rowData.status);
    } else {
      setForm(EMPTY);
      setIsActive(true);
    }
  }, [rowData]);

  return (
    <CustomPopover
      isOpenPop={modalState}
      isClosePop={setModalState}
      title={rowData ? "Edit Role" : "Add Role"}
      submitButtonText="Submit"
      handleSubmit={handleSubmit}
      showStatus={true}
      isStatusActive={isActive}
      setIsStatusActive={setIsActive}
      submitButtonLoader={loading}
      setRowData={setRowData}
      componentToPassDown={
        <AddOrUpdateRoleForm form={form} handleChange={handleChange} />
      }
    />
  );
};

export default AddOrUpdateRole;
