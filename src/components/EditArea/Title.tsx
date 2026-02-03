import React from "react";
import { Box, Stack, IconButton, Typography, Popper } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import RsnCalendar from "./Calendar/RsnCalendar";
import { useDisplayStore, useFileTreeStore } from "@store/store";
import { useFileActions } from "@src/hooks";
import useTauriCmd from "@tauri/TauriCmd";

function Title() {
  const setIsEditAreaShown = useDisplayStore((state) => state.setIsEditAreaShown);
  const isChanged = useDisplayStore((state) => state.isChanged);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const fileTreeData = useFileTreeStore((state) => state.fileTreeData);
  const { saveFile } = useFileActions();
  const { getNodeById } = useTauriCmd();
  const [filename, setFilename] = React.useState<string>("");
  const [calendarAnchorEl, setCalendarAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showCalendarIcon, setShowCalendarIcon] = React.useState<boolean>(false);
  const handleCalendarToggle = (event: React.MouseEvent<HTMLElement>) => {
    setCalendarAnchorEl(calendarAnchorEl ? null : event.currentTarget);
  };

  React.useEffect(() => {
    if (selectedNodeId) {
      getNodeById(selectedNodeId)
      .then((node) => {
          setFilename(node.text);
          setShowCalendarIcon(node.data?.nodeType == "calendar");
      });
    } else {
      setFilename("");
      setShowCalendarIcon(false);
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
        <Box>
          {showCalendarIcon && <IconButton size="small" onClick={handleCalendarToggle}>
              <CalendarMonthIcon />
            </IconButton>}
          <Popper
            open={Boolean(calendarAnchorEl)}
            anchorEl={calendarAnchorEl}
            placement="bottom-start"
            sx={{backgroundColor: 'secondary.main'}}
          >
            <RsnCalendar />
          </Popper>
          <IconButton size="small" onClick={() => setIsEditAreaShown(false)}>
            <CloseFullscreenIcon />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}

export default Title;