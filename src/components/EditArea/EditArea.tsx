import React from "react";
import { Box, TextField } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";

import Title from "./Title";
import BlankPage from "../BlankPage";
import { useDisplayStore, useFileTreeStore } from "@store/store";
import { useTranslation } from "react-i18next";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { NodeData } from "@type/types";

function EditArea() {
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const setCurrentFileContents = useDisplayStore((state) => state.setCurrentFileContents);
  const setIsChanged = useDisplayStore((state) => state.setIsChanged);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const { t } = useTranslation();
  const [filename, setFilename] = React.useState<string>("");

  React.useEffect(() => {
    if (selectedNodeId) {
      invoke<NodeModel<NodeData>>("get_node_by_id", { nodeId: selectedNodeId })
        .then((node) => {
            setFilename(node.text);
        })
        .catch((error) => {
          console.error("Failed to get node by id:", error);
        });
    } else {
      setFilename("");
    }
  }, [selectedNodeId]);

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsChanged(true);
    setCurrentFileContents(e.target.value);
  }

  return (
    <Box width="41%" flexBasis={788} maxWidth={788} px={2} sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
      {selectedNodeId ? (
        <>
          <Title currentFilePath={filename} />
          <Box height="93%" overflow="auto" bgcolor="primary.main" pb={40} borderRadius={1}>
            <TextField
              multiline
              fullWidth
              focused
              variant="outlined"
              placeholder={t("edit.empty_file_prompt")}
              // rows={35}
              value={currentFileContents}
              onChange={(e) => onChangeText(e)}
              // sx={{ borderRadius: 1, bgcolor: "primary.main" }}
            />
          </Box>
        </>
      ) : (
        <BlankPage />
      )}
    </Box>
  );
}

export default EditArea;