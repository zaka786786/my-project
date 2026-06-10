import { Tooltip } from "@mui/material";
import { permission_string } from "../utils/constant";

const TooltipShowing = ({ accessType, component, customTitle }) => {
  const tooltipTitle =
    customTitle !== undefined && customTitle !== ""
      ? customTitle
      : accessType === "disabled"
        ? permission_string
        : "";

  return (
    <Tooltip title={tooltipTitle} arrow followCursor={true}>
      <span className={accessType === "disabled" ? "cursor-error" : ""}>
        {component}
      </span>
    </Tooltip>
  );
};
export default TooltipShowing;
