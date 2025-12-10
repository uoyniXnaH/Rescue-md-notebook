import { useEffect } from "react";
import { Stack, Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { invoke } from "@tauri-apps/api/core";

import { selectTheme } from "./themes";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar/NavBar";
import EditArea from "./components/EditArea/EditArea";
import ViewArea from "./components/ViewArea";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "@store/store";
import { useDisplayStore } from "@store/store";
import { GlobalConfig, BaseException } from "@type/types";

function App() {
  const theme = useSettingStore((state) => state.theme);
  const language = useSettingStore((state) => state.language);
  const setTheme = useSettingStore((state) => state.setTheme);
  const setLanguage = useSettingStore((state) => state.setLanguage);
  const { i18n } = useTranslation();
  const isNavBarShown = useDisplayStore((state) => state.isNavBarShown);
  const isEditAreaShown = useDisplayStore((state) => state.isEditAreaShown);

  useEffect(() => {
    invoke<String>("test_command")
    .then((msg: String) => {
      console.log(msg)
    })
    .catch((err: unknown) => {
      console.error(err)
    })

    invoke<GlobalConfig>("get_gconfig")
    .then((gconfig: GlobalConfig) => {
      console.log(gconfig)
      setTheme(gconfig.color_mode)
      setLanguage(gconfig.language)
    })
    .catch((err: BaseException) => {
      console.error(err)
    })
  }, []);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <ThemeProvider theme={selectTheme(theme)}>
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
