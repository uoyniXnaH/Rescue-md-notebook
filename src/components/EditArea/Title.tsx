import React from "react";
import { Box, Stack, IconButton, Typography, Popper } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import dayjs from "dayjs";

import RsnCalendar from "./Calendar/RsnCalendar";
import { useDisplayStore, useFileTreeStore } from "@store/store";
import { useFileActions, useWindowSize, useUnsavedWarning } from "@src/hooks";
import useTauriCmd from "@tauri/TauriCmd";

function Title() {
  const setIsEditAreaShown = useDisplayStore((state) => state.setIsEditAreaShown);
  const isChanged = useDisplayStore((state) => state.isChanged);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const fileTreeData = useFileTreeStore((state) => state.fileTreeData);
  const selectedDate = useFileTreeStore((state) => state.selectedDate);
  const setCurrentFileContents = useDisplayStore((state) => state.setCurrentFileContents);
  const setSelectedDate = useFileTreeStore((state) => state.setSelectedDate);
  const { saveFile } = useFileActions();
  const { width } = useWindowSize();
  const { unsavedWarning } = useUnsavedWarning();
  const { getNodeById, getNodeContents } = useTauriCmd();
  const [filename, setFilename] = React.useState<string>("");
  const [calendarAnchorEl, setCalendarAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isCalendarNode, setIsCalendarNode] = React.useState<boolean>(false);
  const handleCalendarToggle = (event: React.MouseEvent<HTMLElement>) => {
    setCalendarAnchorEl(calendarAnchorEl ? null : event.currentTarget);
  };

  React.useEffect(() => {
    if (selectedNodeId) {
      getNodeById(selectedNodeId)
      .then((node) => {
        setFilename(node.text);
        if (node.data?.nodeType == "calendar") {
          setIsCalendarNode(true);
        } else {
          setIsCalendarNode(false);
          setCalendarAnchorEl(null);
        }
      });
    } else {
      setFilename("");
      setIsCalendarNode(false);
    }
  }, [selectedNodeId, fileTreeData]);

  const handleSave = async () => {
    await saveFile();
  }

  return (
    <Box pt={1.5} sx={{ display: 'flex', alignItems: 'center', color: 'primary.contrastText' }}>
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" width="100%">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            noWrap
            variant="body1"
            maxWidth={width * 0.25}
            onClick={async () => {
              if (selectedDate) {
                await unsavedWarning()
                .then(async () => {
                  setSelectedDate(null);
                  setCalendarAnchorEl(null);
                  getNodeContents(selectedNodeId!)
                  .then(setCurrentFileContents);
                })
              }
            }}
            sx={{ cursor: selectedDate ? 'pointer' : 'text' }}
          >{filename}</Typography>
          {selectedDate && <>
            <KeyboardArrowRightIcon fontSize="small" />
            <Typography variant="body1">{dayjs(selectedDate).format("YY-MM-DD")}</Typography>
          </>}
          <IconButton color="inherit" onClick={handleSave} disabled={!isChanged}>
            <SaveIcon />
          </IconButton>
        </Stack>
        <Box>
          {isCalendarNode && <>
            <IconButton size="small">
              <ListAltIcon />
            </IconButton>
            <IconButton size="small" onClick={handleCalendarToggle}>
              <CalendarMonthIcon />
            </IconButton>
            <Popper
              open={Boolean(calendarAnchorEl)}
              anchorEl={calendarAnchorEl}
              placement="bottom-start"
              sx={{backgroundColor: 'secondary.main'}}
            >
              <RsnCalendar setCalendarOpen={(isOpen) => setCalendarAnchorEl(isOpen ? calendarAnchorEl : null)} />
            </Popper></>}
          <IconButton size="small" onClick={() => setIsEditAreaShown(false)}>
            <CloseFullscreenIcon />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}

export default Title;