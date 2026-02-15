import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

import RsnMermaid from "./RsnMermaid";
import BlankPage from "../BlankPage";
import { useDisplayStore, useFileTreeStore, useFocusStore } from "@store/store";
import { useSettingStore } from "@store/store";
import { useWindowSize } from "@src/hooks";

function ViewArea() {
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const currentFileContents = useDisplayStore((state) => state.currentFileContents);
  const settings = useSettingStore((state) => state.settings);
  const setFocusArea = useFocusStore((state) => state.setFocusArea);
  const { height } = useWindowSize();

  return (
    <Box onFocus={() => setFocusArea("viewArea")} onClick={() => setFocusArea("viewArea")} height="100%" flexBasis={600} flexGrow={1} px={1.5} pb={height / 10} className="markdown-body markdown-container">
      {selectedNodeId ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a({ node, children, ...props }: any) {
              try {
                new URL(props.href ?? "");
                props.target = "_blank";
                props.rel = "noopener noreferrer";
              } catch (e) { }
              return <a {...props}>{children}</a>;
            },
            input({ node, type, disabled, ...props }) {
              return <input type={type} readOnly disabled={type === 'checkbox' ? false : disabled} {...props} />;
            },
            code({ node, className, children, ref, ...props }) {
              if (className === 'language-mermaid') {
                return <RsnMermaid>{children}</RsnMermaid>;
              }
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <Prism
                  style={(settings.color_mode === 'dark' ? atomDark : prism) as any}
                  className={'syntax-highlighter'}
                  customStyle={{ margin: 0, background: 'transparent' }}
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