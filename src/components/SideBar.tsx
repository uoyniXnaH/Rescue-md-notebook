import { Box, Stack, IconButton } from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EditDocumentIcon from '@mui/icons-material/EditDocument';

import { useDisplayStore, useFocusStore } from "@store/store";
import { useWindowSize } from "@src/hooks";
import { FLOATING_NAV_WIDTH } from "@src/Defines";

function SideBar() {
  const isNavBarShown = useDisplayStore((state) => state.isNavBarShown);
  const isEditAreaShown = useDisplayStore((state) => state.isEditAreaShown);
  const setFocusArea = useFocusStore((state) => state.setFocusArea);
  const { width } = useWindowSize();

  return (
    <Box onFocus={() => setFocusArea(null)} onClick={() => setFocusArea(null)} width={48} height="100%">
      <Stack direction="column" spacing={0.5}>
        {(!isNavBarShown || width < FLOATING_NAV_WIDTH) && <IconButton color="inherit" onClick={() => useDisplayStore.setState({ isNavBarShown: !isNavBarShown })}>
          <FormatListBulletedIcon />
        </IconButton>}
        {!isEditAreaShown && <IconButton color="inherit" onClick={() => useDisplayStore.setState({ isEditAreaShown: true })}>
          <EditDocumentIcon />
        </IconButton>}
      </Stack>
    </Box>
  );
}

export default SideBar;