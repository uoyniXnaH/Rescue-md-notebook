import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { NodeModel } from "@minoru/react-dnd-treeview";

import TypeIcon from "./TypeIcon";
import { NodeData } from "@type/types";
import { useFileTreeStore } from "@store/store";

type Props = {
  node: NodeModel<NodeData>;
  depth: number;
  isOpen: boolean;
  onToggle: (id: NodeModel["id"]) => void;
};

const CustomNode: React.FC<Props> = (props) => {
  const { id, data } = props.node;
  const indent = props.depth * 3;
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useFileTreeStore((state) => state.setSelectedNodeId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ paddingInlineStart: indent }}>
      <Box>
        <TypeIcon fileType={data!.fileType} isOpen={props.isOpen} onClick={handleToggle} />
      </Box>
      <Box onClick={() => setSelectedNodeId(id)} px={0.5} sx={{
        color: selectedNodeId === id ? "primary.main" : "primary.contrastText",
        backgroundColor: selectedNodeId === id ? "primary.contrastText" : "transparent"
      }}
      >
        <Typography variant="body2">{props.node.text}</Typography>
      </Box>
    </Stack>
  );
};

export default CustomNode;