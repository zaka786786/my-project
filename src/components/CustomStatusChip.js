import React from "react";
import Chip from "@mui/material/Chip";

const CustomStatusChip = ({ status, type, absent, discounted_minutes }) => {
  const statusLabels = {
    0: "Open",
    1: "Completed",
    2: "Processing",
  };

  const booleanLabels = {
    paidORnot: {
      true: "Paid",
      false: "UnPaid",
    },
    activeInactive: {
      true: "Active",
      false: "Inactive",
    },
    presentAbsent: {
      true: "Absent",
      false: "Present",
    },
    YearlyLeaves: {
      true: "Yes",
      false: "No",
    },
  };

  const getBooleanLabel = (status) => {
    if (typeof discounted_minutes === "boolean") {
      return discounted_minutes
        ? "Discount Minutes Taken"
        : "Discount Minutes Not Taken";
    }
    if (typeof absent === "boolean") {
      return absent ? "Absent" : "Present";
    }

    if (type && booleanLabels[type]) {
      return booleanLabels[type][status];
    }

    return status;
  };

  const getStyles = () => {
    if (typeof absent === "boolean") {
      return absent
        ? {
            border: "1px solid rgb(255, 72, 66)",
            color: "rgb(255, 72, 66)",
            backgroundColor: "transparent",
          }
        : {
            border: "1px solid #4CAF50",
            color: "#4CAF50",
            backgroundColor: "transparent",
          };
    }
    if (typeof discounted_minutes === "boolean") {
      return discounted_minutes
        ? {
            border: "1px solid #4CAF50",
            color: "#4CAF50",
            backgroundColor: "transparent",
          }
        : {
            border: "1px solid rgb(255, 72, 66)",
            color: "rgb(255, 72, 66)",
            backgroundColor: "transparent",
          };
    }

    switch (status) {
      case "Pick Up":
      case "Pending":
      case "Shuffle":
      case "partial_fulfilled":
      case "partial_confirmed":
      case "pending":
        return {
          border: "1px solid #FFA500",
          color: "#FFA500",
          backgroundColor: "transparent",
        };
      case "pending":
      case "In Transit":
      case "Needs Changes":
      case "Delayed":
      case "Draft":
      case "Low Stock":
      case "Partially Released":
      case "pending":
      case "Upcoming":
        return {
          border: "1px solid #FFA500",
          color: "#FFA500",
          backgroundColor: "transparent",
        };
      case "Partial":
      case "delayed":
      case "inbound":
      case "ordered":
      case "Shipment Confirmed":
      case "Confirmed":
      case "Prepared":
      case "In Stock":
      case "Stored":
      case "Customer":
      case "allocated":
      case "Enabled":
      case "confirmed":
        return {
          border: "1px solid #3C668C",
          color: "#3C668C",
          backgroundColor: "transparent",
        };

      case true:
      case "Active":
      case "Paid":
      case "received":
      case "Successful":
      case "Delivered":
      case "Received":
      case "delivered":
      case "Released":
      case "completed":
      case "credit":
      case "Release":
      case "Supplier":
      case "Completed":
      case "paid":
      case "partial_allocated":
      case "Yes":
      case "fulfilled":
        return {
          border: "1px solid #4CAF50",
          color: "#4CAF50",
          backgroundColor: "transparent",
        };
      case "Unpaid":
      case "Inactive":
      case "Out of Stock":
      case false:
      case "failed":
      case "Rejected":
      case "Failed":
      case "Cancelled":
      case "cancelled":
      case "Out For Delivery":
      case "Returned":
      case "returned":
      case "debit":
      case "Disabled":
      case "due":
      case "No":
        return {
          border: "1px solid rgb(255, 72, 66)",
          color: "rgb(255, 72, 66)",
          backgroundColor: "transparent",
        };
      case "Inbound":
        return {
          border: "1px solid rgb(142, 200, 255)",
          color: "rgb(142, 200, 255)",
          backgroundColor: "transparent",
        };
      default:
        return {
          border: "1px solid transparent",
          color: "black",
          backgroundColor: "transparent",
        };
    }
  };

  const styles = getStyles();

  return (
    <span>
      <Chip
        variant="outlined"
        size="medium"
        className="Styled_Chip"
        label={
          statusLabels[status]
            ? statusLabels[status]
            : typeof status === "string"
              ? status
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : getBooleanLabel(status)
        }
        sx={{
          "& .MuiChip-label": {
            ...styles,
          },
        }}
      />
    </span>
  );
};

export default CustomStatusChip;
