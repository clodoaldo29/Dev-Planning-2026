import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InsightsIcon from "@mui/icons-material/Insights";
import StarsIcon from "@mui/icons-material/Stars";
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
  expectativas_2026: "",
  contribuicao_2026: "",
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
      setMessage("Obrigado por contribuir com o Planejamento 2026! 🎯");
      setForm(initialState);
    } catch (err) {
      setError(
        "Não foi possível enviar o formulário. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 960,
        mx: "auto",
        py: 4,
      }}
    >
      <Box mb={3}>
        <Chip
          label="Planejamento 2026"
          color="primary"
          variant="outlined"
          sx={{ mb: 1, fontWeight: 600 }}
        />
        <Typography variant="h4" gutterBottom>
          Contribuição do Time de Desenvolvimento
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Suas respostas vão ajudar a construir o plano estratégico de 2026,
          alinhando habilidades, melhorias, oportunidades e riscos do time.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Seção: Dados do colaborador */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={1}
              mt={1}
            >
              <PersonIcon color="primary" />
              <Typography variant="h6">Dados do colaborador</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Comece identificando seu perfil. Essas informações ajudam a
              cruzar percepções por função e tempo de casa.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nome"
                  name="nome"
                  required
                  fullWidth
                  value={form.nome}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Matrícula"
                  name="matricula"
                  required
                  fullWidth
                  value={form.matricula}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Função"
                  name="funcao"
                  required
                  fullWidth
                  value={form.funcao}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Tempo de empresa"
                  name="tempo_empresa"
                  required
                  fullWidth
                  value={form.tempo_empresa}
                  onChange={handleChange}
                  placeholder="Ex: 6 meses, 2 anos..."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Seção: SWOT */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={1}
              mt={1}
            >
              <InsightsIcon color="secondary" />
              <Typography variant="h6">Análise do time e dos processos</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Responda com exemplos práticos do dia a dia. Quanto mais
              específico, mais fácil transformar isso em ações para 2026.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Quais são as principais habilidades do time (Soft e Hard Skills)?"
                  name="forcas"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.forcas}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="O que o time precisar melhorar nos seus processos?"
                  name="fraquezas"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.fraquezas}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Quais são as oportunidades que podemos implementar e melhorar nos projetos e processos?"
                  name="oportunidades"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.oportunidades}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Quais as principais ameaças que o time pode ou poderá sofrer?"
                  name="ameacas"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.ameacas}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Seção: Expectativas */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={1}
              mt={1}
            >
              <StarsIcon color="primary" />
              <Typography variant="h6">Expectativas e contribuição em 2026</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Aqui queremos entender como você enxerga o próximo ano e qual
              impacto pretende gerar nos projetos.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Quais são as suas expectativas para o ano de 2026?"
                  name="expectativas_2026"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.expectativas_2026}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="O que você pode fazer para contribuir e impactar com os projetos em 2026?"
                  name="contribuicao_2026"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.contribuicao_2026}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => setForm(initialState)}
              >
                Limpar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar contribuição"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PublicForm;