import { Box } from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";

import themes from "../themes";

function ViewArea() {
  return (
    <ThemeProvider theme={themes.dark}>
      <Box width={780} sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
        <h1>Rescue Notebook</h1>
      </Box>
    </ThemeProvider>
  );
}

export default ViewArea;