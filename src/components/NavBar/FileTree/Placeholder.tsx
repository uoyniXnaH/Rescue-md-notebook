import React from "react";
import { NodeModel } from "@minoru/react-dnd-treeview";

type Props = {
  node: NodeModel;
  depth: number;
};

const Placeholder: React.FC<Props> = (props) => {
  const left = props.depth * 24;
  return <div style={{ left }}></div>;
};

export default Placeholder;