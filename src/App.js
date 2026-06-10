import React, { createRef, useEffect, useRef } from "react";
import ThemeConfig from "./theme";
import Routers from "./routes";
import { Slide } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Helmet } from "react-helmet-async";
import "./assets/css/style.css";
import "react-phone-input-2/lib/style.css";
import "react-tagsinput/react-tagsinput.css";
import { ContextAdmin } from "./Hooks/AdminContext";
import { LogoNew } from "./assets";
import { projectMode } from "./config/config";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  const notistackRef = createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  const baseline = useRef({
    widthDiff: window.outerWidth - window.innerWidth,
    heightDiff: window.outerHeight - window.innerHeight,
    zoom: window.devicePixelRatio,
  });

  if (projectMode === "prod" && window?.location?.hostname !== "localhost") {
    const immediateDevToolsCheck = () => {
      let isCompleteRender = localStorage.getItem("isCompleteRender");

      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      // Debug log
      if (isMobile) return;

      const currentWidthDiff = window.outerWidth - window.innerWidth;
      const currentHeightDiff = window.outerHeight - window.innerHeight;
      const currentZoom = window.devicePixelRatio;

      // Ignore if zoom level changed (before or after load)
      if (currentZoom !== baseline.current.zoom) return;

      // Detect if DevTools docking created a large viewport change
      const widthThreshold =
        currentWidthDiff - baseline.current.widthDiff > 160;
      const heightThreshold =
        currentHeightDiff - baseline.current.heightDiff > 160;
      setTimeout(() => {
        if ((widthThreshold || heightThreshold) && !isCompleteRender) {
          window.location.href = "about:blank";
          return;
        } else {
          localStorage.setItem("isCompleteRender", true);
        }
      }, 1000);
    };

    immediateDevToolsCheck();
  }
  useEffect(() => {
    if (projectMode === "prod" && window?.location?.hostname !== "localhost") {
      let devtoolsOpen = false;

      const detectDevTools = () => {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          );
        if (isMobile) return;

        // Method 1: Viewport size detection
        const currentWidthDiff = window.outerWidth - window.innerWidth;
        const currentHeightDiff = window.outerHeight - window.innerHeight;
        const currentZoom = window.devicePixelRatio;

        // Update baseline if zoom changed (to handle zoom changes)
        if (currentZoom !== baseline.current.zoom) {
          baseline.current = {
            widthDiff: currentWidthDiff,
            heightDiff: currentHeightDiff,
            zoom: currentZoom,
          };
          return;
        }

        // Detect if DevTools docking created a large viewport change
        const widthThreshold =
          Math.abs(currentWidthDiff - baseline.current.widthDiff) > 160;
        const heightThreshold =
          Math.abs(currentHeightDiff - baseline.current.heightDiff) > 160;

        // Method 2: Console timing detection
        let start = performance.now();
        console.profile();
        console.profileEnd();
        let timingDetected = performance.now() - start > 5;

        // Method 3: Check if window is significantly smaller (devtools taking space)
        const windowTooSmall =
          window.innerWidth < 500 || window.innerHeight < 300;

        let isCompleteRender = localStorage.getItem("isCompleteRender");

        if (
          (widthThreshold || heightThreshold || timingDetected) &&
          !isCompleteRender
        ) {
          if (!devtoolsOpen) {
            devtoolsOpen = true;
            window.location.href = "about:blank";
          }
        }
      };

      // Run detection every 200ms
      const devToolsInterval = setInterval(detectDevTools, 200);
      // Run debugger detection every 1000ms (less frequent as it's more intrusive)

      const handleContextMenu = (e) => {
        e.preventDefault();
        localStorage.removeItem("isCompleteRender");
      };
      const disableInspect = (e) => {
        if (
          e.keyCode === 123 || // F12
          (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
          (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
          (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
          (e.metaKey && e.altKey && e.keyCode === 73) || // Cmd+Option+I (Mac)
          (e.metaKey && e.altKey && e.keyCode === 74) || // Cmd+Option+J (Mac)
          (e.metaKey && e.keyCode === 85) // Cmd+U (Mac)
        ) {
          e.preventDefault();
          localStorage.removeItem("isCompleteRender");
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", disableInspect);

      return () => {
        clearInterval(devToolsInterval);
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", disableInspect);
      };
    }
  }, []);

  if (projectMode === "prod" && window?.location?.hostname !== "localhost") {
    console.log = () => {};
    console.info = () => {};
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ContextAdmin>
        <ThemeConfig>
          <SnackbarProvider
            ref={notistackRef}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            TransitionComponent={Slide}
            maxSnack={3}
            action={(key) => (
              <div onClick={onClickDismiss(key)} className="pointer">
                <i className="fa-solid fa-xmark me-3"></i>
              </div>
            )}
          >
            <Helmet>
              <title>Testing Project</title>
              <meta name="description" content={"Testing Project"} />
            </Helmet>
            <Routers />
          </SnackbarProvider>
        </ThemeConfig>
      </ContextAdmin>
    </QueryClientProvider>
  );
}

export default App;
