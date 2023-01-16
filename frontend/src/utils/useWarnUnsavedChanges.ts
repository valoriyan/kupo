import Router from "next/router";
import { useCallback, useEffect } from "react";
import { isServer } from "./isServer";

const WARNING_TEXT =
  "You have unsaved changes - are you sure you wish to leave this page?";

export const useWarnUnsavedChanges = (hasUnsavedChanges: boolean) => {
  const handleBrowseAway = useCallback(() => {
    if (!hasUnsavedChanges) return;
    if (window.confirm(WARNING_TEXT)) return;
    Router.events.emit("routeChangeError");
    throw "routeChange aborted.";
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (isServer()) return;

    if (hasUnsavedChanges) {
      window.onbeforeunload = () => true;
      Router.events.on("routeChangeStart", handleBrowseAway);
    }
    return () => {
      window.onbeforeunload = null;
      Router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [handleBrowseAway, hasUnsavedChanges]);

  const clearWarning = () => {
    window.onbeforeunload = null;
    Router.events.off("routeChangeStart", handleBrowseAway);
  };

  return clearWarning;
};
