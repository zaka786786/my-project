import * as React from "react";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import CustomPopover from "./CustomPopover";
import {
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function MultipleItemsShowList({
  title = "",
  dataList = [],
  modalState,
  setModalState,
  nameUr = "name_ur",
  nameEn = "name_en",
}) {
  console.log("dataList  __dataList", dataList);
  return (
    <>
      <CustomPopover
        isOpenPop={modalState}
        isClosePop={setModalState}
        title={title}
        showAllButtons={false}
        width={"600px"}
        componentToPassDown={
          <>
            <div className="popover-mid-container">
              <div className="spacing">
                <div className="row-spacing">
                  <Paper
                    elevation={3}
                    style={{
                      width: "100%",
                      padding: "10px",
                      boxShadow: "none",
                      paddingTop: "0px",
                    }}
                  >
                    {dataList && dataList?.length == 0 ? (
                      <div className="p-3">
                        <Typography variant="h5" align="center">
                          No Data Exist
                        </Typography>
                      </div>
                    ) : (
                      <List>
                        {dataList &&
                          dataList.map((item, index) => (
                            <ListItem
                              key={index}
                              style={{
                                border: "1px solid #ced4da",
                                borderRadius: "4px",
                                marginBottom:
                                  index !== dataList.length - 1 ? "8px" : "0", // No margin for the last item
                                padding: "10px 14px",
                              }}
                              secondaryAction={<div></div>}
                            >
                              <ListItemText
                                primary={
                                  <span className="capitalized">
                                    {item[nameEn]}
                                    {item[nameUr] && (
                                      <span className="font-family-urdu">
                                        ( {item[nameUr]} )
                                      </span>
                                    )}
                                  </span>
                                }
                                className="tehsil-list"
                              />
                            </ListItem>
                          ))}
                      </List>
                    )}
                  </Paper>
                </div>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}
