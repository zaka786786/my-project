import { filter } from "lodash";
import { useState } from "react";

import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Avatar,
  Checkbox,
  Chip,
  Pagination,
  Tooltip,
  Radio,
} from "@mui/material";
import SearchNotFound from "../notFound/SearchNotFound";
import {
  MuiTableHeadList,
  UserListToolbar,
  UserListToolbarsForSearch,
} from "../user";
import CustomPopoverSection from "../menuOption/CustomPopoverSection";
import TableFooter from "@mui/material/TableFooter";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const filter_function = (query, _user, item, extra_filter) => {
  let search = query.toLowerCase();
  if (
    extra_filter?.some(
      (extra) => _user[extra]?.toString().toLowerCase().indexOf(search) !== -1,
    )
  ) {
    return true;
  }

  if (
    item.type !== "link" &&
    item.type !== "row_status" &&
    item.type !== "checkbox" &&
    item.type !== "row_calendar" &&
    item.type !== "thumbnail" &&
    item.type !== "action" &&
    item.type !== "category" &&
    !item.renderData &&
    item.type !== "number"
  ) {
    if (_user[item.id]?.toString().toLowerCase().indexOf(search) !== -1) {
      return true;
    }
  }
};

export default function CustomTable({
  TABLE_HEAD,
  data,
  MENU_OPTIONS,
  checkbox_selection,
  selected,
  setSelected,
  is_hide,
  hide_footer_pagination,
  selected_by,
  className,
  custom_pagination,
  sortBy,
  custom_search,
  pageCount,
  totalPages,
  handleChangePages,
  pagePagination,
  rows_per_page_count,
  extra_filter,
}) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(sortBy ? sortBy : "number");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(
    custom_pagination?.rows_per_page ?? rows_per_page_count ?? 50,
  );

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === "asc";
    // setOrder(isAsc ? "desc" : "asc");
    // setOrderBy(property);
  };

  if (checkbox_selection && !selected) {
    console.log(
      "Error : selected paramter is required as select array AND setSelected paramter is required as setter function for select array",
    );
    selected = [];
  }

  const handleClick = (name) => {
    const selectedIndex = selected?.some((obj) => {
      if (selected_by && selected_by !== "") {
        return obj[selected_by] === name[selected_by];
      } else {
        return obj._id === name._id;
      }
    });

    if (selectedIndex === true) {
      let new_array = selected.filter((item) => {
        if (selected_by && selected_by !== "") {
          return item[selected_by] !== name[selected_by];
        } else {
          return item._id !== name._id;
        }
      });
      setSelected(new_array);
    } else {
      setSelected((selected) => [...selected, name]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    if (query) {
      return filter(array, (_user) => {
        let searched_object = TABLE_HEAD.some((item) => {
          return filter_function(query, _user, item, extra_filter);
        });
        return searched_object;
      });
    }

    let filtered_data = stabilizedThis.map((el) => el[0]);

    if (!custom_pagination?.rows_per_page) {
      // if not using custom_pagination from database then use this line for pagination
      filtered_data = filtered_data.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
    }
    return filtered_data;
  }

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearchText = (event) => {
    const searchTerm = event.target.value;
    custom_search.setSearchText(searchTerm);
  };

  const filteredUsers = applySortFilter(
    data,
    getComparator(order, orderBy),
    filterName,
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data);
      return;
    }
    setSelected([]);
  };

  const handleClickTD = (head, row, index) => {
    if (head.handleClick) {
      head.handleClick(row, index);
    }
  };

  const isUserNotFound = filteredUsers.length === 0;
  return (
    <Card
      style={{ overflowX: "auto", background: "#eef4f9" }}
      className={`mui-without-bg-custom-table table-container ${className}`}
    >
      <TableContainer sx={{ minWidth: "100%" }}>
        {custom_search ? (
          <>
            <div className="d-flex justify-content-between table-heading">
              {pagePagination && (
                <div className="d-flex flex-column align-items-start ">
                  <TablePagination
                    rowsPerPageOptions={[10, 50, 100, 200, 500]}
                    onRowsPerPageChange={
                      custom_pagination
                        ? custom_pagination.onRowsPerPageChange
                        : handleChangeRowsPerPage
                    }
                    component="div"
                    className="pt-3 custom_pagination_with_search"
                    count={
                      custom_pagination
                        ? custom_pagination.total_count
                        : data.length
                    }
                    rowsPerPage={
                      custom_pagination
                        ? custom_pagination?.rows_per_page
                        : rowsPerPage
                    }
                    page={custom_pagination ? custom_pagination.page : page}
                    onPageChange={
                      custom_pagination
                        ? custom_pagination.handleChangePage
                        : handleChangePage
                    }
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
              <UserListToolbarsForSearch
                filterName={custom_search.searchText}
                onFilterName={handleSearchText}
                handleSubmit={custom_search.handleSubmit}
              />
            </div>
          </>
        ) : (
          <>
            <div
              className={`table-heading ${
                pagePagination ? "d-flex justify-content-between" : "text-end"
              } ${!is_hide ? "pt-2" : ""}`}
            >
              {pagePagination && !is_hide && (
                <div className="d-flex flex-column align-items-start">
                  <TablePagination
                    rowsPerPageOptions={[10, 50, 100, 200, 500]}
                    onRowsPerPageChange={
                      custom_pagination
                        ? custom_pagination.onRowsPerPageChange
                        : handleChangeRowsPerPage
                    }
                    component="div"
                    count={
                      custom_pagination
                        ? custom_pagination.total_count
                        : data.length
                    }
                    rowsPerPage={
                      custom_pagination
                        ? custom_pagination?.rows_per_page
                        : rowsPerPage
                    }
                    page={custom_pagination ? custom_pagination.page : page}
                    onPageChange={
                      custom_pagination
                        ? custom_pagination.handleChangePage
                        : handleChangePage
                    }
                  />
                  {pageCount && (
                    <Pagination
                      count={totalPages + 1}
                      page={pageCount}
                      defaultPage={0}
                      onChange={handleChangePages}
                      className="pagination-style"
                    />
                  )}
                </div>
              )}
              {!is_hide && (
                <UserListToolbar
                  filterName={filterName}
                  onFilterName={handleFilterByName}
                />
              )}
            </div>
          </>
        )}

        <div style={{ overflowX: "auto" }}>
          <Table sx={{ background: "#fff", width: "100%" }}>
            <MuiTableHeadList
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={data.length}
              numSelected={checkbox_selection && selected.length}
              onRequestSort={handleRequestSort}
              checkbox_selection={checkbox_selection}
              handleSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers.map((row, index) => {
                const isItemSelected =
                  selected?.length < 1
                    ? false
                    : selected?.some((obj) => {
                        if (selected_by && selected_by !== "") {
                          return obj[selected_by] === row[selected_by];
                        } else {
                          return obj._id === row._id;
                        }
                      });

                return (
                  <TableRow
                    hover
                    key={index}
                    tabIndex={-1}
                    role="checkbox"
                    // selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    {checkbox_selection && (
                      <TableCell align="left" width={50}>
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleClick(row)}
                        />
                      </TableCell>
                    )}
                    {TABLE_HEAD.map((head, i) => {
                      if (head.type === "checkbox") {
                        return (
                          <TableCell
                            className={head.className}
                            align="left"
                            key={i}
                          >
                            <Checkbox
                              checked={row[head.id]}
                              onChange={(e) => head.handleClick(e, row, index)}
                            />
                          </TableCell>
                        );
                      } else if (head.type === "radio_button") {
                        return (
                          <TableCell
                            className={head.className}
                            align="left"
                            key={i}
                          >
                            <Radio
                              checked={row[head.id]}
                              onChange={(e) => head.handleClick(e, row, index)}
                            />
                          </TableCell>
                        );
                      } else if (head.type === "row_calendar") {
                        if (row.is_show_celendar === true) {
                          return (
                            <TableCell
                              className={head.className}
                              align="left"
                              key={i}
                            >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label="Date"
                                  onChange={(date) =>
                                    head.handleChangeDate(date, index, row)
                                  }
                                  value={row[head.id]}
                                />
                              </LocalizationProvider>
                            </TableCell>
                          );
                        } else {
                          return <TableCell align="left" key={i}></TableCell>;
                        }
                      } else if (head.type === "number") {
                        return (
                          <TableCell
                            className={head.className}
                            align="left"
                            key={i}
                          >
                            <span
                              className={row.className}
                              onClick={() => {
                                handleClickTD(head, row, index);
                              }}
                            >
                              {index +
                                1 +
                                (custom_pagination
                                  ? custom_pagination?.rows_per_page *
                                    custom_pagination?.page
                                  : rowsPerPage * page)}
                            </span>
                          </TableCell>
                        );
                      } else if (head.type === "row_status") {
                        return (
                          <TableCell
                            className={head.className}
                            align="left"
                            key={i}
                          >
                            <Chip
                              width="140px"
                              label={
                                row[head.id] === true ? "Active" : "Inactive"
                              }
                              variant="contained"
                              className={
                                row[head.id] === true
                                  ? `manage-program-chip-success ${row.className}`
                                  : ""
                              }
                              color={
                                row[head.id] === true ? "success" : "error"
                              }
                              size="small"
                              onClick={() => {
                                handleClickTD(head, row, index);
                              }}
                            />
                          </TableCell>
                        );
                      } else if (head.type === "thumbnail") {
                        return (
                          <TableCell
                            className={head.className}
                            align="left"
                            key={i}
                          >
                            <Avatar
                              alt={row[head.id]?.alt}
                              src={row[head.id]?.src}
                              onClick={() => {
                                handleClickTD(head, row, index);
                              }}
                            />
                          </TableCell>
                        );
                      } else if (head.type === "link") {
                        return (
                          <TableCell className={head.className} key={i}>
                            {row[head.id].show_text ? (
                              <a
                                href={row[head.id].to}
                                className={row[head.id].className}
                                target={row[head.id].target}
                              >
                                {row[head.id].show_text}
                              </a>
                            ) : row[head.id].show_alternate_text ? (
                              row[head.id].show_alternate_text
                            ) : (
                              ""
                            )}
                          </TableCell>
                        );
                      } else if (head.type === "action") {
                        return (
                          <TableCell
                            align="left"
                            className={head.className}
                            key={i}
                          >
                            {row[head.MENU_OPTIONS]?.length > 0 ||
                            MENU_OPTIONS?.length > 0 ? (
                              <CustomPopoverSection
                                menu={
                                  row[head.MENU_OPTIONS]
                                    ? row[head.MENU_OPTIONS]
                                    : MENU_OPTIONS
                                }
                                data={row}
                              />
                            ) : (
                              <CustomPopoverSection menu={[]} data={{}} />
                            )}
                          </TableCell>
                        );
                      } else if (head.type === "html") {
                        return (
                          <TableCell
                            align="left"
                            component="th"
                            scope="row"
                            className={head.className}
                            key={i}
                            onClick={() => {
                              handleClickTD(head, row, index);
                            }}
                          >
                            <div
                              className={row.className}
                              dangerouslySetInnerHTML={{
                                __html: row[head.id],
                              }}
                            ></div>
                          </TableCell>
                        );
                      } else if (head.type === "title_with_img") {
                        return (
                          <TableCell
                            align="left"
                            className={head.className}
                            key={i}
                            onClick={() => {
                              handleClickTD(head, row, index);
                            }}
                          >
                            <>{row[head.id?.title]}</>
                            <Tooltip title={row[head.id?.tooltip]}>
                              <img
                                src={row[head.id?.image]}
                                width="30px"
                                className={`bagde-image ${row[head.id?.class]}`}
                              />
                            </Tooltip>
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell
                            align="left"
                            className={head.className}
                            key={i}
                          >
                            {head.renderData ? (
                              head.renderData(row, index)
                            ) : (
                              <span
                                className={row.className}
                                onClick={() => {
                                  handleClickTD(head, row, index);
                                }}
                              >
                                {row[head.id]}
                              </span>
                            )}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
            {isUserNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={
                      checkbox_selection
                        ? TABLE_HEAD.length + 1
                        : TABLE_HEAD.length
                    }
                    sx={{ py: 3 }}
                  >
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
        <TableFooter className="mui-table-footer table-heading w-100">
          <div
            className={`rows_selected_text ms-3 mt-2 ${
              hide_footer_pagination ? "pb-3" : ""
            }`}
          >
            {checkbox_selection && selected.length > 0
              ? `${selected.length} ${
                  selected.length > 1 ? "rows" : "row"
                } selected`
              : ""}
          </div>
          {!hide_footer_pagination && (
            <TablePagination
              rowsPerPageOptions={[10, 50, 100, 200, 500]}
              onRowsPerPageChange={
                custom_pagination
                  ? custom_pagination.onRowsPerPageChange
                  : handleChangeRowsPerPage
              }
              component="div"
              count={
                custom_pagination ? custom_pagination.total_count : data.length
              }
              rowsPerPage={
                custom_pagination
                  ? custom_pagination?.rows_per_page
                  : rowsPerPage
              }
              page={custom_pagination ? custom_pagination.page : page}
              onPageChange={
                custom_pagination
                  ? custom_pagination.handleChangePage
                  : handleChangePage
              }
            />
          )}
        </TableFooter>

        {pagePagination && pageCount ? (
          <Pagination
            count={totalPages + 1}
            page={pageCount}
            defaultPage={0}
            onChange={handleChangePages}
            className="pagination-style-footer"
          />
        ) : (
          ""
        )}
      </TableContainer>
    </Card>
  );
}
