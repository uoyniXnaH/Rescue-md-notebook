import { Stack, Box, CssBaseline } from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";

import themes from "./themes";
import NavBar from "./components/NavBar/NavBar";
import EditArea from "./components/EditArea";
import ViewArea from "./components/ViewArea";

function App() {
  return (
    <ThemeProvider theme={themes.dark}>
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
