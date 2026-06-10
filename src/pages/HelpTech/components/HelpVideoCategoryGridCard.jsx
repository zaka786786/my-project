import React, { useState, useRef, useEffect } from "react";

const BRAND = {
  navy: "#234e86",
  orange: "#fb7d20",
};

function MoreVertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      style={{ width: 16, height: 16 }}
    >
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

export default function HelpVideoCategoryGridCard({
  value,
  MENU_OPTIONS,
  imageBaseUrl,
  handleVideos,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid rgba(35,78,134,0.09)`,
        cursor: "pointer",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      className="hvc-card"
      onClick={() => handleVideos(value)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(35,78,134,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 168, overflow: "hidden" }}>
        <img
          src={imageBaseUrl + value.image}
          alt={value.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(10,25,50,0.45) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Order badge */}
        <span
          style={{
            position: "absolute",
            bottom: 10,
            left: 12,
            background: "rgba(35,78,134,0.82)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "3px 9px",
            borderRadius: 6,
          }}
        >
          #{value.order}
        </span>

        {/* Menu button */}
        <div ref={menuRef} style={{ position: "absolute", top: 10, right: 10 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.92)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND.navy,
            }}
            aria-label="Options"
          >
            <MoreVertIcon />
          </button>

          {open && (
            <div
              style={{
                position: "absolute",
                top: 38,
                right: 0,
                background: "#fff",
                border: "1px solid rgba(35,78,134,0.12)",
                borderRadius: 10,
                padding: 4,
                zIndex: 20,
                minWidth: 140,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              }}
            >
              {MENU_OPTIONS.map((item, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.handleClick(value);
                    setOpen(false);
                  }}
                  style={{
                    fontSize: 13,
                    padding: "8px 12px",
                    borderRadius: 7,
                    cursor: "pointer",
                    color: item.danger ? "#cc3333" : "#1a2a3a",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.danger
                      ? "#fff3f0"
                      : "#f0f5fb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "14px 16px 16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#1a2a3a",
            lineHeight: 1.45,
            margin: "0 0 10px 0",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 41,
          }}
        >
          {value.title}
        </p>

        <div
          style={{
            height: 1,
            background: "rgba(35,78,134,0.07)",
            margin: "0 0 10px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Status pill */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 20,
              letterSpacing: "0.03em",
              ...(value.category_status
                ? {
                    background: "#eafaf1",
                    color: "#1a8c4a",
                    border: "1px solid #b4e5cc",
                  }
                : {
                    background: "#fdf0f0",
                    color: "#bb3333",
                    border: "1px solid #f0c0c0",
                  }),
            }}
          >
            {value.category_status ? "Active" : "Inactive"}
          </span>

          {/* Order with accent dot */}
          {/* <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: BRAND.orange,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "#5a6e88", fontWeight: 500 }}>
              Order {value.order}
            </span>
          </div> */}

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 20,
                letterSpacing: "0.03em",
                background:
                  value.category_for === "internal_team"
                    ? "#f3e8ff"
                    : "#fff4ea",
                color:
                  value.category_for === "internal_team"
                    ? "#7c3aed"
                    : BRAND.orange,
                border:
                  value.category_for === "internal_team"
                    ? "1px solid #dcc6ff"
                    : "1px solid #ffd4b0",
                textTransform: "capitalize",
              }}
            >
              {value.category_for === "internal_team"
                ? "Internal Team"
                : "Business Portal"}
            </span>
          </div>
        </div>

        {/* Groups */}
        {value.groups && value.groups.length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            {value.groups.map((item, index) => (
              <span
                key={index}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  background: "#f0f5fb",
                  color: BRAND.navy,
                  borderRadius: 6,
                  padding: "3px 9px",
                  border: "1px solid rgba(35,78,134,0.12)",
                }}
              >
                {item.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
