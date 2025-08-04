import React from 'react';
import { Box, Stack, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import FileTree from "./FileTree/FileTree";
import SettingArea from "./SettingArea";
import { useTranslation } from "react-i18next";
import { useDisplayStore } from "@store/store";
import { VERSION } from "@src/Defines";

type RootMenuProps = {
  isOpen: boolean;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
};
const RootMenu: React.FC<RootMenuProps> = (props: RootMenuProps) => {
  const { isOpen, anchorEl, handleClose } = props;
  const { t } = useTranslation();

  return (
    <Menu
      id="root-menu"
      open={isOpen}
      onClose={handleClose}
      anchorEl={anchorEl}
    >
      <MenuItem onClick={handleClose}>
        <Typography variant="body2">{t("nav.change_root")}</Typography>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Typography variant="body2">{t("nav.open_root")}</Typography>
      </MenuItem>
    </Menu>
  );
}

function NavBar() {
  const { t } = useTranslation();
  const setIsNavBarShown = useDisplayStore((state) => state.setIsNavBarShown);
  const [isRootMenuOpen, setIsRootMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  return (
    <Box width="18%" maxWidth={360} borderRight="1px solid" borderColor="secondary.main" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
      <Stack py={1.5} px={2} spacing={2} height="100%">
        {/* Title */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6">{t("title")}</Typography>
            <Typography color="info.contrastText" variant="body2">{t("nav.version")}{VERSION}</Typography>
          </Box>
          <Box>
            <IconButton size="small" onClick={() => setIsNavBarShown(false)}><CloseFullscreenIcon /></IconButton>
          </Box>
        </Stack>
        {/* Root file tree */}
        <Box flexGrow={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <HomeIcon sx={{ color: "info.contrastText" }} />
            <Typography variant="h6" color="info.contrastText">
              {t("nav.root")}
            </Typography>
            <IconButton
              size="small"
              sx={{ color: "info.contrastText" }}
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
                setIsRootMenuOpen(true);
              }}
            ><ExpandMoreIcon /></IconButton>
            <RootMenu
              isOpen={isRootMenuOpen}
              anchorEl={anchorEl}
              handleClose={() => setIsRootMenuOpen(false)}
            />
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
