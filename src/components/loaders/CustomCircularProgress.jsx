import { CircularProgress } from "@mui/material";

const CustomCircularProgress = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center h-100"
      style={{
        paddingBottom: "64px",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default CustomCircularProgress;
