import { useEffect, useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import Iconify from "../../components/Iconify";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import CircularLoader from "../../components/loaders/CircularLoader";
import { useAdminContext } from "../../Hooks/AdminContext";
import AddOrUpdateLeadStatus from "./AddOrUpdateLeadStatus";
import { STATUS } from "../../utils/constant_new";
import {
  _delete_lead_status_by_id,
  _list_lead_status,
} from "../../DAL/LeadStatus/lead_status";
import TooltipShowing from "../../components/TooltipShowing";
import { permission_string } from "../../utils/constant";

const LeadStatusList = ({ screen_path }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";

  const getContrastBg = (hexColor) => {
    if (!hexColor) return "#eee";

    const color = hexColor.replace("#", "");

    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 155 ? "#888" : "#f5f5f5";
  };

  const TABLE_HEAD = [
    { id: "action", label: "Action", type: "action" },
    {
      id: "order",
      label: "Order",
      renderData: (row) => <span>{row.order}</span>,
    },

    {
      id: "title",
      label: "Title",
      renderData: (row) => <span>{row.title}</span>,
    },

    {
      id: "text_color",
      label: "Text Color",
      renderData: (row) => (
        <span
          style={{
            color: row.text_color,
            background: getContrastBg(row.text_color),
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          {row.text_color}
        </span>
      ),
    },

    {
      id: "background_color",
      label: "Background Color",
      renderData: (row) => (
        <span
          style={{
            background: row.background_color,
            color: getContrastBg(row.background_color),
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          {row.background_color}
        </span>
      ),
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
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: (row) => {
        setDeleteData(row);
        setOpenDelete(true);
      },
    },
  ];

  const fetchList = async () => {
    setIsLoading(true);
    let postData = {
      search: searchText,
    };

    setIsLoading(true);
    const response = await _list_lead_status(page, rowsPerPage, postData);

    if (response?.code === 200) {
      setList(response?.lead_status_list || []);
      setTotalCount(response?.total_count || 0);
      setIsLoading(false);
    } else {
      enqueueSnackbar(response?.message || "Failed to fetch data", {
        variant: "error",
      });
      setList([]);
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    const response = await _delete_lead_status_by_id(deleteData?._id);
    if (response?.code === 200) {
      enqueueSnackbar(response?.message || "Admin user deleted successfully", {
        variant: "success",
      });
      setList((prev) => prev.filter((i) => i._id !== deleteData._id));
    } else {
      enqueueSnackbar(response?.message || "Failed to delete Admin user", {
        variant: "error",
      });
    }
    setOpenDelete(false);
    setDelLoading(false);
  };

  useEffect(() => {
    setNavBarTitle("Lead Status");
    setIsBackButton(false);
    fetchList();
  }, [page, rowsPerPage]);

  if (isLoading) return <CircularLoader />;

  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        isLoading={delLoading}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this lead status?"}
        handleAgree={handleDelete}
      />

      <AddOrUpdateLeadStatus
        modalState={modalState}
        setModalState={setModalState}
        rowData={rowData}
        setRowData={setRowData}
        list={list}
        setList={setList}
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
              Add Lead Status
            </Button>
          }
        />
      </div>

      <CustomTable
        data={list}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={MENU_OPTIONS}
        pagePagination
        custom_search={{ searchText, setSearchText, handleSubmit: fetchList }}
        custom_pagination={{
          total_count: totalCount,
          rows_per_page: rowsPerPage,
          page,
          handleChangePage: (_, p) => setPage(p),
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value),
        }}
      />
    </>
  );
};

export default LeadStatusList;
