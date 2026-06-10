import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/customTable/CustomTable";
import { STATUS } from "../../../utils/constant";
import { useAdminContext } from "../../../Hooks/AdminContext";
import { Button } from "@mui/material";
import Iconify from "../../../components/Iconify";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import { useSnackbar } from "notistack";
import CircularLoader from "../../../components/loaders/CircularLoader";
import AddOrUpdateVideo from "./HelpVideoList";
import ViewVideo from "./components/ViewVideo";
import { useParams, useNavigate } from "react-router-dom";
import BasicBreadcrumbs from "../../../components/BasicBreadcrumbs";

const Videos = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const [searchText, setSearchText] = useState(
    sessionStorage.getItem("videos-search") || "",
  );
  const [videosList, setVideosList] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [viewModalState, setViewModalState] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [viewVideoData, setViewVideoData] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteData, setDeleteData] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [pageCount, setPageCount] = useState(1);

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
      id: "description",
      label: "DESCRIPTION",
      className: "typography-color-in-table",
    },
    {
      id: "duration",
      label: "DURATION",
      className: "typography-color-in-table",
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
    // For demo purposes, we'll just remove from local state
    setVideosList((prevList) =>
      prevList.filter((item) => item._id !== deleteData),
    );

    enqueueSnackbar("Video deleted successfully", {
      variant: "success",
    });
    setOpenDelete(false);
  };

  const handleClickViewVideo = (row) => {
    // View video functionality
    setViewVideoData(row);
    setViewModalState(true);
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleClickEdit,
    },
    {
      label: "View",
      icon: "mdi:eye",
      handleClick: handleClickViewVideo,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];

  // Demo data for now
  const get_videos_list = async () => {
    sessionStorage.setItem("videos-search", searchText);
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const demoData = [
        {
          _id: "1",
          title: "Getting Started - Part 1",
          description: "Introduction to the platform",
          duration: "5:30",
          status: true,
        },
        {
          _id: "2",
          title: "Getting Started - Part 2",
          description: "Navigating the dashboard",
          duration: "8:15",
          status: true,
        },
        {
          _id: "3",
          title: "Account Setup",
          description: "Setting up your account",
          duration: "12:45",
          status: true,
        },
      ];

      setVideosList(demoData);
      setTotalCount(demoData.length);
      setTotalPages(1);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    setNavBarTitle(`Help Tech Videos - Category ${categoryId}`);
    setIsBackButton(true);
    get_videos_list();
  }, [rowsPerPage, page, categoryId]);

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        isLoading={delLoading}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this video?"}
        handleAgree={handleDelete}
      />

      <AddOrUpdateVideo
        modalState={modalState}
        setModalState={setModalState}
        rowData={rowData}
        setVideosList={setVideosList}
      />

      <ViewVideo
        open={viewModalState}
        onClose={() => setViewModalState(false)}
        video={viewVideoData}
      />

      <div className="mt-2">
        <BasicBreadcrumbs
          items={[
            {
              title: "Help Tech",
              navigation: "/help-tech",
              status: "Inactive",
            },
            {
              title: `Category ${categoryId} Videos`,
              navigation: "",
              status: "Active",
            },
          ]}
        />
        <div className="d-flex justify-content-end mb-3 add-button">
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
            Add New Video
          </Button>
        </div>

        <CustomTable
          data={videosList}
          TABLE_HEAD={TABLE_HEAD}
          MENU_OPTIONS={MENU_OPTIONS}
          pagePagination={true}
          custom_search={{
            searchText,
            setSearchText,
            handleSubmit: get_videos_list,
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

export default Videos;
