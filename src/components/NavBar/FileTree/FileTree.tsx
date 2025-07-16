import React from 'react';
import Box from '@mui/material/Box';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
  NodeModel,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";

import CustomNode from "./CustomNode";
import CustomDragPreview from "./CustomDragPreview";
import Placeholder from "./Placeholder";
import SampleData from "./sample_data.json";
import { NodeData } from "../../../types";

export default function FileTree() {
  const [treeData, setTreeData] = React.useState<NodeModel<NodeData>[]>(SampleData as NodeModel<NodeData>[]);
  const handleDrop = (newTreeData: NodeModel<NodeData>[]) => setTreeData(newTreeData);
  return (
    <Box overflow="auto">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div>
          <Tree
            tree={treeData}
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
            sort={false}
            insertDroppableFirst={false}
            canDrop={({ dragSource, dropTargetId }) => {
              if (dragSource?.parent === dropTargetId) {
                return true;
              }
            }}
            dropTargetOffset={10}
            placeholderRender={(node, { depth }) => (
              <Placeholder node={node} depth={depth} />
            )}
          />
        </div>
      </DndProvider>
    </Box>
  );
}
