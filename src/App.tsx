import { useEffect } from "react";
import { Stack, Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { selectTheme } from "./themes";
import NavBar from "./components/NavBar/NavBar";
import EditArea from "./components/EditArea/EditArea";
import ViewArea from "./components/ViewArea";
import { useTranslation } from "react-i18next";
import { useSettingStore } from "./store";

function App() {
  const theme = useSettingStore((state) => state.theme);
  const language = useSettingStore((state) => state.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <ThemeProvider theme={selectTheme(theme)}>
      <CssBaseline enableColorScheme />
      <Box width="100%" height="100vh">
        <Stack direction="row" height="100%">
          <NavBar />
          <EditArea />
          <ViewArea />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
