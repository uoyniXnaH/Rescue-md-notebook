export type NodeEnum = "file" | "folder" | "calendar";
export type NodeData = {
  fileType: NodeEnum;
  isOpen?: boolean;
  filePath: string;
};

export type themeEnum = "light" | "dark";
export type languageEnum = "en" | "sc" | "ja";
export type settingStoreType = {
  theme: themeEnum;
  language: languageEnum;
}