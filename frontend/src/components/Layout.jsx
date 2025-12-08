import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Layout({ children, protect = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (protect && !token) {
      navigate("/login");
    }
  }, [protect, token, navigate]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar position="static" color={isAdminRoute ? "primary" : "transparent"} elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" color={isAdminRoute ? "inherit" : "text.primary"} fontWeight={700}>
            Planejamento Estratégico 2026
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate("/")}>Formulário</Button>
            <Button color="inherit" onClick={() => navigate("/login")}>Admin</Button>
            {token && (
              <Button color="inherit" onClick={handleLogout} data-testid="logout-button">
                Sair
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
