import { Stack, Box } from "@mui/material";

import NavBar from "./components/NavBar";
import EditArea from "./components/EditArea";
import ViewArea from "./components/ViewArea";

function App() {
  return (
    <Box width="100%" height="100vh">
      <Stack direction="row">
        <NavBar />
        <EditArea />
        <ViewArea />
      </Stack>
    </Box>
  );
}

export default App;
