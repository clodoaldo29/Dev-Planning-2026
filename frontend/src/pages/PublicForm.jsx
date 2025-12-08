import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { planejamentoApi } from "../services/api";

const initialState = {
  nome: "",
  matricula: "",
  funcao: "",
  tempo_empresa: "",
  forcas: "",
  fraquezas: "",
  oportunidades: "",
  ameacas: "",
};

function PublicForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await planejamentoApi.submit(form);
      setMessage("Obrigado por contribuir com o Planejamento 2026!");
      setForm(initialState);
    } catch (err) {
      setError("Não foi possível enviar o formulário. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Planejamento Estratégico 2026 – Time de Desenvolvimento
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Preencha o formulário abaixo com sua percepção sobre forças, fraquezas, oportunidades e ameaças do time.
      </Typography>
      <Card>
        <CardContent>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>Dados do colaborador</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Nome" name="nome" required fullWidth value={form.nome} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField label="Matrícula" name="matricula" required fullWidth value={form.matricula} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField label="Função" name="funcao" required fullWidth value={form.funcao} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField label="Tempo de empresa" name="tempo_empresa" required fullWidth value={form.tempo_empresa} onChange={handleChange} />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom mt={4}>Análise SWOT</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Forças" name="forcas" required fullWidth multiline minRows={3} value={form.forcas} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Fraquezas" name="fraquezas" required fullWidth multiline minRows={3} value={form.fraquezas} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Oportunidades" name="oportunidades" required fullWidth multiline minRows={3} value={form.oportunidades} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Ameaças" name="ameacas" required fullWidth multiline minRows={3} value={form.ameacas} onChange={handleChange} />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" gap={2}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
              </Button>
              <Button variant="outlined" onClick={() => setForm(initialState)}>
                Limpar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PublicForm;
