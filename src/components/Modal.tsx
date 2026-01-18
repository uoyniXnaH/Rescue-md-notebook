import * as React from 'react';
import { ThemeProvider } from "@mui/material/styles";
import { Stack, Box, Typography, Modal, Button, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { selectTheme } from "../themes";
import { useSettingStore, useFocusStore } from "@store/store";

const style = {
    position: 'absolute',
    bgcolor: 'secondary.main',
};

const basicModalStyle = {
    ...style,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 4,
    p: 4,
}

const messageModalStyle = {
    ...style,
    bottom: 0,
    right: 0,
    width: 240,
    pt: 3,
    pb: 2,
    pl: 2,
    pr: 4
}

interface ModalOptions {
    contents: Array<string> | string;
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
            disableAutoFocus={true}
        >
            <Box sx={basicModalStyle}>
                {Array.isArray(contents) ? (
                    contents.map((line, index) => (
                        <Typography key={index} sx={{ mt: 2 }}>
                            {line}
                        </Typography>
                    ))
                ) : (
                    <Typography sx={{ mt: 2 }}>
                        {contents}
                    </Typography>
                )}
                <Stack direction="row" spacing={12} justifyContent="center" mx={2} mt={6}>
                    {leftButtonText && <Button variant="contained" onClick={() => { if (onLeftButtonClick) onLeftButtonClick(); onClose(); }}>{leftButtonText}</Button>}
                    {rightButtonText && <Button variant="contained" onClick={() => { if (onRightButtonClick) onRightButtonClick(); onClose(); }}>{rightButtonText}</Button>}
                </Stack>
            </Box>
        </Modal></ThemeProvider>
    );
}

const MessageModal: React.FC<ModalProps> = ({ open, onClose, contents }) => {
    const settings = useSettingStore((state) => state.settings);

    return (
        <ThemeProvider theme={selectTheme(settings.color_mode)}>
            <Fade in={open} timeout={800}><Box sx={{ ...messageModalStyle, display: open ? 'block' : 'none' }}>
                {Array.isArray(contents) ? (
                    contents.map((line, index) => (
                        <Typography variant="caption" key={index} sx={{ mt: 2 }}>
                            {line}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="caption" sx={{ mt: 2 }}>
                        {contents}
                    </Typography>
                )}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    size="small"
                    sx={{
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        color: 'secondary.contrastText',
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box></Fade>
        </ThemeProvider>
    );
}

type ModalContextType = {
    showBasicModal: (options: ModalOptions) => void;
    showMessageModal: (options: ModalOptions) => void;
    closeModal: () => void;
};

const ModalContext = React.createContext<ModalContextType | undefined>(undefined);

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const setFocusArea = useFocusStore((state) => state.setFocusArea);
    const [openBasic, setOpenBasic] = React.useState(false);
    const [openMessage, setOpenMessage] = React.useState(false);
    const [opts, setOpts] = React.useState<ModalOptions>({ contents: "" });

    const showBasicModal = (options: ModalOptions) => {
        setOpts(options);
        setFocusArea(null);
        setOpenBasic(true);
        setOpenMessage(false);
    }

    const showMessageModal = (options: ModalOptions) => {
        setOpts(options);
        setOpenMessage(true);
        setOpenBasic(false);
    }

    const closeModal = () => {
        setOpenBasic(false);
        setOpenMessage(false);
    }

    return (
        <ModalContext.Provider value={{ showBasicModal, showMessageModal, closeModal }}>
            {children}
            <BasicModal
                open={openBasic}
                onClose={closeModal}
                contents={opts.contents}
                leftButtonText={opts.leftButtonText}
                rightButtonText={opts.rightButtonText}
                onLeftButtonClick={opts.onLeftButtonClick}
                onRightButtonClick={opts.onRightButtonClick}
            />
            <MessageModal
                open={openMessage}
                onClose={closeModal}
                contents={opts.contents}
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