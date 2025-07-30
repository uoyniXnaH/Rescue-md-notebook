import { createTheme } from "@mui/material/styles";
import { grey, green } from "@mui/material/colors";
import { darkScrollbar } from "@mui/material";

const palettes = {
    light: {
        primary: {
            main: grey[50],
            contrastText: "#000"
        },
        secondary: {
            main: grey[200],
            contrastText: "#000"
        },
        info: {
            main: grey[500],
            contrastText: "#666"
        },
    },
    dark: {
        primary: {
            main: grey[900],
            contrastText: "#fff"
        },
        secondary: {
            main: "#363636",
            contrastText: "#fff"
        },
        info: {
            main: grey[300],
            contrastText: "#999"
        }
    }
}

export const selectTheme = (theme: "light" | "dark") => {
    const overrides = {
        MuiCssBaseline: {
            styleOverrides: {
                body: theme == "dark" ?{
                    ...darkScrollbar({
                        track: grey[900],
                        thumb: grey[600],
                        active: grey[500]
                    }),
                } : {},
                ".markdown-body": {
                    backgroundColor: palettes[theme].primary.main,
                    h1: {
                        borderBottom: `1px solid ${palettes[theme].secondary.main}`,
                    },
                    h2: {
                        borderBottom: `1px solid ${palettes[theme].secondary.main}`,
                    },
                    ul: {
                        paddingInlineStart: 24
                    },
                    "ul.contains-task-list": {
                        listStyle: "none",
                        paddingInlineStart: 0,
                    },
                    "input.task-list-item": {
                        bgColor: green[500]
                    },
                    table: {
                        margin: 12,
                        borderSpacing: 0,
                        borderCollapse: "collapse"
                    },
                    "tr:nth-child(2n)": {
                        backgroundColor: palettes[theme].secondary.main,
                    },
                    th: {
                        backgroundColor: palettes[theme].secondary.main,
                    },
                    "th, td": {
                        padding: "6px 12px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: palettes[theme].secondary.main
                    },
                    pre: {
                        padding: "16px 12px",
                        backgroundColor: palettes[theme].secondary.main,
                        borderRadius: 4,
                        overflowX: "auto",
                        fontSize: "0.9rem",
                        code: {
                            padding: 0,
                            border: "none",
                            backgroundColor: "transparent",
                            fontSize: "inherit",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                        }
                    },
                    code: {
                        display: "inline-block",
                        padding: "1px 4px",
                        margin: 1,
                        fontSize: "80%",
                        backgroundColor: palettes[theme].secondary.main,
                        borderRadius: 4,
                    },
                    blockquote: {
                        margin: "0 0 1em",
                        paddingLeft: 10,
                        borderLeft: `4px solid ${palettes[theme].info.contrastText}`,
                        color: palettes[theme].info.contrastText,
                        blockquote: {
                            marginY: 12
                        },
                        p: {
                            margin: 0
                        }
                    },
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: { verticalAlign: "middle" }
            }
        }
    };

    const themes = {
        light: createTheme({
            palette: {
                mode: 'light',
                ...palettes.light
            },
            components: {
                ...overrides
            }
        }),
        dark: createTheme({
            palette: {
                mode: 'dark',
                ...palettes.dark
            },
            components: {
                ...overrides
            }
        })
    };
    return themes[theme];
}