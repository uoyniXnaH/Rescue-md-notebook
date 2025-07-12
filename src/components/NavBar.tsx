import { Box } from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";

import themes from "../themes";

function NavBar() {
  return (
    <ThemeProvider theme={themes.dark}>
      <Box width={360} height="100vh" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
        <h1>Rescue Notebook</h1>
      </Box>
    </ThemeProvider>
  );
}

export default NavBar;
