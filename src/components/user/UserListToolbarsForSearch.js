import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button,
} from "@mui/material";

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320 },
  "& fieldset": {
    borderWidth: `0 !important`,
  },
}));

UserListToolbarsForSearch.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbarsForSearch({
  numSelected,
  filterName,
  onFilterName,
  handleSubmit,
  buttonText,
}) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 &&
          {
            // color: "primary.main",
            // bgcolor: "primary.lighter",
          }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <form onSubmit={handleSubmit} className="d-flex align-items-center ">
          <SearchStyle
            className="ms-auto custom_search_box"
            value={filterName}
            onChange={onFilterName}
            placeholder="Search"
            startAdornment={
              <InputAdornment position="start">
                <Box
                  component={Icon}
                  icon={searchFill}
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            }
          />
          {buttonText ? (
            ""
          ) : (
            <Button
              variant="contained"
              type="submit"
              className="ms-3 search_btn"
            >
              Search
            </Button>
          )}
        </form>
      )}
    </RootStyle>
  );
}
