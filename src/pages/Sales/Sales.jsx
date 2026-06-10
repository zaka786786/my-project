import React, { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import { PAYMENTSTATUS, STATUS } from "../../utils/constant";
import { useAdminContext } from "../../Hooks/AdminContext";
import { Button } from "@mui/material";
import Iconify from "../../components/Iconify";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { useSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import AddOrUpdateSales from "./AddOrUpdateSales";

const Sales = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const [saleList, setSaleList] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const TABLE_HEAD = [
    // { id: "action", label: "ACTION", type: "action" },
    { id: "number", label: "#", type: "number" },
    { id: "invoiceNumber", label: "INVOICE NO" },
    { id: "date", label: "DATE & TIME" },
    { id: "customerName", label: "BUSINESS CUSTOMER" },
    { id: "businessType", label: "BUSINESS TYPE" },
    { id: "paymentMethod", label: "PAYMENT METHOD" },
    { id: "salesperson", label: "SALESPERSON" },
    { id: "itemCount", label: "ITEMS" },
    { id: "totalQty", label: "QTY" },
    { id: "subtotal", label: "SUBTOTAL" },
    { id: "discount", label: "DISCOUNT" },
    { id: "tax", label: "TAX" },
    { id: "total", label: "TOTAL" },
    {
      id: "paymentStatus",
      label: "PAYMENT STATUS",

      renderData: (row) => {
        const find_status = PAYMENTSTATUS.find(
          (status) => status.value === row.paymentStatus,
        );
        return (
          <span className={`${find_status?.class}`}>{find_status?.name}</span>
        );
      },
    },
  ];

  const handleClickEdit = (row) => {
    setModalState(true);
    setRowData(row);
  };

  const handleAgreeDelete = (row) => {
    setDeleteData(row);
    setOpenDelete(true);
  };

  const handleOpenModal = () => {
    setModalState(true);
  };

  const handleDelete = async () => {};

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleClickEdit,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];
  const get_sale_list = async (filterData) => {
    const data = [
      {
        _id: "1",
        invoiceNumber: "INV-1001",
        date: "13-05-2025 02:30 PM",
        customerName: "Ali Traders",
        businessType: "Electronics",
        itemCount: 3,
        totalQty: 7,
        subtotal: "£2000",
        discount: "£200",
        tax: "£180",
        total: "£1980",
        paymentStatus: "Paid",
        paymentMethod: "Credit Card",
        salesperson: "Usman",
      },
      {
        _id: "2",
        invoiceNumber: "INV-1002",
        date: "13-05-2025 03:00 PM",
        customerName: "Al Madina Mart",
        businessType: "General Store",
        itemCount: 5,
        totalQty: 12,
        subtotal: "£4500",
        discount: "£0",
        tax: "£405",
        total: "£4905",
        paymentStatus: "Due",
        paymentMethod: "Cash",
        salesperson: "Ahmed",
      },
      {
        _id: "3",
        invoiceNumber: "INV-1003",
        date: "12-05-2025 06:42 PM",
        customerName: "BuildPro Supplies",
        businessType: "Construction",
        itemCount: 2,
        totalQty: 5,
        subtotal: "£3000",
        discount: "£300",
        tax: "£243",
        total: "£2943",
        paymentStatus: "Unpaid",
        paymentMethod: "Credit Card",
        salesperson: "Raza",
      },
    ];

    setSaleList(data);
  };

  useEffect(() => {
    get_sale_list();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setNavBarTitle("Sales");
    setIsBackButton(false);
  }, []);

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        isLoading={delLoading}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this sale?"}
        handleAgree={handleDelete}
      />

      <AddOrUpdateSales
        modalState={modalState}
        setModalState={setModalState}
        rowData={rowData}
        setDataList={setSaleList}
        get_data_list={get_sale_list}
      />

      <div className="mt-2">
        {/* <div className="d-flex   justify-content-end mb-3 add-button">
          <Button
            variant="contained"
            startIcon={
              <Iconify
                className="button-Iconify-in-listing"
                icon="eva:plus-fill"
              />
            }
            onClick={() => {
              setRowData(null);
              handleOpenModal();
            }}
            className="capitalized button-in-listing"
          >
            Add Sale
          </Button>
        </div> */}

        <CustomTable
          data={saleList}
          TABLE_HEAD={TABLE_HEAD}
          MENU_OPTIONS={MENU_OPTIONS}
          pagePagination={true}
        />
      </div>
    </>
  );
};

export default Sales;
