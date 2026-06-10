import { useState } from "react";
import CustomTable from "../../components/customTable/CustomTable";

const useTable = ({
  handleCustomSearch,
  list,
  TABLE_HEAD,
  MENU_OPTIONS,
  is_hide = false,
  hide_footer_pagination = false,
  checkbox_selection = false,
  selected_by = "_id",
  className = "",
  sortBy = "number",
  pagePagination = false,
  rows_per_page_count = 50,
  extra_filter = [],
}) => {
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rows_per_page_count);
  const [pageCount, setPageCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState([]);

  const handleChangePage = (_, newPage) => {
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

  const handleChangePages = (_, newPage) => {
    if (newPage <= 0) {
      setPage(0);
      setPageCount(0);
    } else {
      setPage(newPage - 1);
      setPageCount(newPage);
    }
  };

  const custom_search = is_hide
    ? null
    : {
        searchText,
        setSearchText,
        handleSubmit: handleCustomSearch,
      };

  const table = (
    <CustomTable
      data={list}
      TABLE_HEAD={TABLE_HEAD}
      MENU_OPTIONS={MENU_OPTIONS}
      pagePagination={pagePagination}
      custom_search={custom_search}
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
      is_hide={is_hide}
      hide_footer_pagination={hide_footer_pagination}
      checkbox_selection={checkbox_selection}
      selected={selected}
      setSelected={setSelected}
      selected_by={selected_by}
      className={className}
      sortBy={sortBy}
      rows_per_page_count={rows_per_page_count}
      extra_filter={extra_filter}
    />
  );

  return {
    table,
    setTotalPages,
    setTotalCount,
    searchText,
    setSearchText,
    selected,
    setSelected,
  };
};

export default useTable;
