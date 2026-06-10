import React from "react";
import { Typography, Box } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function MUICustomTabs({
  data,
  value,
  handleChange,
  orientation,
  verticalTabsTitle,
}) {
  return (
    <Box
      sx={{ width: "100%" }}
      className={orientation ? `${orientation}-tabs` : ""}
    >
      <div>
        {orientation == "vertical" && (
          <h3 className="vertical_tabs_title">
            {verticalTabsTitle ? verticalTabsTitle : ""}
          </h3>
        )}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            orientation={orientation || "horizontal"}
            variant="scrollable"
            scrollButtons="auto"
            // allowScrollButtonsMobile="auto"
            aria-label="scrollable auto tabs example"
            className={orientation == "vertical" ? "mt-3" : ""}
          >
            {data.length > 0 &&
              data.map((item, index) => {
                return (
                  <Tab
                    key={index}
                    label={item.title}
                    {...a11yProps(0)}
                    onClick={
                      item.onClick ? (e) => item.onClick(e, item) : undefined
                    }
                  />
                );
              })}
          </Tabs>
        </Box>
      </div>
      {data.length > 0 &&
        data.map((item, index) => {
          return (
            <TabPanel
              value={value}
              index={index}
              className={
                orientation == "vertical" ? "mui_custom_vertical_tab" : ""
              }
            >
              {item.component}
            </TabPanel>
          );
        })}
    </Box>
  );
}

export default MUICustomTabs;
