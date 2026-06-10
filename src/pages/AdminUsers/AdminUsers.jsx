import { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import { permission_string, STATUS } from "../../utils/constant";
import moment from "moment";
import { useAdminContext } from "../../Hooks/AdminContext";
import { Button, Chip } from "@mui/material";
import Iconify from "../../components/Iconify";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { useSnackbar } from "notistack";
import CircularLoader from "../../components/loaders/CircularLoader";
import AddOrUpdateAdminUsers from "./AddOrUpdateAdminUsers";
import CustomImageAvatar from "../../components/CustomImageAvatar";
import ChangePassword from "./components/ChangePassword";
import { useNavigate } from "react-router-dom";
import {
  _admin_list,
  _delete_admin_user,
} from "../../DAL/AdminUsers/admin_users";
import { imageBaseUrl } from "../../config/config";
import TooltipShowing from "../../components/TooltipShowing";

const AdminUsers = ({ screen_path = "" }) => {
  const [searchText, setSearchText] = useState(
    sessionStorage.getItem("admin-user-search") || "",
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const [adminList, setadminList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [modalStateChangePassword, setModalStateChangePassword] =
    useState(false);
  const [rowData, setRowData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePages = (event, newPage) => {
    console.log("handleChangePages", newPage, page, rowsPerPage);

    if (newPage <= 0) {
      setPage(0);
      setPageCount(0);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const TABLE_HEAD = [
    { id: "action", label: "Action", type: "action" },
    { id: "number", label: "#", type: "number" },
    {
      id: "logo",
      label: "Business Customer",
      className: "typography-color-in-table",
      renderData: (row) => {
        return (
          <div className="d-flex align-items-center mb-0">
            <CustomImageAvatar
              imageUrl={imageBaseUrl + row.profile_image}
              altText={row?.full_name}
              // size={70}
              name={row?.full_name}
            />
            <div className="ms-2 ">
              <p className="mb-0 fw-bold">
                {row?.full_name.charAt(0).toUpperCase() +
                  row?.full_name.slice(1)}
              </p>
              <p className="mb-0 email-in-table">{row?.user_id?.email}</p>
              <p className="mb-0 email-in-table">{row?.phone_number}</p>
            </div>
          </div>
        );
      },
    },

    {
      id: "role",
      label: "Role",
      className: "typography-color-in-table",
      renderData: (row) => <span>{row?.role?.name || "N/A"}</span>,
    },
    // {
    //   id: "address",
    //   label: "Address",
    //   className: "typography-color-in-table",
    //   renderData: (row) => (
    //     <span
    //       style={{
    //         maxWidth: "300px",
    //         whiteSpace: "normal", // allow wrapping
    //         wordBreak: "break-word",
    //       }}
    //       className="d-inline-block flex-wrap capitalized"
    //     >
    //       {row.address}
    //     </span>
    //   ),
    // },

    {
      id: "",
      label: "Two Factor Authentication",
      renderData: (row) => {
        const isTwoFactorEnabled = row?.user_id?.two_factor_auth;
        const chipLabel = isTwoFactorEnabled ? "Activated" : "Deactivated";
        const chipColor = isTwoFactorEnabled ? "success" : "error";

        return (
          <Chip
            label={chipLabel}
            color={chipColor}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      id: "createdAt",
      label: "Created At",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="capitalized">
          {moment(row.createdAt).format("DD MMMM YYYY")}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
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

  const handleClickChangePassword = (row) => {
    setModalStateChangePassword(true);
    setRowData(row);
  };
  const handleClickPayments = (row) => {
    navigate(`/business-customer/payments/${row?._id}`);
  };
  const handleClickEdit = (row) => {
    navigate(`/admin-users/edit-users/${row?.user_id?._id}`);
    // setModalState(true);
    // setRowData(row);
  };

  const handleOpenModal = () => {
    navigate(`/admin-users/add-users`);
    // setModalState(true);
  };

  const handleAgreeDelete = (row) => {
    setDeleteData(row);
    setOpenDelete(true);
  };

  const handleCLoseModal = () => {
    setModalState(false);
    setRowData(null);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    const response = await _delete_admin_user(deleteData?.user_id._id);
    if (response?.code === 200) {
      enqueueSnackbar(response?.message || "Admin user deleted successfully", {
        variant: "success",
      });
      setOpenDelete(false);
      get_adminusers_list();
    } else {
      enqueueSnackbar(response?.message || "Failed to delete Admin user", {
        variant: "error",
      });
      setOpenDelete(false);
    }
    setDelLoading(false);
  };

  const handleClickChangeNavAccess = (row) => {
    navigate(`/admin-users/navAccess/admin/${row?.user_id._id}`);
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleClickEdit,
    },
    {
      label: "Change Password",
      icon: "qlementine-icons:password-16",
      handleClick: handleClickChangePassword,
    },

    {
      label: "Manage Nav Access",
      icon: "qlementine-icons:password-16",
      handleClick: handleClickChangeNavAccess,
    },
    // {
    //   label: "Settings",
    //   icon: "qlementine-icons:password-16",
    //   handleClick: handleClickSettings,
    // },
    // {
    //   label: "Payments",
    //   icon: "tdesign:undertake-transaction",
    //   handleClick: handleClickPayments,
    // },

    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];
  const fetch_adminusers_list = async (search = "") => {
    setIsLoading(true);
    const response = await _admin_list(search, page, rowsPerPage);
    const new_list = [];

    if (response?.code === 200 && Array.isArray(response.admin_list)) {
      response.admin_list.forEach((item) => {
        const newItem = {
          ...item,
          full_name: item.first_name + " " + item.last_name,
          email: item.email || "",
          user_name: item.user_id?.user_name || "",
          admin_id: item.user_id?._id || "",
          phone_number: item.phone_number || "",
        };
        new_list.push(newItem);
      });

      setadminList(new_list);
      setTotalCount(response?.total_count || 0);

      setTotalCount(response?.total_count);
      setIsLoading(false);
      setPageCount(response?.page_count);
      setTotalPages(response?.total_pages);
    } else {
      enqueueSnackbar(response?.message || "Failed to fetch data", {
        variant: "error",
      });
      setadminList([]);
    }

    setIsLoading(false);
  };

  const get_adminusers_list = () => {
    sessionStorage.setItem("admin-user-search", searchText);
    fetch_adminusers_list(searchText);
  };

  useEffect(() => {
    setNavBarTitle("Admin Users");
    get_adminusers_list();
    setIsBackButton(false);
  }, [page, rowsPerPage]);

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        isLoading={delLoading}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this Admin User?"}
        handleAgree={handleDelete}
      />

      {/* <AddOrUpdateAdminUsers
        setRowData={setRowData}
        modalState={modalState}
        setModalState={handleCLoseModal}
        rowData={rowData}
        setadminList={setadminList}
        setTotalCount={setTotalCount}
        get_adminusers_list={get_adminusers_list}
      /> */}

      <ChangePassword
        modalState={modalStateChangePassword}
        setModalState={setModalStateChangePassword}
        rowData={rowData}
      />

      <div className="mt-2">
        <div className="d-flex justify-content-end mb-3 add-button">
          <TooltipShowing
            accessType={accessType}
            component={
              <Button
                disabled={show}
                variant="contained"
                startIcon={
                  <Iconify
                    className="button-Iconify-in-listing"
                    icon="eva:plus-fill"
                  />
                }
                onClick={() => {
                  if (show) {
                    enqueueSnackbar(permission_string, {
                      variant: "error",
                    });
                    return;
                  }
                  setRowData(null);
                  handleOpenModal();
                }}
                className="capitalized button-in-listing"
              >
                Add New Admin User
              </Button>
            }
          />
        </div>

        <CustomTable
          data={adminList}
          TABLE_HEAD={TABLE_HEAD}
          MENU_OPTIONS={show ? [] : MENU_OPTIONS}
          pagePagination={true}
          custom_search={{
            searchText,
            setSearchText,
            handleSubmit: get_adminusers_list,
          }}
          custom_pagination={{
            total_count: totalCount,
            rows_per_page: rowsPerPage,
            page: page,
            handleChangePage: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          }}
          pageCount={pageCount}
          totalPages={totalPages}
          handleChangePages={handleChangePages}
          is_hide={true}
        />
      </div>
    </>
  );
};

export default AdminUsers;
