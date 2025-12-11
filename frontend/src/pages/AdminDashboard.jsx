import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import BoltIcon from "@mui/icons-material/Bolt";
import { planejamentoApi, setAuthToken } from "../services/api";

function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [funcao, setFuncao] = useState("");
  const [tempoEmpresa, setTempoEmpresa] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchRecords = async () => {
    setError("");
    try {
      const params = {
        funcao: funcao || undefined,
        tempo_empresa: tempoEmpresa || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        search: search || undefined,
      };
      const { data } = await planejamentoApi.list(params);
      setRecords(data.items || []);
    } catch (err) {
      setError(
        "Não foi possível carregar os registros. Confirme suas credenciais."
      );
    }
  };

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funcao, tempoEmpresa, startDate, endDate, search]);

  const exportCsv = () => {
    const header = [
      "timestamp",
      "nome",
      "matricula",
      "funcao",
      "tempo_empresa",
      "forcas",
      "fraquezas",
      "oportunidades",
      "ameacas",
      "expectativas_2026",
      "contribuicao_2026",
    ];

    const rows = records.map((r) =>
      header
        .map((key) =>
          (r[key] || "")
            .toString()
            .replace(/,/g, ";")
        )
        .join(",")
    );

    const csvContent = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "planejamento_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "planejamento_2026.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================
  // ANÁLISES / AGRUPAMENTOS
  // ============================

  // Distribuição por função (já existia)
  const groupedByFuncao = useMemo(() => {
    const counts = records.reduce((acc, curr) => {
      const key = curr.funcao || "N/A";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [records]);

  // Distribuição por tempo de empresa
  const groupedByTempoEmpresa = useMemo(() => {
    const counts = records.reduce((acc, curr) => {
      const key = curr.tempo_empresa || "N/A";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [records]);

  // Top palavras em expectativas + contribuição (remoção de stopwords básica)
  const topWordsExpectativas = useMemo(() => {
    if (!records.length) return [];

    const stopwords = new Set([
      "de",
      "da",
      "do",
      "das",
      "dos",
      "a",
      "o",
      "os",
      "as",
      "e",
      "é",
      "em",
      "no",
      "na",
      "nos",
      "nas",
      "para",
      "por",
      "com",
      "um",
      "uma",
      "que",
      "se",
      "ser",
      "ao",
      "à",
      "ou",
      "dos",
      "das",
      "nos",
      "nas",
      "sobre",
      "como",
      "mais",
      "menos",
      "pelo",
      "pela",
    ]);

    const text = records
      .map(
        (r) =>
          `${r.expectativas_2026 || ""} ${r.contribuicao_2026 || ""}`.toLowerCase()
      )
      .join(" ");

    const tokens = text
      .split(/\s+/)
      .map((t) => t.replace(/[.,;:!?()"']/g, "").trim())
      .filter((t) => t.length > 3 && !stopwords.has(t));

    const counts = tokens.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // top 10

    return sorted.map(([word, value]) => ({ word, value }));
  }, [records]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Painel Administrativo
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Visualize, filtre e analise as contribuições do time para o
        Planejamento Estratégico 2026.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Função"
            fullWidth
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Tempo de empresa"
            fullWidth
            value={tempoEmpresa}
            onChange={(e) => setTempoEmpresa(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            label="Data inicial"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            label="Data final"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Busca em SWOT, Expectativas e Contribuição"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="flex-end"
          >
            <Button variant="outlined" onClick={exportCsv}>
              Exportar CSV
            </Button>
            <Button variant="outlined" onClick={exportJson}>
              Exportar JSON
            </Button>
            <Button variant="contained" onClick={fetchRecords}>
              Atualizar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Cards de métricas */}
      <Grid container spacing={2} mb={3} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <DashboardIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total de registros
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {records.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Número total de contribuições recebidas do time.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "secondary.main",
                    color: "secondary.contrastText",
                  }}
                >
                  <GroupsIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Funções respondentes
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {groupedByFuncao.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Quantidade de funções diferentes que participaram do
                    planejamento.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "warning.main",
                    color: "warning.contrastText",
                  }}
                >
                  <BoltIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nível de engajamento textual
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {topWordsExpectativas.length > 0 ? "Alto" : "Baixo"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Análise qualitativa baseada nas respostas de expectativas e
                    contribuição.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Distribuição por função
              </Typography>
              <Box height={240}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupedByFuncao}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#1976d2"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Distribuição por tempo de empresa
              </Typography>
              <Box height={240}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupedByTempoEmpresa}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#9c27b0"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Top palavras em Expectativas e Contribuição (2026)
              </Typography>
              <Box height={260}>
                {topWordsExpectativas.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Ainda não há dados suficientes para análise de palavras.
                  </Typography>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topWordsExpectativas}>
                      <XAxis dataKey="word" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#ff9800"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela detalhada */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Registros
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Função</TableCell>
                  <TableCell>Tempo Emp</TableCell>
                  <TableCell>Forças</TableCell>
                  <TableCell>Fraquezas</TableCell>
                  <TableCell>Oportunidades</TableCell>
                  <TableCell>Ameaças</TableCell>
                  <TableCell>Expectativas</TableCell>
                  <TableCell>Impacto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row, idx) => (
                  <TableRow key={`${row.matricula}-${idx}`} hover>
                    <TableCell>
                      {new Date(row.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{row.matricula}</TableCell>
                    <TableCell>{row.funcao}</TableCell>
                    <TableCell>{row.tempo_empresa}</TableCell>
                    <TableCell>{row.forcas}</TableCell>
                    <TableCell>{row.fraquezas}</TableCell>
                    <TableCell>{row.oportunidades}</TableCell>
                    <TableCell>{row.ameacas}</TableCell>
                    <TableCell>{row.expectativas_2026}</TableCell>
                    <TableCell>{row.contribuicao_2026}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AdminDashboard;