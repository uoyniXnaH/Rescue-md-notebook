import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { darkScrollbar } from "@mui/material";

const selectTheme = (theme: "light" | "dark") => {
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
                ul: {
                    listStyle: "none",
                    paddingInlineStart: 0,
                }
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
            components: {
                ...overrides
            }
        }),
        dark: createTheme({
            palette: {
                mode: 'dark',
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
            },
            components: {
                ...overrides
            }
        })
    };
    return themes[theme];
}

export default selectTheme;