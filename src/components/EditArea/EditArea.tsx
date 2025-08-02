import { Box, TextField } from "@mui/material";

import Title from "./Title";
import BlankPage from "../BlankPage";
import { useDisplayStore } from "@store/store";

function EditArea() {
  const currentFilePath = useDisplayStore((state) => state.currentFilePath);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);

  return (
    <Box width="41%" flexBasis={788} maxWidth={788} px={2} sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
      {currentFilePath ? (
        <>
          <Title currentFilePath={currentFilePath} />
          <Box height="93%" overflow="auto" bgcolor="primary.main" pb={40} borderRadius={1}>
            <TextField
              multiline
              fullWidth
              focused
              variant="outlined"
              placeholder="Start writing your notes..."
              // rows={35}
              value={currentFileContents}
              // sx={{ borderRadius: 1, bgcolor: "primary.main" }}
            />
          </Box>
        </>
      ) : (
        <BlankPage />
      )}
    </Box>
  );
}

export default EditArea;