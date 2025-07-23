import React from "react";
import { DragLayerMonitorProps } from "@minoru/react-dnd-treeview";
import { Box, Stack, Typography } from "@mui/material";

import TypeIcon from "./TypeIcon";
import { NodeData } from "../../../types";

type Props = {
  monitorProps: DragLayerMonitorProps<NodeData>;
};

const CustomDragPreview: React.FC<Props> = (props) => {
  const item = props.monitorProps.item;

  return (
    <Box position="fixed" sx={{
      pointerEvents: "none",
      gap: 1
    }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box>
          <TypeIcon
            fileType={item!.data!.fileType}
          />
        </Box>
        <Box>
        <Typography variant="body2">{item.text}</Typography>
      </Box>
      </Stack>
    </Box>
  );
};

export default CustomDragPreview;