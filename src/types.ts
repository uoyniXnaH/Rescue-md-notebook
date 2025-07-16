export type NodeType = "file" | "folder" | "calendar";
export type NodeData = {
  fileType: NodeType;
  filePath: string;
};