import React from "react";
import { Box, Stack, IconButton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { invoke } from "@tauri-apps/api/core";

import { useDisplayStore, useFileTreeStore } from "@store/store";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { NodeData } from "@type/types";

function Title() {
  const setIsEditAreaShown = useDisplayStore((state) => state.setIsEditAreaShown);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const isChanged = useDisplayStore((state) => state.isChanged);
  const setIsChanged = useDisplayStore((state) => state.setIsChanged);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
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

  const handleSave = async () => {
    await invoke("update_node_contents", { id: selectedNodeId, newContents: currentFileContents })
    .then(() => {
      setIsChanged(false);
    })
    .catch((error) => {
      console.error("Failed to save file contents:", error);
    });
  }

  return (
    <Box pt={1.5} sx={{ display: 'flex', alignItems: 'center', color: 'primary.contrastText' }}>
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" width="100%">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body1">{filename}</Typography>
          <IconButton color="inherit" onClick={handleSave} disabled={!isChanged}>
            <SaveIcon />
          </IconButton>
        </Stack>
        <IconButton size="small" onClick={() => setIsEditAreaShown(false)}>
          <CloseFullscreenIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default Title;