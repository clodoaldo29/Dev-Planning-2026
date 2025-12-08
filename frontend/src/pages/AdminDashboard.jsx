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
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
      setError("Não foi possível carregar os registros. Confirme suas credenciais.");
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
    const header = ["timestamp", "nome", "matricula", "funcao", "tempo_empresa", "forcas", "fraquezas", "oportunidades", "ameacas"];
    const rows = records.map((r) => header.map((key) => (r[key] || "").toString().replace(/,/g, ";")).join(","));
    const csvContent = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "planejamento_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "planejamento_2026.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupedByFuncao = useMemo(() => {
    const counts = records.reduce((acc, curr) => {
      const key = curr.funcao || "N/A";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [records]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Painel Administrativo
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Visualize e filtre todas as contribuições registradas na planilha do Google Sheets.
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <TextField label="Função" fullWidth value={funcao} onChange={(e) => setFuncao(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField label="Tempo de empresa" fullWidth value={tempoEmpresa} onChange={(e) => setTempoEmpresa(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField type="date" label="Data inicial" fullWidth InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField type="date" label="Data final" fullWidth InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Busca em SWOT" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={exportCsv}>Exportar CSV</Button>
            <Button variant="outlined" onClick={exportJson}>Exportar JSON</Button>
            <Button variant="contained" onClick={fetchRecords}>Atualizar</Button>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total de registros</Typography>
              <Typography variant="h4" fontWeight={700}>{records.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Distribuição por função</Typography>
              <Box height={240}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groupedByFuncao}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Registros</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Função</TableCell>
                  <TableCell>Tempo de empresa</TableCell>
                  <TableCell>Forças</TableCell>
                  <TableCell>Fraquezas</TableCell>
                  <TableCell>Oportunidades</TableCell>
                  <TableCell>Ameaças</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row, idx) => (
                  <TableRow key={`${row.matricula}-${idx}`} hover>
                    <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{row.nome}</TableCell>
                    <TableCell>{row.matricula}</TableCell>
                    <TableCell>{row.funcao}</TableCell>
                    <TableCell>{row.tempo_empresa}</TableCell>
                    <TableCell>{row.forcas}</TableCell>
                    <TableCell>{row.fraquezas}</TableCell>
                    <TableCell>{row.oportunidades}</TableCell>
                    <TableCell>{row.ameacas}</TableCell>
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
