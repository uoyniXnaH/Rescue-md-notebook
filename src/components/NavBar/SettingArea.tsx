import { Box, Stack, ToggleButton, ToggleButtonGroup, Select, MenuItem } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';

import { useSettingStore, useFocusStore } from "@store/store";
import { LANGUAGE } from "@src/Defines";
import { invoke } from "@tauri-apps/api/core";

function SettingArea() {
  const settings = useSettingStore((state) => state.settings);
  const getSettings = useSettingStore((state) => state.getSettings);
  const setTheme = useSettingStore((state) => state.setTheme);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const setFocusArea = useFocusStore((state) => state.setFocusArea);
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
              await invoke("set_gconfig", { config: getSettings() });
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
          <LanguageIcon />
          <Select
            value={settings.language}
            onChange={async (e) => {
              setLanguage(e.target.value)
              await invoke("set_gconfig", { config: getSettings() });
            }}
            size="small"
          >
            {Object.keys(LANGUAGE).map((lang) => (
              <MenuItem key={lang} value={lang}>
                {LANGUAGE[lang as keyof typeof LANGUAGE]}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SettingArea;
