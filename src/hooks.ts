import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import { useFocusStore, useDisplayStore, useFileTreeStore } from "@store/store";

export function useGlobalShortcuts() {
  const focusArea = useFocusStore((state) => state.focusArea);
  const setIsChanged = useDisplayStore((state) => state.setIsChanged);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (focusArea === "editArea") {
          invoke("update_node_contents", { id: selectedNodeId, newContents: currentFileContents })
          .then(() => {
            setIsChanged(false);
          })
          .catch((error) => {
            console.error("Failed to save file contents:", error);
          });
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusArea, currentFileContents]);
}