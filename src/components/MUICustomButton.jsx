import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef } from "react";

export default function MUICustomButton({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  startIcon,
  endIcon,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  selfIcon = false,
  className = "",
  ...rest
}) {
  const btnRef = useRef(null);

  const handleRipple = (e) => {
    const button = btnRef.current;
    const ripple = document.createElement("span");
    ripple.classList.add("mui-ripple");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  const handleClick = (e) => {
    if (!disabled) {
      handleRipple(e);
      onClick?.(e);
    }
  };

  return (
    <button
      ref={btnRef}
      type={type}
      className={`mui-btn mui-btn-${variant} mui-btn-${size} mui-btn-${color} custom-button-setting ${
        fullWidth ? "mui-btn-fullWidth" : ""
      } ${disabled ? "mui-btn-disabled" : ""} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      {startIcon && (
        <>
          {selfIcon ? (
            startIcon
          ) : (
            <Icon icon={startIcon} className="mui-btn-icon start" />
          )}
        </>
      )}
      <span className="mui-btn-label">{children}</span>
      {endIcon && (
        <>
          {selfIcon ? (
            endIcon
          ) : (
            <Icon icon={endIcon} className="mui-btn-icon end" />
          )}
        </>
      )}
    </button>
  );
}
