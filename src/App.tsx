import { useEffect } from "react";
import { Stack, Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from "@tauri-apps/api/core";

import { selectTheme } from "./themes";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar/NavBar";
import EditArea from "./components/EditArea/EditArea";
import ViewArea from "./components/ViewArea";
import { useTranslation } from "react-i18next";
import { useSettingStore, useFileTreeStore } from "@store/store";
import { useDisplayStore } from "@store/store";
import { GlobalConfig, BaseException } from "@type/types";
import { useGlobalShortcuts } from "./Hooks";

function App() {
  useGlobalShortcuts();
  const settings = useSettingStore((state) => state.settings);
  const setSettings = useSettingStore((state) => state.setSettings);
  const setTheme = useSettingStore((state) => state.setTheme);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
  const { i18n, t } = useTranslation();
  const isNavBarShown = useDisplayStore((state) => state.isNavBarShown);
  const isEditAreaShown = useDisplayStore((state) => state.isEditAreaShown);

  useEffect(() => {
    invoke<GlobalConfig>("get_gconfig")
    .then((gconfig: GlobalConfig) => {
      setSettings(gconfig)
      setTheme(gconfig.color_mode)
      setLanguage(gconfig.language)
    })
    .catch((err: BaseException) => {
      console.error(err)
    })
  }, []);
  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);
  useEffect(() => {
    invoke<GlobalConfig>("get_gconfig")
    .then((gconfig: GlobalConfig) => {
      if (gconfig.current_root && gconfig.current_root.length > 0) {
        getCurrentWindow().setTitle(`${t("title")} - ${gconfig.current_root}`)
        .catch((err) => {
          console.error("Error setting window title:", err);
        });
        invoke("get_rconfig")
        .then((rconfig) => {
          setFileTreeData(rconfig as any[]);
        })
        .catch((err) => {
          console.error("Error getting root config:", err);
        });
      }
    })
  }, [settings.current_root]);

  return (
    <ThemeProvider theme={selectTheme(settings.color_mode)}>
      <CssBaseline enableColorScheme />
      <Box width="100%" height="100vh">
        <Stack direction="row" height="100%">
          {(!isNavBarShown || !isEditAreaShown) && <SideBar />}
          {isNavBarShown && <NavBar />}
          {isEditAreaShown && <EditArea />}
          <ViewArea />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
