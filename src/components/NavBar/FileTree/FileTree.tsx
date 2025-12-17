import React from 'react';
import { Box } from '@mui/material';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  NodeModel,
  DropOptions,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";

import CustomNode from "./CustomNode";
import CustomDragPreview from "./CustomDragPreview";
import { useFileTreeStore } from '@store/store';
import { NodeData } from "@type/types";
import styles from "./FileTree.module.css";

type Props = {
  node: NodeModel;
  depth: number;
};

const Placeholder: React.FC<Props> = (props) => {
  const left = props.depth * 15;
  return <Box sx={{
    height: 2,
    position: "absolute",
    left: left,
    right: 0,
    top: 0,
    transform: "translateY(-50%)",
    backgroundColor: "info.main",
  }}></Box>;
};

export default function FileTree() {
  // const getFileTreeData = useFileTreeStore((state) => state.getFileTreeData);
  const fileTreeData = useFileTreeStore((state) => state.fileTreeData);
  const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
  const handleDrop = (newTreeData: NodeModel<NodeData>[], options: DropOptions<NodeData>) => {
    console.log(`current parent:${options.dragSource?.parent}, new parent: ${options.dropTargetId}`);
    setFileTreeData(newTreeData);
  };
  return (
    <Box overflow="auto" height="95%" pl={1.5}>
      {/* <Button variant="contained" onClick={()=>console.log(fileTreeData)}>Touch!</Button> */}
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Box height="95%">
          <Tree
            tree={fileTreeData}
            rootId={0}
            render={(node, { depth, isOpen, onToggle }) => (
              <CustomNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <CustomDragPreview monitorProps={monitorProps} />
            )}
            onDrop={handleDrop}
            classes={{
              root: styles.treeRoot,
              draggingSource: styles.draggingSource,
              placeholder: styles.placeholderContainer
            }}
            sort={false}
            insertDroppableFirst={false}
            canDrop={(_tree, { dragSource, dropTargetId }) => {
              if (dragSource?.parent === dropTargetId) {
                return true;
              }
            }}
            dropTargetOffset={10}
            placeholderRender={(node, { depth }) => (
              <Placeholder node={node} depth={depth} />
            )}
          />
        </Box>
      </DndProvider>
    </Box>
  );
}
