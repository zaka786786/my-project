import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CircularProgress } from "@mui/material";
import { imageBaseUrl } from "../../config/config";

export default function UploadImageBox({ handleRemove, handleChange, item }) {
  return (
    <>
      {!item?.icon ? (
        <span className="upload-button mb-1">
          <input
            color="primary"
            accept="image/*"
            type="file"
            id={`parent-icon-upload-${item.id}`}
            style={{ display: "none" }}
            name="icon"
            onChange={handleChange}
          />
          <label htmlFor={`parent-icon-upload-${item.id}`}>
            {item.is_loading ? (
              <CircularProgress color="inherit" className="w-5 h-auto" />
            ) : (
              <CloudUploadIcon />
            )}
          </label>
        </span>
      ) : (
        <div className="preview">
          <span className="track-image-cross" onClick={handleRemove}>
            x
          </span>
          <img src={imageBaseUrl + item?.icon} className="track-image" />
        </div>
      )}
    </>
  );
}
