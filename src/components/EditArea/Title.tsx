import React from "react";
import { Box, Stack, IconButton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import { useDisplayStore, useFileTreeStore } from "@store/store";
import { useFileActions } from "@src/Hooks";
import useTauriCmd from "@tauri/TauriCmd";

function Title() {
  const setIsEditAreaShown = useDisplayStore((state) => state.setIsEditAreaShown);
  const isChanged = useDisplayStore((state) => state.isChanged);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const fileTreeData = useFileTreeStore((state) => state.fileTreeData);
  const { saveFile } = useFileActions();
  const { getNodeById } = useTauriCmd();
  const [filename, setFilename] = React.useState<string>("");

  React.useEffect(() => {
    if (selectedNodeId) {
      getNodeById(selectedNodeId)
      .then((node) => {
          setFilename(node.text);
      });
    } else {
      setFilename("");
    }
  }, [selectedNodeId, fileTreeData]);

  const handleSave = async () => {
    await saveFile();
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