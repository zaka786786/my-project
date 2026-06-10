import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import CustomTable from "../../components/customTable/CustomTable";
import { useAdminContext } from "../../Hooks/AdminContext";
import {
  actionInfoObject,
  CustomDateFormatter,
  permission_string,
  show_proper_words,
} from "../../utils/constant";
import { imageBaseUrl } from "../../config/config";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import CircularLoader from "../../components/loaders/CircularLoader";
import CustomStatusChip from "../../components/CustomStatusChip";
import {
  delete_csv_file_api,
  Requested_csv_files_api,
} from "../../DAL/GeneralApis/GeneralRequestCSV";

const RequestedCsvFiles = ({ screen_path }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [deleteData, setDeleteData] = useState("");
  const {
    setNavBarTitle,
    checkNavItemAccessReadOnlyOrAll = () => {},
    setIsBackButton,
  } = useAdminContext();
  const accessType = checkNavItemAccessReadOnlyOrAll(
    screen_path,
    "direct_screen",
  );
  const show = accessType === "disabled";
  const [csvList, setCsvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const getCsvFiles = async (searchText, page, rowsPerPage) => {
    setIsLoading(true);
    const payload = {
      search: searchText?.trim(),
    };
    const result = await Requested_csv_files_api(payload, page, rowsPerPage);
    if (result.code === 200) {
      const ListData = result?.data?.export_csv_list?.map((items) => {
        return {
          ...items,
          request_initiated_date: items.request_initiated_date
            ? CustomDateFormatter(items.request_initiated_date)
            : "_ _",
          request_completed_date: items.request_completed_date
            ? CustomDateFormatter(items.request_completed_date)
            : "_ _",
          status: items.status,
          collection_name: show_proper_words(items.collection_name),
        };
      });
      setCsvList(ListData);
      setTotalCount(result?.data?.total_count);
      setTotalPages(result?.data?.total_pages);
      setIsLoading(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setIsLoading(false);
    }
  };

  const handleDownloadClick = (path) => {
    if (path) {
      window.open(`${imageBaseUrl}${path}`, "_blank");
    }
  };

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

  const CSV_TABLE_HEAD = [
    { action: "action", label: "Action", type: "action" },
    { id: "number", label: "#", type: "number" },
    {
      id: "csv_name",
      label: "File Name",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="capitalized">{row.csv_name || "_ _"}</span>
      ),
    },
    {
      id: "collection_name",
      label: "Collection Name",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="capitalized">{row.collection_name || "_ _"}</span>
      ),
    },
    // {
    //   id: "request_initiated_date",
    //   label: "CSV Export Initiated (Date)",
    //   className: "typography-color-in-table",
    //   renderData: (row) => (
    //     <span className="capitalized">
    //       {row.request_initiated_date || "_ _"}
    //     </span>
    //   ),
    // },
    {
      id: "request_completed_date",
      label: "Export Finished (Date)",
      className: "typography-color-in-table",
      renderData: (row) => (
        <span className="capitalized">
          {row.request_completed_date || "_ _"}
        </span>
      ),
    },
    {
      id: "download_url",
      label: "Download URL",
      className: "typography-color-in-table",
      renderData: (row) => {
        return (
          <>
            {row.csv_download_url ? (
              <Tooltip
                title={show ? permission_string : "Click here to Download file"}
              >
                <span
                  onClick={() => {
                    if (show) {
                      enqueueSnackbar(permission_string, {
                        variant: "error",
                      });
                      return;
                    }
                    handleDownloadClick(row.csv_download_url);
                  }}
                  aria-disabled={show}
                  style={{
                    cursor: show ? "not-allowed" : "pointer",
                    textDecoration: "underline",
                    color: "#3C668C",
                    fontSize: "14px",
                  }}
                >
                  Click To Download
                </span>
              </Tooltip>
            ) : (
              <Tooltip
                title={`Please wait, Your CSV request is currently ${row.request_status}`}
              >
                <span
                  style={{
                    cursor: "not-allowed",
                    textDecoration: "underline",
                    color: "#3C668C",
                    fontSize: "14px",
                  }}
                >
                  Click To Download
                </span>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      className: "typography-color-in-table",
      renderData: (row) => {
        let ChipLabel;

        switch (row.request_status) {
          case "pending":
            ChipLabel = "Pending";
            break;
          case "completed":
            ChipLabel = "Completed";
            break;
          default:
            ChipLabel = "Pending";
            break;
        }

        return <CustomStatusChip status={ChipLabel} />;
      },
    },
  ];

  if (true) {
    CSV_TABLE_HEAD.splice(CSV_TABLE_HEAD.length - 1, 0, actionInfoObject);
  }

  const handleAgreeDelete = (row) => {
    setDeleteData(row);
    setOpenDelete(true);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    const result = await delete_csv_file_api(deleteData._id);
    if (result.code === 200) {
      enqueueSnackbar(result.message, { variant: "success" });
      const newList = csvList.filter((item) => item._id !== deleteData._id);
      setCsvList(newList);
      setDelLoading(false);
      setOpenDelete(false);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
      setDelLoading(false);
    }
  };

  const MENU_OPTIONS = [
    {
      label: "Delete",
      icon: "ant-design:delete-twotone",
      color: "red",
      handleClick: handleAgreeDelete,
    },
  ];

  const handleSearch = () => {
    setPage(0);
    localStorage.setItem("searchText_RequestedCSVFiles", searchText);
    getCsvFiles(searchText, page, rowsPerPage);
  };

  useEffect(() => {
    const savedSearchText = localStorage.getItem(
      "searchText_RequestedCSVFiles",
    );
    if (savedSearchText) {
      setSearchText(savedSearchText);
      getCsvFiles(savedSearchText, page, rowsPerPage);
    } else {
      getCsvFiles("", page, rowsPerPage);
      setSearchText("");
    }
    setNavBarTitle("Requested Files");
    setIsBackButton(false);
    //eslint-disable-next-line
  }, [page, rowsPerPage]);

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="container-fluid mt-3">
      <DeleteConfirmation
        open={openDelete}
        isLoading={delLoading}
        setOpen={setOpenDelete}
        title={"Are you sure you want to delete this csv record?"}
        handleAgree={handleDelete}
      />
      <div className="row">
        <div className="col-12 mt-2">
          <CustomTable
            data={csvList}
            MENU_OPTIONS={MENU_OPTIONS}
            TABLE_HEAD={CSV_TABLE_HEAD}
            custom_pagination={{
              total_count: totalCount,
              rows_per_page: rowsPerPage,
              page: page,
              handleChangePage: handleChangePage,
              onRowsPerPageChange: handleChangeRowsPerPage,
            }}
            custom_search={{
              searchText: searchText,
              setSearchText: setSearchText,
              handleSubmit: handleSearch,
            }}
            pageCount={pageCount}
            totalPages={totalPages}
            handleChangePages={handleChangePages}
            pagePagination={true}
            is_hide={true}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestedCsvFiles;
