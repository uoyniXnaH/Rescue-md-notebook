import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import { useFocusStore, useDisplayStore, useFileTreeStore } from "@store/store";

export function useGlobalShortcuts() {
  const focusArea = useFocusStore((state) => state.focusArea);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const { saveFile } = useFileActions();

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (focusArea === "editArea") {
          await saveFile();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusArea, currentFileContents]);
}

export function useFileActions() {
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const setIsChanged = useDisplayStore((state) => state.setIsChanged);

  const saveFile = async () => {
    if (selectedNodeId) {
      await invoke("update_node_contents", { id: selectedNodeId, newContents: currentFileContents })
      .then(() => {
        setIsChanged(false);
      })
      .catch((error) => {
        console.error("Failed to save file contents:", error);
      });
    }
  };

  return { saveFile };
}