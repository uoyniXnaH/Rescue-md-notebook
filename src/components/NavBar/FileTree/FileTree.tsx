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
import useTauriCmd from '@tauri/TauriCmd';
import { NodeData } from "@type/types";
import styles from "./FileTree.module.css";

type Props = {
  node: NodeModel<NodeData>;
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

function getOpenedNodes(treeData: NodeModel<NodeData>[]): (string | number)[] {
  let openedNodes: (string | number)[] = [];
  treeData.forEach((node) => {
    if (node.droppable && node.data?.isOpen) {
      openedNodes.push(node.id);
    }
  });
  return openedNodes;
}

export default function FileTree() {
  const fileTreeData = useFileTreeStore((state) => state.fileTreeData);
  const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
  const { setRootConfig, moveNode } = useTauriCmd();
  const handleDrop = async (newTreeData: NodeModel<NodeData>[], options: DropOptions<NodeData>) => {
    let currentParent = options.dragSource?.parent;
    let newParent = options.dropTargetId;
    if (currentParent == newParent) {
      await setRootConfig(newTreeData)
      .then(() => {
        setFileTreeData(newTreeData);
      });
    } else {
      await moveNode(
        options.dragSource!.id,
        newParent,
        newTreeData
      )
      .then((fileTree) => {
        setFileTreeData(fileTree);
      });
    }
  };
  return (
    <Box overflow="auto" height="95%" pl={1.5}>
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
            initialOpen={getOpenedNodes(fileTreeData)}
          />
        </Box>
      </DndProvider>
    </Box>
  );
}
