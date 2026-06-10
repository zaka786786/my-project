import React, { useEffect, useRef, useState } from "react";

import ReactEditor from "react-text-editor-kit";
import { _upload_image } from "../../DAL/Uploads/imageUpload";
import { imageBaseUrl } from "../../config/config";
// import { _upload_any_single_file_on_s3 } from "src/DAL/uploadImageOnS3";
// import { s3baseUrl } from "src/config/config";

let theme_config = {
  "background-color": "#fff",
  "border-color": "#c4c4c4",
  "text-color": "#414141",
  "toolbar-button-background": "#fff",
  "toolbar-text-color": "#414141",
  "toolbar-button-hover-background": "#efefef",
  "toolbar-button-selected-background": "#dee0e2",
  "svg-color": "#414141",
  // "save-button-background": "rgb(9, 134, 62)",
  "save-button-background": "rgb(1 102 153)",
};

export default function Editor({
  value,
  onChange,
  height,
  placeholder = "",
  remove_from_toolbar = [],
  remove_from_navbar = [],
}) {
  const get_editor_ref = (value) => {};
  const ThingsToRemove = [...remove_from_toolbar, ...remove_from_navbar];

  const image_handler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.image);

    try {
      let result = await _upload_image(formData);
      if (result.code == 200) {
        return imageBaseUrl + result.path;
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <ReactEditor
        value={value}
        getEditorRef={get_editor_ref}
        onChange={onChange}
        mainProps={{ className: "red" }}
        placeholder={placeholder}
        theme_config={theme_config}
        image_handler={image_handler}
        remove_from_toolbar={ThingsToRemove}
        remove_from_navbar={ThingsToRemove}
      />
    </div>
  );
}
