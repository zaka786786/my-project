import React from "react";
import { Avatar } from "@mui/material";

// Props: imageUrl, altText, name, size (default 40px)
const CustomImageAvatar = ({ imageUrl, altText, name, size = 70 }) => {
  const showImage = imageUrl && imageUrl.trim() !== "";

  return (
    <Avatar
      src={showImage ? imageUrl : undefined}
      alt={altText || name}
      sx={{
        width: size,
        height: size,
        fontSize: size / 3.4,
        textTransform: "uppercase",
        "& .MuiAvatar-img": {
          objectFit: "cover",
          width: size,
          height: size,
        },
      }}
    />
  );
};

export default CustomImageAvatar;
