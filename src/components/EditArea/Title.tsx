import { Box, Stack, IconButton, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

type TitleProps = {
  currentFilePath: string;
};
function Title(props: TitleProps) {
  const { currentFilePath } = props;
  const filename = currentFilePath.split('/').pop() || "Untitled";

  const handleSave = () => {
    console.log("save")
  }

  return (
    <Box pt={1.5} sx={{ display: 'flex', alignItems: 'center', color: 'primary.contrastText' }}>
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" width="100%">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body1">{filename}</Typography>
          <IconButton color="inherit" onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </Stack>
        <IconButton size="small">
          <CloseFullscreenIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}

export default Title;