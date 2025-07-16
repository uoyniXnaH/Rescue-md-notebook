import React from "react";
import { DragLayerMonitorProps } from "@minoru/react-dnd-treeview";

import TypeIcon from "./TypeIcon";
import { NodeData } from "../../../types";

type Props = {
  monitorProps: DragLayerMonitorProps<NodeData>;
};

const CustomDragPreview: React.FC<Props> = (props) => {
  const item = props.monitorProps.item;

  return (
    <div>
      <div>
        <TypeIcon
          fileType={item!.data!.fileType}
        />
      </div>
      <div>{item.text}</div>
    </div>
  );
};

export default CustomDragPreview;