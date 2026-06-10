import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  delete_video_api,
  help_videos_list_api,
} from "../../../DAL/HelpVideos/HelpVideos";
import { imageBaseUrl } from "../../../config/config";
import CircularLoader from "../../../components/loaders/CircularLoader";
import ActiveLastBreadcrumb from "../../../components/BreadCrums";
import CustomTable from "../../../components/customTable/CustomTable";
import DeleteConfirmation from "../../../components/DeleteConfirmation";
import { Button } from "@mui/material";
import { useAdminContext } from "../../../Hooks/AdminContext";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import HelpVideoGridCard from "./HelpVideoGridCard";
import EmptyDataState from "../components/Emptydatastate";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "action", label: "Action", alignRight: false, type: "action" },
  { id: "number", label: "#", alignRight: false, type: "number" },
  { id: "title", label: "Title", alignRight: false },

  { id: "table_avatar", label: "Image", alignRight: false, type: "thumbnail" },
  { id: "order", label: "Order", alignRight: false },
  {
    id: "video_status",
    label: "Status",
    type: "row_status",
  },
];

export default function HelpVideoList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(3);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [videosData, setVideosData] = useState([]);
  const [data, setData] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [searchText, setSearchText] = useState(
    localStorage.getItem("video-list-search") || "",
  );
  const [viewMode, setViewMode] = useState("grid");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (newPage <= 0) {
      setPageCount(1);
    } else {
      setPageCount(newPage + 1);
    }
  };

  const handleChangePages = (event, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(1);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getVideosListing = async (search = "") => {
    setIsLoading(true);
    const payload = {
      search: search.trim() || "",
      // status: true,
      video_category_id: id,
      // video_type: "",
    };
    const result = await help_videos_list_api(payload, page, rowsPerPage);
    if (result.code == 200) {
      setData(result);
      const videos = result?.video_list?.map((video) => {
        return {
          ...video,
          category: video?.title,
          table_avatar: {
            src: imageBaseUrl + video?.image,
            alt: video.title,
          },
          video_status: video.status,
        };
      });
      setTotalCount(result?.total_count);
      setTotalPages(result?.total_pages);
      setVideosData(videos);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleAgreeDelete = (value) => {
    setDeleteDoc(value);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    const result = await delete_video_api(deleteDoc._id);
    if (result.code === 200) {
      getVideosListing("");
      setVideosData((videosData) => {
        return videosData.filter((data) => data._id !== deleteDoc._id);
      });
      enqueueSnackbar(result.message, { variant: "success" });
      setOpenDelete(false);
      setDelLoading(false);
    } else {
      setDelLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleEdit = (value) => {
    navigate(
      `/help-video-categories/update-help-videos/${id}/edit-video/${value._id}`,
      {
        state: value,
      },
    );
  };

  const handleDetail = (value) => {
    navigate(
      `/help-video-categories/update-help-videos/${id}/detail-video/${value._id}`,
      {
        state: value,
      },
    );
  };

  const handleNavigate = () => {
    navigate(
      `/help-video-categories/add-help-videos/${id}/add-video/${"video"}`,
      {},
    );
  };

  const get_business_list = () => {
    localStorage.setItem("video-list-search", searchText);
    getVideosListing(searchText);
  };

  useEffect(() => {
    setNavBarTitle("Help Video List");
    setIsBackButton(true);
    const savedSearchText = localStorage.getItem("video-list-search");
    setSearchText(savedSearchText || "");
    getVideosListing(savedSearchText || "");
  }, []);

  let breadCrumbMenu = [
    {
      title: "Help Video Categories",
      navigation: `/help-video-categories`,
      active: false,
    },
    {
      title: `Videos List (${data?.video_category?.title}) `,
      navigation: ``,
      active: true,
    },
  ];

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Detail",
      icon: "bx:detail",
      handleClick: handleDetail,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
    },
  ];
  useEffect(() => {
    get_business_list();
  }, [page, rowsPerPage]);

  if (isLoading) {
    return <CircularLoader />;
  }
  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        setOpen={setOpenDelete}
        isLoading={delLoading}
        title={"Are you sure you want to delete this video?"}
        handleAgree={handleDelete}
      />

      <div className="container-fluid">
        <div className="row my-3">
          <div className="col-lg-8 col-sm-12 d-flex align-items-center">
            <span>
              <ActiveLastBreadcrumb breadCrumbMenu={breadCrumbMenu} />
            </span>
          </div>
          <div className="col-lg-4 col-sm-12 text-end gap-2">
            <Button onClick={handleNavigate} variant="contained">
              Add Video
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                setViewMode(viewMode === "grid" ? "table" : "grid")
              }
              className="ms-2"
            >
              {viewMode === "grid" ? <GridViewIcon /> : <TableRowsIcon />}
            </Button>
          </div>
        </div>

        {viewMode === "table" ? (
          <CustomTable
            TABLE_HEAD={TABLE_HEAD}
            data={videosData}
            custom_search={{
              searchText,
              setSearchText,
              handleSubmit: get_business_list,
            }}
            custom_pagination={{
              total_count: totalCount,
              rows_per_page: rowsPerPage,
              page,
              handleChangePage,
              onRowsPerPageChange: handleChangeRowsPerPage,
            }}
            pageCount={pageCount}
            handleChangePages={handleChangePages}
            totalPages={totalPages}
            MENU_OPTIONS={MENU_OPTIONS}
            className="card-with-background"
            pagePagination={true}
          />
        ) : (
          <div className="row">
            {videosData.length === 0 ? (
              <EmptyDataState
                title="No Video found"
                description="No help video are available. Add one to get started."
              />
            ) : (
              <>
                {videosData.map((value, index) => (
                  <div key={index} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                    <HelpVideoGridCard
                      value={value}
                      MENU_OPTIONS={MENU_OPTIONS}
                      imageBaseUrl={imageBaseUrl}
                      handleEdit={handleEdit}
                      handleDelete={handleAgreeDelete}
                      handleVideos={handleDetail}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        {/* <CustomTable
          TABLE_HEAD={TABLE_HEAD}
          data={videosData}
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
          pageCount={pageCount}
          handleChangePages={handleChangePages}
          totalPages={totalPages}
          MENU_OPTIONS={MENU_OPTIONS}
          className="card-with-background"
          pagePagination={true}
        /> */}
      </div>
    </>
  );
}
