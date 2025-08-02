import { Box, Stack, Typography, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import FileTree from "./FileTree/FileTree";
import SettingArea from "./SettingArea";
import { useTranslation } from "react-i18next";
import { VERSION } from "@src/Defines";

function NavBar() {
  const { t } = useTranslation();
  return (
    <Box width="18%" maxWidth={360} sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
      <Stack py={1.5} px={2} spacing={2} height="100%">
        {/* Title */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6">{t("title")}</Typography>
            <Typography color="info.contrastText" variant="body2">{t("nav.version")}{VERSION}</Typography>
          </Box>
          <Box>
            <IconButton size="small"><CloseFullscreenIcon /></IconButton>
          </Box>
        </Stack>
        {/* Root file tree */}
        <Box flexGrow={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <HomeIcon sx={{ color: "info.contrastText" }} />
            <Typography variant="h6" color="info.contrastText">
              {t("nav.root")}
            </Typography>
          </Stack>
          <FileTree />
        </Box>
        {/* Settings */}
        <SettingArea />
      </Stack>
    </Box>
  );
}

export default NavBar;
