import {
  Badge,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import moment from "moment";
import Iconify from "../../components/Iconify";
import {
  notificationPaperStyle,
  NotificationsIconProvider,
} from "../../utils/constant";

const staticNotifications = [
  {
    _id: "1",
    message: "Your ad account was reviewed.",
    notification_type: "ad_account",
    module_id: "xyz123",
    is_read: false,
    time: moment().subtract(1, "hours").fromNow(),
  },
  {
    _id: "2",
    message: "Clear funds have been processed.",
    notification_type: "clear_funds",
    module_id: "abc456",
    is_read: true,
    time: moment().subtract(2, "days").fromNow(),
  },
  {
    _id: "3",
    message: "New chat message from support.",
    notification_type: "chat_message",
    module_id: "chat789",
    is_read: false,
    time: moment().subtract(10, "minutes").fromNow(),
  },
];

const Notifications = () => {
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState(staticNotifications);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <>
      <Badge
        badgeContent={unreadCount}
        color="error"
        max={50}
        sx={{
          "& .MuiBadge-badge": {
            lineHeight: "13px",
            fontSize: "10px",
            top: "10px",
            right: "3px",
          },
        }}
      >
        <div onClick={handleNotificationClick}>
          <Box className="notification-container pointer">
            <Iconify
              className="notification-bell fs-4"
              icon="line-md:bell-loop"
            />
          </Box>
        </div>
      </Badge>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transitionDuration={600}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={notificationPaperStyle}
        className="mt-2"
      >
        <Box
          sx={{
            // minWidth: "400px",
            px: 2,
            py: 1,
            borderBottom: "1px solid #ccc",
          }}
        >
          <div className="d-flex justify-content-between">
            <div className="col-9">
              <Typography variant="subtitle2">Notifications</Typography>
              <Typography variant="caption" color="text.secondary">
                {unreadCount} unread notifications
              </Typography>
            </div>
            <div className="col-3 text-end">
              <IconButton onClick={markAllAsRead}>
                <Iconify
                  icon="mdi:tick-all"
                  sx={{ fontSize: "24px", color: "primary.main" }}
                />
              </IconButton>
            </div>
          </div>
        </Box>

        <Box className="list-item-main">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <React.Fragment key={notif._id}>
                <MenuItem
                  onClick={() => handleNotificationRead(notif._id)}
                  sx={{
                    width: "100%",
                    backgroundColor: notif.is_read
                      ? "inherit"
                      : "rgba(221, 233, 244, 0.7)",
                    color: notif.is_read ? "#ACACAC" : "#5792c9",
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderRadius: 1,
                    margin: "4px 0px",
                    "&:hover": {
                      backgroundColor: "#8080801f",
                    },
                  }}
                >
                  <div className="me-3 notification-icon-background">
                    <Iconify
                      className={"notification-icon"}
                      icon={NotificationsIconProvider(notif)}
                      // icon="eva:bell-fill"
                    />
                  </div>
                  <div>
                    <Typography variant="body2">{notif.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notif.time}
                    </Typography>
                  </div>
                </MenuItem>
                {notif.is_read && (
                  <Divider sx={{ my: 0.5, borderColor: "white" }} />
                )}
              </React.Fragment>
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "300px",
                textAlign: "center",
                py: 3,
                color: "#999",
              }}
            >
              <Iconify
                icon="mdi:bell-off-outline"
                sx={{ fontSize: 36, mb: 1 }}
              />
              <Typography variant="body2">
                You have no notifications yet.
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default Notifications;
