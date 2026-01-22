import React from "react";
import { Box, TextField } from "@mui/material";

import Title from "./Title";
import BlankPage from "../BlankPage";
import { useDisplayStore, useFileTreeStore, useFocusStore } from "@store/store";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@src/hooks";

function EditArea() {
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const setCurrentFileContents = useDisplayStore((state) => state.setCurrentFileContents);
  const setIsChanged = useDisplayStore((state) => state.setIsChanged);
  const setEditAreaEl = useDisplayStore((state) => state.setEditAreaEl);
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const setFocusArea = useFocusStore((state) => state.setFocusArea);
  const { height } = useWindowSize();
  const { t } = useTranslation();
  const inputEl = React.useRef<HTMLTextAreaElement>(null);
  const [ lines, setLines ] = React.useState(0);

  const onChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsChanged(true);
    setCurrentFileContents(e.target.value);
  }

  React.useEffect(() => {
    if (currentFileContents) {
      setLines(currentFileContents.split('\n').length);
    } else {
      setLines(0);
    }
  }, [selectedNodeId, currentFileContents]);

  React.useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
      setEditAreaEl(inputEl.current);
    }
  }, [inputEl.current]);

  return (
    <Box onFocus={() => setFocusArea("editArea")} onClick={() => setFocusArea("editArea")} width="41%" height="100%" flexBasis={788} maxWidth={788} px={2} sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
      {selectedNodeId ? (
        <>
          <Title />
          <Box height={height - 64} overflow="auto" bgcolor="primary.main" borderRadius={1}>
              <TextField
              inputRef={inputEl}
              multiline
              fullWidth
              focused
              variant="outlined"
              placeholder={t("edit.empty_file_prompt")}
              rows={Math.floor(height * 0.8 / 24) + lines - 1}
              value={currentFileContents}
              onChange={(e) => onChangeText(e)}
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