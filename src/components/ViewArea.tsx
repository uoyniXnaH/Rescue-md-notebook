import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

import BlankPage from "./BlankPage";
import { useDisplayStore } from "../store";
import { useSettingStore } from "../store";

function ViewArea() {
  const currentFilePath = useDisplayStore((state) => state.currentFilePath);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const theme = useSettingStore((state) => state.theme);
 
  return (
    <Box width="41%" height="100%" maxWidth={788} px={1.5} className="markdown-body markdown-container">
      {currentFilePath ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <Prism
                  style={ theme === 'dark' ? atomDark : prism }
                  className={'syntax-highlighter'}
                  customStyle={{  margin: 0, background: 'transparent' }}
                  showLineNumbers={true}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </Prism>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {currentFileContents}
        </ReactMarkdown>
      ) : (
        <BlankPage />
      )}
    </Box>
  );
}

export default ViewArea;