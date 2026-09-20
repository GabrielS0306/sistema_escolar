import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutAluno } from './components/LayoutAluno';
import { LayoutProfessor } from './components/LayoutProfessor';

import { Login } from './pages/auth/Login';
import { SelecionarPapel } from './pages/auth/SelecionarPapel';

import { DashboardAdmin } from './pages/admin/DashboardAdmin';
import { CadastrarUsuario } from './pages/admin/CadastrarUsuario';
import { ListaUsuarios } from './pages/admin/ListaUsuarios';
import { ListaAlunos } from './pages/admin/ListaAlunos';
import { ListaTurmas } from './pages/admin/ListaTurmas';
import { ListaProfessores } from './pages/admin/ListaProfessores';
import { ConsultaFrequencia } from './pages/admin/ConsultaFrequencia';
import { ConsultaNotas } from './pages/admin/ConsultaNotas';
import { AbaAlunos } from './pages/professor/AbaAlunos';
import { AbaFrequencia } from './pages/professor/AbaFrequencia';

import { TurmaDetalhe } from './pages/professor/TurmaDetalhe';
import { DashboardAluno } from './pages/aluno/DashboardAluno';
import { DashboardProfessor } from './pages/professor/DashboardProfessor';
import { DashboardCoordenador } from './pages/coordenador/DashboardCoordenador';
import { DashboardResponsavel } from './pages/responsavel/DashboardResponsavel';
import { DashboardFuncionario } from './pages/funcionario/DashboardFuncionario';
import { DashboardSemPerfil } from './pages/DashboardSemPerfil';

function RedirecionarComVinculo() {
  const [searchParams] = useSearchParams();
  return <Navigate to={`alunos?${searchParams.toString()}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selecionar-papel" element={<SelecionarPapel />} />

        {/* Dashboards por papel */}
        <Route path="/dashboard">
          <Route path="aluno" element={<LayoutAluno />}>
            <Route index element={<DashboardAluno />} />
          </Route>
          <Route path="professor" element={<LayoutProfessor />}>
            <Route index element={<DashboardProfessor />} />
            <Route path="turma/:turmaId" element={<TurmaDetalhe />}>
              <Route index element={<RedirecionarComVinculo />} />
              <Route path="alunos" element={<AbaAlunos />} />
              <Route path="frequencia" element={<AbaFrequencia />} />
            </Route>
          </Route>
          <Route path="coordenador" element={<DashboardCoordenador />} />
          <Route path="responsavel" element={<DashboardResponsavel />} />
          <Route path="funcionario" element={<DashboardFuncionario />} />
          <Route path="sem-perfil" element={<DashboardSemPerfil />} />
        </Route>

        {/* Painel administrativo */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="usuarios" element={<ListaUsuarios />} />
          <Route path="usuarios/novo" element={<CadastrarUsuario />} />
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