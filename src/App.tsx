import { useEffect } from "react";
import { Stack, Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getCurrentWindow } from '@tauri-apps/api/window';

import { selectTheme } from "./themes";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar/NavBar";
import EditArea from "./components/EditArea/EditArea";
import ViewArea from "./components/ViewArea";
import { useTranslation } from "react-i18next";
import { useSettingStore, useFileTreeStore } from "@store/store";
import { useDisplayStore } from "@store/store";
import { useGlobalShortcuts, useContextMenu } from "./hooks";
import useTauriCmd from "@tauri/TauriCmd";

function App() {
  useGlobalShortcuts();
  const settings = useSettingStore((state) => state.settings);
  const setSettings = useSettingStore((state) => state.setSettings);
  const setTheme = useSettingStore((state) => state.setTheme);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
  const setCtxMenuId = useFileTreeStore((state) => state.setCtxMenuId);
  const { popUpCtxMenu } = useContextMenu();
  const { i18n, t } = useTranslation();
  const isNavBarShown = useDisplayStore((state) => state.isNavBarShown);
  const isEditAreaShown = useDisplayStore((state) => state.isEditAreaShown);
  const { getGlobalConfig, getRootConfig } = useTauriCmd();

  useEffect(() => {
    getGlobalConfig()
    .then((gconfig) => {
        setSettings(gconfig);
        setTheme(gconfig.color_mode);
        setLanguage(gconfig.language);
    });
  }, []);
  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);
  useEffect(() => {
    getGlobalConfig()
    .then((gconfig) => {
      if (gconfig.current_root && gconfig.current_root.length > 0) {
        getCurrentWindow().setTitle(`${t("title")} - ${gconfig.current_root}`)
        .catch((err) => {
          console.error("Error setting window title:", err);
        });
      }
    })
    getRootConfig()
    .then((rconfig) => {
      setFileTreeData(rconfig);
    });
  }, [settings.current_root]);

  return (
    <ThemeProvider theme={selectTheme(settings.color_mode)}>
      <CssBaseline enableColorScheme />
      <Box onClick={() => setCtxMenuId(null)} onContextMenu={popUpCtxMenu} width="100%" height="100vh">
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
