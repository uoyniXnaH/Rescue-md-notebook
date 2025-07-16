import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArticleIcon from '@mui/icons-material/Article';

import { NodeType } from "../../../types";

type Props = {
    fileType: NodeType;
};

const TypeIcon: React.FC<Props> = (props) => {
    switch (props.fileType) {
        case "folder":
            return <FolderIcon />;
        case "calendar":
            return <CalendarMonthIcon />;
        case "file":
            return <ArticleIcon />;
        default:
            return null;
    }
};

export default TypeIcon;