import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { permission_string, show_proper_words } from "../../utils/constant";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import CustomTable from "../../components/customTable/CustomTable";
import {
  delete_category_api,
  help_video_categories_list_api,
} from "../../DAL/HelpVideos/Categories";
import CircularLoader from "../../components/loaders/CircularLoader";
import { Button, Pagination, TablePagination } from "@mui/material";
import { useAdminContext } from "../../Hooks/AdminContext";
import { imageBaseUrl } from "../../config/config";
import TooltipShowing from "../../components/TooltipShowing";

import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import HelpVideoCategoryGridCard from "./components/HelpVideoCategoryGridCard";
import EmptyDataState from "./components/Emptydatastate";

// ----------------------------------------------------------------------

export default function HelpVideoCategories({ type, screen_path }) {
  const [searchText, setSearchText] = useState(
    localStorage.getItem("business-customer-search") || "",
  );
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDoc, setDeleteDoc] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewMode, setViewMode] = useState("grid");

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

  const getCategoriesListing = async (search = "") => {
    setIsLoading(true);
    const payload = {
      search: search?.trim(),
      status: "",
    };
    delete payload.status;
    const result = await help_video_categories_list_api(
      payload,
      page,
      rowsPerPage,
    );
    if (result.code == 200) {
      const categories = result.category_list.map((category) => {
        return {
          ...category,
          table_avatar: {
            src: imageBaseUrl + category.image,
            alt: category.title,
          },
          category_status: category.status,
        };
      });
      setTotalPages(result.total_pages);
      setTotalCount(result.total_count);
      setCategoriesData(categories);
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
    setDeleteLoading(true);
    const result = await delete_category_api(deleteDoc._id);
    if (result.code === 200) {
      getCategoriesListing("");
      setCategoriesData((categoriesData) => {
        return categoriesData.filter((data) => data._id !== deleteDoc._id);
      });

      enqueueSnackbar(result.message, { variant: "success" });
      setDeleteLoading(false);
      setOpenDelete(false);
    } else {
      setDeleteLoading(false);
      enqueueSnackbar(result.message, { variant: "error" });
    }
  };

  const handleEdit = (value) => {
    navigate(`/help-video-categories/edit-category/${value._id}`, {
      state: value,
    });
  };
  const handleNavigate = () => {
    navigate(`/help-video-categories/add-category`);
  };
  const handleVideos = (value) => {
    navigate(`/help-video-categories/help-videos/${value._id}`, {
      state: value,
    });
  };

  const TABLE_HEAD = [
    { id: "action", label: "Action", alignRight: false, type: "action" },
    { id: "number", label: "#", alignRight: false, type: "number" },
    {
      id: "title",
      label: "Title",
      alignRight: false,
      handleClick: handleVideos,
      className: "cursor-pointer",
    },

    { id: "table_avatar", label: "Icon", alignRight: false, type: "thumbnail" },
    { id: "order", label: "Order", alignRight: false },
    {
      id: "category_status",
      label: "Status",
      type: "row_status",
    },
  ];
  if (type == "delegate") {
    TABLE_HEAD.splice(4, 0, {
      id: "groups",
      label: "Groups",
      renderData: (row) => {
        return (
          <>
            {row.groups && row.groups.length > 0
              ? row.groups.map((item, index) => {
                  return <div key={index}>{show_proper_words(item.title)}</div>;
                })
              : "N/A"}
          </>
        );
      },
    });
  }

  const get_business_list = () => {
    localStorage.setItem("help-video-search", searchText);
    getCategoriesListing(searchText);
  };

  const MENU_OPTIONS = [
    {
      label: "Edit",
      icon: "akar-icons:edit",
      handleClick: handleEdit,
    },
    {
      label: "Videos",
      icon: "bxs:videos",
      handleClick: handleVideos,
    },
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      handleClick: handleAgreeDelete,
      danger: true,
    },
  ];

  useEffect(() => {
    setNavBarTitle("Help Video Categories");
    setIsBackButton(false);
    const search = localStorage.getItem("help-video-search");
    setSearchText(search || "");
    getCategoriesListing(search || "");
  }, [rowsPerPage, page]);

  if (isLoading) {
    return <CircularLoader />;
  }
  return (
    <>
      <DeleteConfirmation
        open={openDelete}
        isLoading={deleteLoading}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this category?"}
        handleAgree={handleDelete}
      />

      <div className="container-fluid">
        <div className="row my-3">
          <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
            <TooltipShowing
              accessType={accessType}
              component={
                <Button
                  variant="contained"
                  disabled={show}
                  onClick={() => {
                    if (show) {
                      enqueueSnackbar(permission_string, {
                        variant: "error",
                      });
                      return;
                    }

                    handleNavigate();
                  }}
                >
                  Add Category
                </Button>
              }
            />

            <Button
              variant={"outlined"}
              onClick={() =>
                setViewMode(viewMode === "grid" ? "table" : "grid")
              }
            >
              {viewMode === "grid" ? <GridViewIcon /> : <TableRowsIcon />}
            </Button>

            {/* <Button
              variant={viewMode === "grid" ? "contained" : "outlined"}
              onClick={() => setViewMode("grid")}
            >
              <GridViewIcon />
            </Button>

            <Button
              variant={viewMode === "table" ? "contained" : "outlined"}
              onClick={() => setViewMode("table")}
            >
              <TableRowsIcon />
            </Button> */}
          </div>
        </div>

        {viewMode === "table" ? (
          <CustomTable
            TABLE_HEAD={TABLE_HEAD}
            data={categoriesData}
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
            custom_search={{
              searchText,
              setSearchText,
              handleSubmit: get_business_list,
            }}
            MENU_OPTIONS={show ? [] : MENU_OPTIONS}
            className="card-with-background"
            pagePagination={true}
          />
        ) : (
          <>
            {categoriesData.length === 0 ? (
              <EmptyDataState
                title="No categories found"
                description="No help video categories are available. Add one to get started."
              />
            ) : (
              <>
                <div className="row">
                  {categoriesData.map((value, index) => (
                    <div
                      key={index}
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4"
                      // className="col-lg-4 col-md-6 col-sm-12 mb-4"
                    >
                      <HelpVideoCategoryGridCard
                        // key={index}
                        value={value}
                        MENU_OPTIONS={show ? [] : MENU_OPTIONS}
                        imageBaseUrl={imageBaseUrl}
                        handleVideos={handleVideos}
                      />
                    </div>
                  ))}
                </div>
                {totalCount > rowsPerPage && (
                  <div className="d-flex justify-content-between align-items-center table-heading flex-wrap gap-2">
                    <TablePagination
                      rowsPerPageOptions={[10, 50, 100, 200, 500]}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      component="div"
                      className="custom_pagination_with_search m-0"
                      count={totalCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                    />

                    <Pagination
                      count={totalPages + 1}
                      page={pageCount}
                      defaultPage={0}
                      onChange={handleChangePages}
                      className="pagination-style"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
