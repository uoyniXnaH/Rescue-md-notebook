export type NodeEnum = "file" | "folder" | "calendar";
export type NodeData = {
  fileType: NodeEnum;
  isOpen?: boolean;
  filePath: string;
};

export type settingStoreType = {
  theme: "light" | "dark";
  language: "en" | "sc" | "ja";
}