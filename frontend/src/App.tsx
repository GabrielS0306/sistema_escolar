import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ListaAlunos } from './pages/admin/ListaAlunos';
import { ListaTurmas } from './pages/admin/ListaTurmas';
import { ListaProfessores } from './pages/admin/ListaProfessores';
import { ConsultaFrequencia } from './pages/admin/ConsultaFrequencia';
import { ConsultaNotas } from './pages/admin/ConsultaNotas';
import { Login } from './pages/auth/Login';
import { Registro } from './pages/auth/Registro';
import { SelecionarPapel } from './pages/auth/SelecionarPapel';
import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { DashboardCoordenador } from './pages/coordenador/DashboardCoordenador';
import { DashboardProfessor } from './pages/professor/DashboardProfessor';
import { DashboardResponsavel } from './pages/responsavel/DashboardResponsavel';
import { DashboardAluno } from './pages/aluno/DashboardAluno';
import { DashboardFuncionario } from './pages/funcionario/DashboardFuncionario';
import { DashboardSemPerfil } from './pages/DashboardSemPerfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/selecionar-papel" element={<SelecionarPapel />} />

        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/coordenador" element={<DashboardCoordenador />} />
        <Route path="/dashboard/professor" element={<DashboardProfessor />} />
        <Route path="/dashboard/responsavel" element={<DashboardResponsavel />} />
        <Route path="/dashboard/aluno" element={<DashboardAluno />} />
        <Route path="/dashboard/funcionario" element={<DashboardFuncionario />} />
        <Route path="/dashboard/sem-perfil" element={<DashboardSemPerfil />} />

        <Route path="/admin" element={<Layout />}>
          <Route path="alunos" element={<ListaAlunos />} />
          <Route path="turmas" element={<ListaTurmas />} />
          <Route path="professores" element={<ListaProfessores />} />
          <Route path="frequencia" element={<ConsultaFrequencia />} />
          <Route path="notas" element={<ConsultaNotas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;