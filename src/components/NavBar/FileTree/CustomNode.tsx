import React from "react";
import { Box, Stack, Typography } from "@mui/material";
// import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { NodeModel } from "@minoru/react-dnd-treeview";

import TypeIcon from "./TypeIcon";
import { NodeData } from "../../../types";

type Props = {
  node: NodeModel<NodeData>;
  depth: number;
  isOpen: boolean;
  onToggle: (id: NodeModel["id"]) => void;
};

const CustomNode: React.FC<Props> = (props) => {
  const { data } = props.node;
  const indent = props.depth * 3;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ paddingInlineStart: indent }}>
      <Box>
        <TypeIcon fileType={data!.fileType} isOpen={props.isOpen} onClick={handleToggle} />
      </Box>
      <Box>
        <Typography variant="body2">{props.node.text}</Typography>
      </Box>
    </Stack>
  );
};

export default CustomNode;