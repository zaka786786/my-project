import React, { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import {
  handleCheckIsLocalHost,
  permission_string,
  STATUS,
} from "../../utils/constant";
import { useAdminContext } from "../../Hooks/AdminContext";
import { Button } from "@mui/material";
import Iconify from "../../components/Iconify";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { useSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import AddOrUpdateBusinessType from "./AddOrUpdateBusinessType";
import {
  _business_categories_list,
  _delete_business_categories,
} from "../../DAL/BusinessCategories/business_categories";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import TooltipShowing from "../../components/TooltipShowing";

const BusinessType = ({ screen_path }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const [searchText, setSearchText] = useState(
    sessionStorage.getItem("business-category-search") || "",
  );
  const [businessList, setbusinessList] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [pageCount, setPageCount] = useState(1);
  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  console.log("screen_path  __checkNavItemAccessReadOnlyOrAll", screen_path);
  console.log("accessType  __checkNavItemAccessReadOnlyOrAll", accessType);
  console.log("show  __checkNavItemAccessReadOnlyOrAll", show);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(0);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const TABLE_HEAD = [
    { id: "action", label: "ACTION", type: "action" },
    {
      id: "number",
      label: "#",
      type: "number",
      className: "typography-color-in-table",
    },
    {
      id: "title",
      label: "TITLE",
      className: "typography-color-in-table",
    },
    {
      id: "business_count",
      label: "BUSINESS COUNT",
      className: "typography-color-in-table",
      renderData: (row) => <span>{row.business_count ?? 0}</span>,
    },
    // {
    //   id: "order",
    //   label: "ORDER",
    //   className: "typography-color-in-table",
    // },
    {
      id: "status",
      label: "STATUS",
      renderData: (row) => {
        const find_status = STATUS.find(
          (status) => status.value === row.status,
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
    setDeleteData(row._id);
    setOpenDelete(true);
  };

  const handleOpenModal = () => {
    setModalState(true);
  };

  const handleDelete = async () => {
    const response = await _delete_business_categories(deleteData);

    if (response?.code === 200) {
      setbusinessList((prevList) =>
        prevList.filter((item) => item._id !== deleteData),
      );

      enqueueSnackbar(
        response?.message || "Business category deleted successfully",
        {
          variant: "success",
        },
      );
      setOpenDelete(false);
    } else {
      enqueueSnackbar(
        response?.message || "Failed to delete business category",
        {
          variant: "error",
        },
      );
      setOpenDelete(false);
    }
  };

  const handleClickNavAccess = (row) => {
    navigate(`/business-category/navAccess/business_type/${row?._id}`);
  };
  const handleClickBusinessSettings = (row) => {
    navigate(`/business-category/manage-business-settings/${row?._id}`);
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleClickEdit,
    },
    {
      label: "Manage Navitem Access",
      icon: "arcticons:agov-access",
      handleClick: handleClickNavAccess,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  const businessSetting = {
    label: "Manage Business Settings",
    icon: "uil:setting",
    handleClick: handleClickBusinessSettings,
  };
  if (handleCheckIsLocalHost()) {
    MENU_OPTIONS.splice(2, 0, businessSetting);
  }

  const get_business_list = async () => {
    sessionStorage.setItem("business-category-search", searchText);
    setIsLoading(true);
    const postData = {
      search: searchText,
    };
    try {
      const response = await _business_categories_list(postData);
      if (response.code === 200) {
        setTotalCount(response.total_count);
        setTotalPages(response.total_pages);
        setbusinessList(response.business_category_list || []);
      } else {
        enqueueSnackbar(response.message || "Failed to fetch data", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(
        "Something went wrong while fetching business categories.",
        { variant: "error" },
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setNavBarTitle("Business Categories");
    setIsBackButton(false);
    get_business_list();
  }, [rowsPerPage, page]);

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        isLoading={delLoading}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this business category?"}
        handleAgree={handleDelete}
      />

      <AddOrUpdateBusinessType
        modalState={modalState}
        setModalState={setModalState}
        rowData={rowData}
        get_business_list={get_business_list}
        setBusinessList={setbusinessList}
      />

      <div className="mt-2">
        <CustomTable
          data={businessList}
          TABLE_HEAD={TABLE_HEAD}
          MENU_OPTIONS={[]}
          pagePagination={true}
          custom_search={{
            searchText,
            setSearchText,
            handleSubmit: get_business_list,
          }}
          custom_pagination={{
            total_count: totalCount,
            rows_per_page: rowsPerPage,
            page: page,
            handleChangePage: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
          totalCount={totalCount}
          totalPages={totalPages}
          handleChangePages={handleChangePages}
          pageCount={pageCount}
          is_hide={true}
        />
      </div>
    </>
  );
};

export default BusinessType;
