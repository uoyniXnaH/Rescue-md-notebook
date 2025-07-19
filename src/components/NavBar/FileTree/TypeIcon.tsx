import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';

import { NodeType } from "../../../types";

type Props = {
    fileType: NodeType;
    isOpen?: boolean;
    onClick?: (e: React.MouseEvent) => void;
};

const TypeIcon: React.FC<Props> = (props) => {
    switch (props.fileType) {
        case "folder":
            return (props.isOpen ? <FolderOpenIcon onClick={props.onClick} /> : <FolderIcon onClick={props.onClick} />);
        case "calendar":
            return <CalendarMonthIcon />;
        case "file":
            return <ArticleIcon />;
        default:
            return null;
    }
};

export default TypeIcon;