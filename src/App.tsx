import { useEffect } from "react";
import { Stack, Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/plugin-dialog';

import { selectTheme } from "./themes";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar/NavBar";
import EditArea from "./components/EditArea/EditArea";
import ViewArea from "./components/ViewArea";
import { useModal } from "./components/Modal";
import { useTranslation } from "react-i18next";
import { useSettingStore, useFileTreeStore } from "@store/store";
import { useDisplayStore } from "@store/store";
import { useGlobalShortcuts, useContextMenu, useWindowSize } from "./hooks";
import useTauriCmd from "@tauri/TauriCmd";
import { FLOATING_NAV_WIDTH } from "./Defines";
import { use } from "i18next";

function App() {
  useGlobalShortcuts();
  const settings = useSettingStore((state) => state.settings);
  const getSettings = useSettingStore((state) => state.getSettings);
  const setSettings = useSettingStore((state) => state.setSettings);
  const setCurrentRoot = useSettingStore((state) => state.setCurrentRoot);
  const setTheme = useSettingStore((state) => state.setTheme);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
  const setCtxMenuId = useFileTreeStore((state) => state.setCtxMenuId);
  const { popUpCtxMenu } = useContextMenu();
  const { i18n, t } = useTranslation();
  const isNavBarShown = useDisplayStore((state) => state.isNavBarShown);
  const isEditAreaShown = useDisplayStore((state) => state.isEditAreaShown);
  const { getGlobalConfig, getRootConfig, setGlobalConfig } = useTauriCmd();
  const { showBasicModal, showMessageModal } = useModal();
  const { width } = useWindowSize();

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language]);

  useEffect(() => {
    getGlobalConfig()
    .then((gconfig) => {
      setSettings(gconfig);
      setTheme(gconfig.color_mode);
      setLanguage(gconfig.language);

      if (gconfig.current_root && gconfig.current_root.length > 0) {
        getRootConfig().then(setFileTreeData);
      } else {
        showBasicModal({
          contents: [t("modal.root_not_set")],
          rightButtonText: t("modal.set_root"),
          onRightButtonClick: async () => {
            const selected = await open({
              directory: true,
              multiple: false,
            });
            if (selected && typeof selected === "string") {
              setCurrentRoot(selected);
              await setGlobalConfig(getSettings())
              .then(async () => {
                await getRootConfig().then(setFileTreeData);
              });
            }
          }
        })
      }
    });
  }, []);

  useEffect(() => {
      getCurrentWindow().setTitle(`${t("title")} - ${settings.current_root}`)
      .catch(() => {
        showMessageModal({
          contents: t("exceptions.set_title_failed")
        });
      });
  }, [settings.current_root]);

  return (
    <ThemeProvider theme={selectTheme(settings.color_mode)}>
      <CssBaseline enableColorScheme />
      <Box onClick={() => setCtxMenuId(null)} onContextMenu={popUpCtxMenu} width="100%" height="100vh">
        <Stack direction="row" height="100%">
          {(!isNavBarShown || !isEditAreaShown || width < FLOATING_NAV_WIDTH) && <SideBar />}
          {isNavBarShown && <NavBar />}
          {isEditAreaShown && <EditArea />}
          <ViewArea />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
