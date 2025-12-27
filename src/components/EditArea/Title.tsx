import { Box, Stack, IconButton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import { useDisplayStore } from "@store/store";

type TitleProps = {
  currentFilePath: string;
};
function Title(props: TitleProps) {
  const { currentFilePath } = props;
  const filename = currentFilePath.split('/').pop() || "Untitled";
  const setIsEditAreaShown = useDisplayStore((state) => state.setIsEditAreaShown);
  const isChanged = useDisplayStore((state) => state.isChanged);
  const setIsChanged = useDisplayStore((state) => state.setIsChanged);

  const handleSave = () => {
    setIsChanged(false);
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