import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const themes = {
    light: createTheme({
        palette: {
            primary: {
                main: grey[50],
                contrastText: "#000"
            },
            secondary: {
                main: grey[200],
                contrastText: "#000"
            },
        }
    }),
    dark: createTheme({
        palette: {
            primary: {
                main: grey[900],
                contrastText: "#fff"
            },
            secondary: {
                main: grey[800],
                contrastText: "#fff"
            },
        }
    })
}

export default themes;