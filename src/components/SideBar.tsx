import { Box, Stack, IconButton } from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EditDocumentIcon from '@mui/icons-material/EditDocument';

import { useDisplayStore } from "@store/store";

function SideBar() {
  const isNavBarShown = useDisplayStore((state) => state.isNavBarShown);
  const isEditAreaShown = useDisplayStore((state) => state.isEditAreaShown);

  return (
    <Box width={48} height="100%">
      <Stack direction="column" spacing={0.5}>
        {!isNavBarShown && <IconButton color="inherit" onClick={() => useDisplayStore.setState({ isNavBarShown: true })}>
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