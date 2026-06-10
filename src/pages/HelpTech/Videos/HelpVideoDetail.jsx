import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { IconButton, Chip, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CircularLoader from "../../../components/loaders/CircularLoader";
import { category_video_api } from "../../../DAL/HelpVideos/HelpVideos";
import { imageBaseUrl } from "../../../config/config";
import { useAdminContext } from "../../../Hooks/AdminContext";

// function getEmbedUrl(url) {
//   if (!url) return "";

//   const ytMatch = url.match(
//     /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
//   );
//   if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

//   const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
//   if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

//   const loomMatch = url.match(/loom\.com\/share\/([A-Za-z0-9]+)/);
//   if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

//   return url;
// }

function getEmbedUrl(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const parsed = new URL(url);

    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    const loomMatch = url.match(/loom\.com\/share\/([A-Za-z0-9]+)/);
    if (loomMatch) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }

    return null;
  } catch (err) {
    return null;
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function HelpVideoDetail() {
  const { id, sub_id } = useParams();
  const { setNavBarTitle, setIsBackButton } = useAdminContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState(null);

  const getVideoData = async () => {
    setIsLoading(true);
    const result = await category_video_api(sub_id);
    console.log("result  ___sub_id", result);
    if (result.code === 200) {
      setVideo(result.video);
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
    setIsLoading(false);
  };

  //   useEffect(() => {
  //     console.log("sub_id  ___sub_id", sub_id);
  //     getVideoData();
  //   }, [sub_id]);

  useEffect(() => {
    console.log("sub_id  ___sub_id", sub_id);

    setNavBarTitle("Video Detail");
    setIsBackButton(true);
    if (!sub_id || sub_id.includes("http")) {
      return;
    }

    getVideoData();
  }, [sub_id]);

  if (isLoading) return <CircularLoader />;
  if (!video) return null;

  const embedUrl = getEmbedUrl(video?.video_url);
  const isBusinessSpecific = video.video_type === "business_specific";

  return (
    <div className="container-fluid p-0">
      <div style={{ background: "#0a1628" }}>
        <div
          // style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px" }}
          className="w-100"
        >
          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0 8px",
            }}
          >
            <IconButton
              onClick={() =>
                navigate(`/help-video-categories/help-videos/${id}`)
              }
              style={{ color: "#fff" }}
            >
              <ArrowBackIcon />
            </IconButton>

            <IconButton
              onClick={() =>
                navigate(
                  `/help-video-categories/update-help-videos/${id}/edit-video/${video._id}`,
                  { state: video },
                )
              }
              style={{ color: "#fff" }}
            >
              <EditIcon />
            </IconButton>
          </div> */}

          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            ) : (
              <img
                src={imageBaseUrl + video?.image}
                alt={video.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}

            {/* {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            ) : (
              <img
                src={imageBaseUrl + video?.image}
                alt={video.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )} */}
          </div>
        </div>
      </div>

      <div
        // style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 48px" }}
        className="w-100"
      >
        <div
          className="card1"
          //   style={{ borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}
          style={{ borderRadius: 0, padding: "0px 1px", marginBottom: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <h2
              className="mb-0"
              style={{ fontSize: 20, fontWeight: 600, margin: 0 }}
            >
              {video.title}
            </h2>
            <div
              style={{
                display: "flex",
                gap: 6,
                flexShrink: 0,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={video.status ? "Active" : "Inactive"}
                size="small"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: video.status ? "#eafaf1" : "#fdf0f0",
                  color: video.status ? "#1a8c4a" : "#bb3333",
                  border: `1px solid ${video.status ? "#b4e5cc" : "#f0c0c0"}`,
                }}
              />
              <Chip
                label={isBusinessSpecific ? "Business Specific" : "General"}
                size="small"
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: isBusinessSpecific ? "#fff4ea" : "#f3e8ff",
                  color: isBusinessSpecific ? "#c05a00" : "#7c3aed",
                  border: `1px solid ${isBusinessSpecific ? "#ffd4b0" : "#dcc6ff"}`,
                }}
              />
            </div>
          </div>

          {video.short_description && (
            <p
              style={{
                fontSize: 14,
                color: "#5a6e88",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {video.short_description}
            </p>
          )}

          <Divider sx={{ my: 1.5 }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px 24px",
            }}
          >
            <MetaItem
              label="Category"
              value={video.video_category?.title || "—"}
            />
            <MetaItem label="Order" value={`#${video.order}`} />
            <MetaItem label="Added on" value={formatDate(video.createdAt)} />
            <MetaItem
              label="Last updated"
              value={formatDate(video.updatedAt)}
            />
          </div>
        </div>

        {isBusinessSpecific && (
          <div
            className="card1"
            // style={{ borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}
            style={{ borderRadius: 12, padding: "9px 1px", marginBottom: 16 }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#5a6e88",
                // margin: "0 0 12px",
              }}
              className="mb-0"
            >
              Business targeting
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <BusinessList
                label="Included businesses"
                items={video.business_included}
                emptyText="All businesses included"
                color="success"
              />
              <BusinessList
                label="Excluded businesses"
                items={video.business_excluded}
                emptyText="No exclusions"
                color="error"
              />
            </div>
          </div>
        )}

        {video.detail_description && (
          <div
            className="card1"
            // style={{ borderRadius: 12, padding: "20px 24px" }}
            style={{ borderRadius: 12, padding: "9px 1px", marginBottom: 16 }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#5a6e88",
                // margin: "0 0 12px",
              }}
              className="mb-0"
            >
              Detail description
            </p>
            <div
              style={{ fontSize: 14, lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: video.detail_description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#8a9bb0",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          margin: "0 0 2px",
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 14, color: "#1a2a3a", margin: 0 }}>{value}</p>
    </div>
  );
}

function BusinessList({ label, items, emptyText, color }) {
  return (
    <div>
      <p
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#8a9bb0",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      {items && items.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {items.map((b, i) => (
            <Chip
              key={i}
              label={`${b.first_name} ${b.last_name}`}
              size="small"
              color={color}
              variant="outlined"
              sx={{ fontSize: 12 }}
            />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "#aab0bb", margin: 0 }}>{emptyText}</p>
      )}
    </div>
  );
}
