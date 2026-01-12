import React from "react";
import { Box, Stack, ToggleButton, ToggleButtonGroup, Select, Menu, MenuItem, IconButton } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';

import { useSettingStore, useFocusStore } from "@store/store";
import useTauriCmd from "@tauri/TauriCmd";
import { useWindowSize } from "@src/hooks";
import { LANGUAGE, MINI_LANG_WIDTH } from "@src/Defines";

type MiniLangIconProps = {
  isOpen: boolean;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
};
const MiniLangMenu: React.FC<MiniLangIconProps> = (props) => {
  const { isOpen, anchorEl, handleClose } = props;
  const getSettings = useSettingStore((state) => state.getSettings);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const { setGlobalConfig } = useTauriCmd();

  return (
    <Menu
      id="mini-lang-menu"
      open={isOpen}
      onAbort={() => handleClose()}
      onClose={() => handleClose()}
      anchorEl={anchorEl}
    >
      {Object.keys(LANGUAGE).map((lang) => (
        <MenuItem key={lang} value={lang} onClick={() => {
          handleClose();
          setLanguage(lang as keyof typeof LANGUAGE);
          setGlobalConfig(getSettings());
        }}>
          {LANGUAGE[lang as keyof typeof LANGUAGE]}
        </MenuItem>
      ))}
    </Menu>
  );
}

function SettingArea() {
  const settings = useSettingStore((state) => state.settings);
  const getSettings = useSettingStore((state) => state.getSettings);
  const setTheme = useSettingStore((state) => state.setTheme);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const setFocusArea = useFocusStore((state) => state.setFocusArea);
  const { setGlobalConfig } = useTauriCmd();
  const { width } = useWindowSize();
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <Box onFocus={() => setFocusArea(null)} onClick={() => setFocusArea(null)} width="100%" height={60} alignSelf="center">
      <Stack height="100%" direction="row" spacing={4} alignItems="center" px={2}>
        {/* Theme Selector */}
        <ToggleButtonGroup
          value={settings.color_mode}
          exclusive
          onChange={async (_, newTheme) => {
            if (newTheme) {
              setTheme(newTheme);
              await setGlobalConfig(getSettings());
            }
          }}
          aria-label="color-mode"
          size="small"
        >
          <ToggleButton value="light" aria-label="light">
            <LightModeIcon />
          </ToggleButton>
          <ToggleButton value="dark" aria-label="dark">
            <DarkModeIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Language Selector */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {width > MINI_LANG_WIDTH
            ? <LanguageIcon />
            : <IconButton size="small" onClick={(e) => {
                setLangAnchorEl(e.currentTarget);
                setIsLangMenuOpen(true);
              }}><LanguageIcon /></IconButton>
          }
          <MiniLangMenu
            isOpen={isLangMenuOpen}
            anchorEl={langAnchorEl}
            handleClose={() => setIsLangMenuOpen(false)}
          />
          {width > MINI_LANG_WIDTH && <Select
            value={settings.language}
            onChange={async (e) => {
              setLanguage(e.target.value)
              await setGlobalConfig(getSettings());
            }}
            size="small"
          >
            {Object.keys(LANGUAGE).map((lang) => (
              <MenuItem key={lang} value={lang}>
                {LANGUAGE[lang as keyof typeof LANGUAGE]}
              </MenuItem>
            ))}
          </Select>}
        </Stack>
      </Stack>
    </Box>
  );
}

export default SettingArea;
