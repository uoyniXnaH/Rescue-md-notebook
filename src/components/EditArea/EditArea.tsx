import React from "react";
import { Box, TextField } from "@mui/material";

import Title from "./Title";
import BlankPage from "../BlankPage";
import { useDisplayStore, useFileTreeStore, useFocusStore } from "@store/store";
import { useTranslation } from "react-i18next";

function EditArea() {
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const setCurrentFileContents = useDisplayStore((state) => state.setCurrentFileContents);
  const setIsChanged = useDisplayStore((state) => state.setIsChanged);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const setFocusArea = useFocusStore((state) => state.setFocusArea);
  const { t } = useTranslation();

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsChanged(true);
    setCurrentFileContents(e.target.value);
  }

  return (
    <Box onFocus={() => setFocusArea("editArea")} onClick={() => setFocusArea("editArea")} width="41%" flexBasis={788} maxWidth={788} px={2} sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
      {selectedNodeId ? (
        <>
          <Title />
          <Box height="93%" overflow="auto" bgcolor="primary.main" pb={40} borderRadius={1}>
            <TextField
              multiline
              fullWidth
              focused
              variant="outlined"
              placeholder={t("edit.empty_file_prompt")}
              // rows={35}
              value={currentFileContents}
              onChange={(e) => onChangeText(e)}
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