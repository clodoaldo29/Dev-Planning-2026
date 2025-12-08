import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import PublicForm from "./pages/PublicForm";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#00bfa5" },
    background: { default: "#f5f7fb" }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout><PublicForm /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/admin" element={<Layout protect><AdminDashboard /></Layout>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
