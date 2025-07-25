import { Box, TextField } from "@mui/material";

import Title from "./Title";

function EditArea() {
  return (
    <Box width="41%" maxWidth={788} px={2} sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
      <Title />
      <TextField
        multiline
        fullWidth
        variant="outlined"
        placeholder="Start writing your notes..."
        rows={35}
        maxRows={35}
        sx={{ borderRadius: 1 }}
      />
    </Box>
  );
}

export default EditArea;