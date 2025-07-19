import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { darkScrollbar } from "@mui/material";

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
            },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        ...darkScrollbar({
                            track: grey[900],
                            thumb: grey[600],
                            active: grey[500]
                        }),
                    },
                    ul: {
                        // listStyle: "none",
                        paddingInlineStart: 0,
                    }
                },
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: { verticalAlign: "middle" }
                }
            }
        },
    })
}

export default themes;