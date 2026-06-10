import { useState } from "react";
import CustomPopover from "../../components/CustomPopover";
import { useEffect } from "react";
import AddOrUpdateComponent from "./components/AddOrUpdateComponent";

const AddOrUpdateSales = ({ modalState, setModalState, rowData }) => {
  const [isStatusActive, setIsStatusActive] = useState(true);
  const [submitButtonLoader, setSubmitButtonLoader] = useState(false);

  const [formInputs, setFormInputs] = useState({
    name: "",
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
      customerName: "",
      paymentMethod: "",
      itemCount: "",
      totalQty: "",
      //
      name: "",
      type: "",
      description: "",
      owner_email: "",
      order: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (rowData?._id) {
      setIsStatusActive(rowData?.status);
      setFormInputs({ ...formInputs, ...rowData });
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
        title={rowData?._id ? "Edit Sale" : "Add New Sale"}
        submitButtonText={rowData?._id ? "Update" : "Submit"}
        showStatus={false}
        handleSubmit={handleSubmit}
        isStatusActive={isStatusActive}
        setIsStatusActive={setIsStatusActive}
        submitButtonLoader={submitButtonLoader}
        componentToPassDown={
          <>
            <AddOrUpdateComponent
              formInputs={formInputs}
              handleChange={handleChange}
              rowData={rowData?._id}
            />
          </>
        }
      />
    </>
  );
};

export default AddOrUpdateSales;
