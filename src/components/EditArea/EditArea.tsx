import { Box, TextField } from "@mui/material";

import Title from "./Title";
import BlankPage from "../BlankPage";
import { useDisplayStore } from "../../store";

function EditArea() {
  const currentFilePath = useDisplayStore((state) => state.currentFilePath);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);

  return (
    <Box width="41%" maxWidth={788} px={2} sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
      {currentFilePath ? (
        <>
          <Title currentFilePath={currentFilePath} />
          <TextField
            multiline
            fullWidth
            variant="outlined"
            placeholder="Start writing your notes..."
            rows={35}
            value={currentFileContents}
            sx={{ borderRadius: 1, bgcolor: "primary.main" }}
          />
        </>
      ) : (
        <BlankPage />
      )}
    </Box>
  );
}

export default EditArea;