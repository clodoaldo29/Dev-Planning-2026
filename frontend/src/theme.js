// frontend/src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",       // Azul principal
    },
    secondary: {
      main: "#9c27b0",       // Roxo para destaques
    },
    background: {
      default: "#f3f4f7",    // Fundo da aplicação
      paper: "#ffffff",      // Cards / superfícies
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
      textTransform: "uppercase",
      fontSize: "0.75rem",
      letterSpacing: 1,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;