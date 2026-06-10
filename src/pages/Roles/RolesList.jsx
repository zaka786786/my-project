import { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import Iconify from "../../components/Iconify";
import { _delete_role, _roles_list } from "../../DAL/Roles/roles";
import AddOrUpdateRole from "./AddOrUpdateRole";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import CircularLoader from "../../components/loaders/CircularLoader";
import { STATUS } from "../../utils/constant_new";
import { useAdminContext } from "../../Hooks/AdminContext";
import { permission_string } from "../../utils/constant";
import TooltipShowing from "../../components/TooltipShowing";
import { useNavigate } from "react-router-dom";

const RolesList = ({ screen_path }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const [rolesList, setRolesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  const handleClickChangeNavAccess = (row) => {
    navigate(`/roles/navAccess/admin/${row?._id}`);
  };

  const TABLE_HEAD = [
    { id: "action", label: "Action", type: "action" },
    { id: "number", label: "#", type: "number" },
    {
      id: "name",
      label: "Role Name",
      renderData: (row) => <span>{row?.name}</span>,
    },
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

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: (row) => {
        setRowData(row);
        setModalState(true);
      },
    },
    {
      label: "Manage Nav Access",
      icon: "qlementine-icons:password-16",
      handleClick: handleClickChangeNavAccess,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: (row) => {
        setDeleteData(row);
        setOpenDelete(true);
      },
    },
  ];

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
    if (newPage <= 0) {
      setPage(0);
      setPageCount(0);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const fetchRoles = async () => {
    setIsLoading(true);
    const res = await _roles_list(page, rowsPerPage, {
      search: searchText,
    });

    if (res?.code === 200) {
      setRolesList(res?.roles || []);
      setTotalCount(res?.total_count || 0);
      setPageCount(res?.total_count || 0);
      setTotalPages(res?.total_pages);
      setIsLoading(false);
    } else {
      enqueueSnackbar(res?.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRoles();
  };
  const handleDelete = async () => {
    const res = await _delete_role(deleteData?._id);

    if (res?.code === 200) {
      enqueueSnackbar(res?.message, { variant: "success" });

      setRolesList((prevList) =>
        prevList.filter((item) => item._id !== deleteData?._id),
      );
      setTotalCount = (prev) => prev - 1;
    } else {
      enqueueSnackbar(res?.message, { variant: "error" });
    }

    setOpenDelete(false);
  };

  useEffect(() => {
    setNavBarTitle("Roles");
    setIsBackButton(false);
    fetchRoles();
  }, [page, rowsPerPage]);

  if (isLoading) return <CircularLoader />;

  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        handleAgree={handleDelete}
        title="Are you sure you want to delete this Role?"
      />

      <AddOrUpdateRole
        modalState={modalState}
        setModalState={setModalState}
        rowData={rowData}
        refreshList={fetchRoles}
        setRowData={setRowData}
        rolesList={rolesList}
        setRolesList={setRolesList}
        setTotalCount={setTotalCount}
      />

      <div className="d-flex justify-content-end mb-3 mt-2">
        <TooltipShowing
          accessType={accessType}
          component={
            <Button
              disabled={show}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                if (show) {
                  enqueueSnackbar(permission_string, {
                    variant: "error",
                  });
                  return;
                }
                setRowData(null);
                setModalState(true);
              }}
            >
              Add Role
            </Button>
          }
        />
      </div>

      <CustomTable
        data={rolesList}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={show ? [] : MENU_OPTIONS}
        pagePagination={true}
        custom_search={{
          searchText,
          setSearchText,
          handleSubmit: handleSearch,
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
    </>
  );
};

export default RolesList;
