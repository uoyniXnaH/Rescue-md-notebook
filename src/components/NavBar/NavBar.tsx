import React from 'react';
import { Box, Stack, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { open } from '@tauri-apps/plugin-dialog';

import FileTree from "./FileTree/FileTree";
import SettingArea from "./SettingArea";
import { useTranslation } from "react-i18next";
import { useDisplayStore, useSettingStore, useFileTreeStore, useFocusStore } from "@store/store";
import { useFileActions, useWindowSize } from "@src/hooks";
import { useModal } from "../Modal";
import useTauriCmd from "@tauri/TauriCmd";
import { NodeEnum } from '@type/types';
import { VERSION, NODE_TYPE, FLOATING_NAV_WIDTH, MINI_NAV_WIDTH } from "@src/Defines";

type RootMenuProps = {
  isOpen: boolean;
  anchorEl: null | HTMLElement;
  handleClose: (type?: NodeEnum) => void;
};
const RootMenu: React.FC<RootMenuProps> = (props: RootMenuProps) => {
  const { isOpen, anchorEl, handleClose } = props;
  const setCurrentRoot = useSettingStore((state) => state.setCurrentRoot);
  const getSettings = useSettingStore((state) => state.getSettings);
  const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
  const { setGlobalConfig, getRootConfig, resetRootConfig, openInExplorer } = useTauriCmd();
  const { showBasicModal } = useModal();
  const { t } = useTranslation();

  return (
    <Menu
      id="root-menu"
      open={isOpen}
      onAbort={() => handleClose()}
      onClose={() => handleClose()}
      anchorEl={anchorEl}
    >
      {NODE_TYPE.map((type) => (
        <MenuItem key={type} onClick={() => handleClose(type)}>
          <Typography variant="body2">{t("nav.new")}{t(`nav.${type}`)}</Typography>
        </MenuItem>
      ))}
      <MenuItem component="label" onClick={async () => {
        handleClose();
        const selected = await open({
          directory: true,
          multiple: false,
        });
        if (selected && typeof selected === "string") {
          setCurrentRoot(selected);
          await setGlobalConfig(getSettings())
          .then(async () => {
            await getRootConfig()
            .then(async (filetree) => {
              setFileTreeData(filetree);
            });
          });
        }
      }}>
        <Typography variant="body2">{t("nav.change_root")}</Typography>
      </MenuItem>
      <MenuItem onClick={() => {openInExplorer(0);handleClose();}}>
        <Typography variant="body2">{t("nav.open_root")}</Typography>
      </MenuItem>
      <MenuItem onClick={() => {
        showBasicModal({
          contents: t("modal.confirm_reset_rconfig"),
          leftButtonText: t("modal.cancel"),
          rightButtonText: t("modal.reset"),
          onLeftButtonClick: () => {},
          onRightButtonClick: async () => {
            await resetRootConfig()
            .then(async (filetree) => {
              setFileTreeData(filetree);
            });
          }
        });
        handleClose();
      }}>
        <Typography variant="body2">{t("nav.fix_root")}</Typography>
      </MenuItem>
    </Menu>
  );
}

function NavBar() {
  const { t } = useTranslation();
  const setIsNavBarShown = useDisplayStore((state) => state.setIsNavBarShown);
  const setFocusArea = useFocusStore((state) => state.setFocusArea);
  const { createNode } = useFileActions();
  const { width, height } = useWindowSize();
  const [isRootMenuOpen, setIsRootMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  return (
    <Box width="18%" minWidth={198} maxWidth={360} borderRight="1px solid" borderColor="secondary.main" sx={{
      bgcolor: "primary.main",
      color: "primary.contrastText",
      position: width < FLOATING_NAV_WIDTH ? "absolute" : "relative",
      height: "100vh",
      left: width < FLOATING_NAV_WIDTH ? 40 : 0,
      zIndex: 10,
    }}>
      <Stack py={1.5} px={2} spacing={2} height="100%">
        {/* Title */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" height={52}>
          <Box>
            <Typography variant={width < MINI_NAV_WIDTH ? "body1" : "h6"}>{t("title")}</Typography>
            <Typography color="info.contrastText" variant="body2">{t("nav.version")}{VERSION}</Typography>
          </Box>
          {width >= FLOATING_NAV_WIDTH && <Box>
            <IconButton size="small" onClick={() => setIsNavBarShown(false)}><CloseFullscreenIcon /></IconButton>
          </Box>}
        </Stack>
        {/* Root file tree */}
        <Box onFocus={() => setFocusArea("navBar")} onClick={() => setFocusArea("navBar")} height={height - 112} overflow="auto">
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
              handleClose={(type) => {
                setIsRootMenuOpen(false);
                if (type) {
                  createNode(0, "New Node", type);
                }
              }}
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
