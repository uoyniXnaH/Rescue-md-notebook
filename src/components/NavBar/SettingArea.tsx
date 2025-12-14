import { Box, Stack, ToggleButton, ToggleButtonGroup, Select, MenuItem } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';

import { useSettingStore } from "@store/store";
import { LANGUAGE } from "@src/Defines";

function SettingArea() {
  const settings = useSettingStore((state) => state.settings);
  const getSettings = useSettingStore((state) => state.getSettings);
  const setTheme = useSettingStore((state) => state.setTheme);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  return (
    <Box width="100%" height={60} alignSelf="center">
      <Stack height="100%" direction="row" spacing={4} alignItems="center" px={2}>
        {/* Theme Selector */}
        <ToggleButtonGroup
          value={settings.color_mode}
          exclusive
          onChange={(_, newTheme) => {
            if (newTheme) {
              useSettingStore.setState({ theme: newTheme });
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
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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
