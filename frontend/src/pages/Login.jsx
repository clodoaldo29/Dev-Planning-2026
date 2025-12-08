import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authApi, setAuthToken } from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await authApi.login({ username, password });
      localStorage.setItem("token", data.access_token);
      setAuthToken(data.access_token);
      navigate("/admin");
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <Box maxWidth={480} mx="auto">
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Acesso do Administrador
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Informe usuário e senha definidos nas variáveis de ambiente do backend.
      </Typography>
      <Card>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <TextField
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained">Entrar</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
