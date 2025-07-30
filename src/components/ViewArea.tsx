import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import BlankPage from "./BlankPage";
import { useDisplayStore } from "../store";

function ViewArea() {
  const currentFilePath = useDisplayStore((state) => state.currentFilePath);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
 
  return (
    <Box width="41%" maxWidth={788} px={1.5} className="markdown-body">
      {currentFilePath ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, {detect: true, ignoreMissing: true}]]}>
          {currentFileContents}
        </ReactMarkdown>
      ) : (
        <BlankPage />
      )}
    </Box>
  );
}

export default ViewArea;