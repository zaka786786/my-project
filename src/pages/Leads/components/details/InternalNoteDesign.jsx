import { Typography, Box, Avatar, IconButton } from "@mui/material";
import moment from "moment";
import { imageBaseUrl } from "../../../../config/config";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAdminContext } from "../../../../Hooks/AdminContext";

const InternalNoteDesign = ({ note, fullName, handleMenuOpen }) => {
  const { adminInfo } = useAdminContext();
  let isShow = adminInfo?.user_id?._id === note?.action_info?.user_id;

  if (adminInfo?.role?.alias_title == "admin") {
    isShow = true;
  }

  return (
    <Box
      key={note?._id}
      sx={{
        width: "100%",
        p: 2,
        border: "1px solid #eef2f7ea",
        borderRadius: "6px",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "#eef2f7",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
            flex: 1,
          }}
        >
          <Avatar
            src={
              note?.action_info?.profile_image
                ? imageBaseUrl + note?.action_info?.profile_image
                : ""
            }
            alt={fullName}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#16437f",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {note?.action_info?.first_name?.[0] || "U"}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#1e293b",
                lineHeight: 1.2,
              }}
            >
              {fullName || "N/A"}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.0,
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "11.5px",
              color: "#94a3b8",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {moment(note?.date).format("DD MMM YYYY • hh:mm A")}
          </Typography>

          <Box
            sx={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isShow ? (
              <IconButton
                onClick={(e) => handleMenuOpen(e, note)}
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  color: "#64748b",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#fff",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    color: "#16437f",
                    borderColor: "#cbd5e1",
                  },
                }}
              >
                <MoreVertIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            ) : (
              <Box sx={{ width: 32, height: 32 }} />
            )}
          </Box>
        </Box>
      </Box>

      <div className="p-0 mt-3">
        <Typography
          sx={{
            fontSize: "14px",
            // color: "#334155",
            lineHeight: 1.8,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            // fontWeight: 400,
          }}
        >
          {note?.message || "-"}
        </Typography>
      </div>
    </Box>
  );
};

export default InternalNoteDesign;
