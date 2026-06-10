import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
// ==============================

const Centered = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "45%",
  left: "50vw",
  transform: "translate(-50%,-50%)",
  [theme.breakpoints.up("lg")]: {
    left: "57vw",
  },
}));
const CircularLoader = ({ size, color }) => {
  return (
    <Centered>
      <CircularProgress
        size={size ? size : "3rem"}
        style={{ color: color ? color : "default" }}
      />
    </Centered>
  );
};
export default CircularLoader;
CircularLoader.propTypes = {
  size: PropTypes.string,
};
