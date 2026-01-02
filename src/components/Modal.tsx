import * as React from 'react';
import { ThemeProvider } from "@mui/material/styles";
import { Stack, Box, Typography, Modal, Button } from '@mui/material';

import { selectTheme } from "../themes";
import { useSettingStore } from "@store/store";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'secondary.main',
    borderRadius: 4,
    p: 4,
};

interface ModalOptions {
    contents: string;
    leftButtonText?: string;
    rightButtonText?: string;
    onLeftButtonClick?: () => void;
    onRightButtonClick?: () => void;
}

interface ModalProps extends ModalOptions {
    open: boolean;
    onClose: () => void;
};

const BasicModal: React.FC<ModalProps> = ({ open, onClose, contents, leftButtonText, rightButtonText, onLeftButtonClick, onRightButtonClick }) => {
    const settings = useSettingStore((state) => state.settings);

    return (
        <ThemeProvider theme={selectTheme(settings.color_mode)}><Modal
            open={open}
            onClose={onClose}
        >
            <Box sx={style}>
                <Typography sx={{ mt: 2 }}>
                    {contents}
                </Typography>
                <Stack direction="row" spacing={12} justifyContent="center" mx={2} mt={6}>
                    {leftButtonText && <Button variant="contained" onClick={() => { if (onLeftButtonClick) onLeftButtonClick(); onClose(); }}>{leftButtonText}</Button>}
                    {rightButtonText && <Button variant="contained" onClick={() => { if (onRightButtonClick) onRightButtonClick(); onClose(); }}>{rightButtonText}</Button>}
                </Stack>
            </Box>
        </Modal></ThemeProvider>
    );
}

type ModalContextType = {
    showModal: (options: ModalOptions) => void;
    closeModal: () => void;
};

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = React.useState(false);
    const [opts, setOpts] = React.useState<ModalOptions>({ contents: "" });

    const showModal = (options: ModalOptions) => {
        setOpts(options);
        setOpen(true);
    }

    const closeModal = () => {
        setOpen(false);
        if (opts.onLeftButtonClick) opts.onLeftButtonClick();
    }

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}
            <BasicModal
                open={open}
                onClose={closeModal}
                contents={opts.contents}
                leftButtonText={opts.leftButtonText}
                rightButtonText={opts.rightButtonText}
                onLeftButtonClick={opts.onLeftButtonClick}
                onRightButtonClick={opts.onRightButtonClick}
            />
        </ModalContext.Provider>
    )
}

const useModal = (): ModalContextType => {
    const context = React.useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}

export { ModalProvider, useModal };