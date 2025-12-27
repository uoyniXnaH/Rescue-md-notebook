import React from "react";
import { Box, Stack, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { NodeModel } from "@minoru/react-dnd-treeview";
import AddIcon from '@mui/icons-material/Add';
import { invoke } from "@tauri-apps/api/core";

import TypeIcon from "./TypeIcon";
import { NodeData } from "@type/types";
import { useFileTreeStore, useDisplayStore } from "@store/store";
import { useTranslation } from "react-i18next";
import { NODE_TYPE } from "@src/Defines";

type AddMenuProps = {
  isOpen: boolean;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
};
const AddMenu: React.FC<AddMenuProps> = (props: AddMenuProps) => {
  const { isOpen, anchorEl, handleClose } = props;
  const { t } = useTranslation();

  return (
    <Menu
      id="add-menu"
      open={isOpen}
      onClose={handleClose}
      anchorEl={anchorEl}
    >
      {NODE_TYPE.map((type) => (
        <MenuItem key={type} onClick={handleClose}>
          <Typography variant="body2">{t("nav.new")}{t(`nav.${type}`)}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
}

type Props = {
  node: NodeModel<NodeData>;
  depth: number;
  isOpen: boolean;
  onToggle: (id: NodeModel["id"]) => void;
};

const CustomNode: React.FC<Props> = (props) => {
  const { id, droppable, data } = props.node;
  const indent = props.depth * 3;
  const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useFileTreeStore((state) => state.setSelectedNodeId);
  const setFileTreeData = useFileTreeStore((state) => state.setFileTreeData);
  const setCurrentFileContents = useDisplayStore((state) => state.setCurrentFileContents);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await invoke<NodeModel<NodeData>[]>("update_rconfig_node", { updatedNode: { ...props.node, data: { ...props.node.data, isOpen: !props.isOpen } } })
    .then((filetree) => {
      setFileTreeData(filetree);
      props.onToggle(props.node.id);
    });
  };

  const handleSelectNode = async (node: NodeModel<NodeData>) => {
    setSelectedNodeId(node.id);
    await invoke<string>("get_node_contents", { node: node })
    .then((contents) => {
      setCurrentFileContents(contents);
    });
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        width="100%"
        py={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ paddingInlineStart: indent }}>
          <Box>
            <TypeIcon fileType={data!.nodeType} isOpen={props.isOpen} onClick={handleToggle} />
          </Box>
          <Box onClick={() => handleSelectNode(props.node)} px={0.5} sx={{
            color: selectedNodeId === id ? "primary.main" : "primary.contrastText",
            backgroundColor: selectedNodeId === id ? "primary.contrastText" : "transparent"
          }}
          >
            <Typography variant="body2">{props.node.text}</Typography>
          </Box>
        </Stack>
        {droppable && isHovered && <><IconButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            setIsAddMenuOpen(true);
            setAnchorEl(e.currentTarget);
          }}
          sx={{ padding: 0 }}
        ><AddIcon /></IconButton>
        <AddMenu
          isOpen={isAddMenuOpen}
          anchorEl={anchorEl}
          handleClose={() => {setIsAddMenuOpen(false); setIsHovered(false); setAnchorEl(null);}}
        /></>}
      </Stack>
    </>
  );
};

export default CustomNode;