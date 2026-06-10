import PropTypes from "prop-types";
import { Typography } from "@mui/material";

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = "", ...other }) {
  return (
    <div {...other}>
      <div className="p-3">
        <Typography variant="h5" align="center">
          No Data Exist
        </Typography>
      </div>
    </div>
  );
}
