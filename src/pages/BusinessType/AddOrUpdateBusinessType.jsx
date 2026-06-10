import { useState } from "react";
import { Navigate } from "react-router-dom";
import CustomPopover from "../../components/CustomPopover";
import AddOrUpdateComponent from "./components/AddOrUpdateComponent";
import { useSnackbar } from "notistack";
import  { _edit_business_categories, _add_business_categories }  from "../../DAL/BusinessCategories/business_categories";
import { useEffect } from "react";

const AddOrUpdateBusinessType = ({ modalState, setModalState, rowData, get_business_list, setBusinessList }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isStatusActive, setIsStatusActive] = useState(true);
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);

  const [formInputs, setFormInputs] = useState({
    title: "",
    type: "",
    description: "",
    owner_email: "",
    order: "",
  });

  const handleChange = (e) => {
    const { target } = e;
    setFormInputs({ ...formInputs, [target.name]: target.value });
  };

  const handleRefresh = () => {
    setIsStatusActive(true);
    setFormInputs({
      title: "",
      type: "",
      description: "",
      owner_email: "",
      order: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitButtonLoader(true);

    const post_data = {
      title: formInputs.title,
      description: formInputs.description,
      status: isStatusActive ? true : false,
    };

    let response;
    // Edit Business Type
    if (rowData?._id) {
      response = await _edit_business_categories(post_data, rowData._id);
      if (response?.code === 200) {
        setBusinessList((prevList) =>
          prevList.map((item) =>
            item._id === rowData._id ? { ...item, ...post_data } : item
          )
        );
      }
    } 
    // Add Business Type
    else {
      response = await _add_business_categories(post_data);
      if (response?.code === 200) {
        const newItem = { ...post_data, _id: response?.business_category?._id || Date.now() }; // fallback _id
        setBusinessList((prevList) => [newItem, ...prevList]);
      }
    }

    if (response?.code === 200) {
      setSubmitButtonLoader(false);
      setModalState(false);
      enqueueSnackbar(response.message || "Successful operation", {
        variant: "success",
      });
    } else {
      setSubmitButtonLoader(false);
      enqueueSnackbar(response.message || "Operation failed", {
        variant: "error",
      });
    }
  };

  

  useEffect(() => {
    if (rowData?._id) {
      setIsStatusActive(rowData?.status);
      setFormInputs({
        title: rowData?.title,
        type: rowData?.type,
        description: rowData?.description,
        owner_email: rowData?.owner_email,
        order: rowData?.order,
      });
    }
  }, [rowData?._id, modalState]);

  useEffect(() => {
    if (!modalState) {
      handleRefresh();
    }
  }, [modalState]);
  return (
    <>
      <CustomPopover
        isOpenPop={modalState}
        isClosePop={setModalState}
        title={rowData?._id ? "Edit Business Type" : "Add New Business Type"}
        submitButtonText={rowData?._id ? "Update" : "Submit"}
        showStatus={true}
        handleSubmit={handleSubmit}
        isStatusActive={isStatusActive}
        setIsStatusActive={setIsStatusActive}
        submitButtonLoader={submitButtonLoader}
        componentToPassDown={
          <AddOrUpdateComponent
            formInputs={formInputs}
            handleChange={handleChange}
            rowData={rowData?._id}
          />
        }
      />
    </>
  );
};

export default AddOrUpdateBusinessType;
