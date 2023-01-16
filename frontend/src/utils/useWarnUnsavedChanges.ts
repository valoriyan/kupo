import Router from "next/router";
import { useEffect } from "react";
import { isServer } from "./isServer";

export const useWarnUnsavedChanges = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    if (isServer()) return;

    const warningText =
      "You have unsaved changes - are you sure you wish to leave this page?";

    const handleBrowseAway = () => {
      if (!hasUnsavedChanges) return;
      if (window.confirm(warningText)) return;
      Router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };

    if (hasUnsavedChanges) {
      window.onbeforeunload = () => true;
      Router.events.on("routeChangeStart", handleBrowseAway);
    }
    return () => {
      window.onbeforeunload = null;
      Router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [hasUnsavedChanges]);
};
