import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

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
import { ConselhosClasse } from './pages/admin/ConselhosClasse';
import { Comunicados } from './pages/admin/Comunicados';
import { Recuperacao } from './pages/admin/Recuperacao';

import { AbaAlunos } from './pages/professor/AbaAlunos';
import { AbaFrequencia } from './pages/professor/AbaFrequencia';
import { AbaNotas } from './pages/professor/AbaNotas';
import { AbaObservacoes } from './pages/professor/AbaObservacoes';

import { TurmaDetalhe } from './pages/professor/TurmaDetalhe';
import { DashboardAluno } from './pages/aluno/DashboardAluno';
import { DashboardProfessor } from './pages/professor/DashboardProfessor';
import { ConselhosProfessor } from './pages/professor/ConselhosProfessor';
import { ComunicadosProfessor } from './pages/professor/ComunicadosProfessor';
import { DashboardCoordenador } from './pages/coordenador/DashboardCoordenador';
import { DashboardResponsavel } from './pages/responsavel/DashboardResponsavel';
import { DashboardFuncionario } from './pages/funcionario/DashboardFuncionario';
import { ConsultaAlunosFuncionario } from './pages/funcionario/ConsultaAlunosFuncionario';
import { OcorrenciasFuncionario } from './pages/funcionario/OcorrenciasFuncionario';
import { DashboardSemPerfil } from './pages/DashboardSemPerfil';
import { GaleriaUi } from './pages/dev/GaleriaUi';

function RedirecionarComVinculo() {
  const [searchParams] = useSearchParams();
  return <Navigate to={`alunos?${searchParams.toString()}`} replace />;
}

// Telas compartilhadas pelas áreas do Admin e do Coordenador.
function rotasGestao() {
  return (
    <>
      <Route path="usuarios/novo" element={<CadastrarUsuario />} />
      <Route path="alunos" element={<ListaAlunos />} />
      <Route path="turmas" element={<ListaTurmas />} />
      <Route path="professores" element={<ListaProfessores />} />
      <Route path="frequencia" element={<ConsultaFrequencia />} />
      <Route path="notas" element={<ConsultaNotas />} />
      <Route path="recuperacao" element={<Recuperacao />} />
      <Route path="conselhos" element={<ConselhosClasse />} />
      <Route path="comunicados" element={<Comunicados />} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selecionar-papel" element={<SelecionarPapel />} />
        {/* Vitrine do kit visual: só em desenvolvimento */}
        {import.meta.env.DEV && <Route path="/ui" element={<GaleriaUi />} />}

        {/* Dashboards por papel */}
        <Route path="/dashboard">
          <Route path="aluno" element={<AppShell key="aluno" area="aluno" />}>
            <Route index element={<DashboardAluno />} />
          </Route>
          <Route path="professor" element={<AppShell key="professor" area="professor" />}>
            <Route index element={<DashboardProfessor />} />
            <Route path="conselhos" element={<ConselhosProfessor />} />
            <Route path="comunicados" element={<ComunicadosProfessor />} />
            <Route path="turma/:turmaId" element={<TurmaDetalhe />}>
              <Route index element={<RedirecionarComVinculo />} />
              <Route path="alunos" element={<AbaAlunos />} />
              <Route path="frequencia" element={<AbaFrequencia />} />
              <Route path="notas" element={<AbaNotas />} />
              <Route path="observacoes" element={<AbaObservacoes />} />
            </Route>
          </Route>
          <Route path="responsavel" element={<AppShell key="responsavel" area="responsavel" />}>
            <Route index element={<DashboardResponsavel />} />
          </Route>
          <Route path="funcionario" element={<AppShell key="funcionario" area="funcionario" />}>
            <Route index element={<DashboardFuncionario />} />
            <Route path="alunos" element={<ConsultaAlunosFuncionario />} />
            <Route path="ocorrencias" element={<OcorrenciasFuncionario />} />
          </Route>
          <Route path="sem-perfil" element={<DashboardSemPerfil />} />
        </Route>

        {/* Painel administrativo */}
        <Route path="/admin" element={<AppShell key="admin" area="admin" />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="usuarios" element={<ListaUsuarios />} />
          {rotasGestao()}
        </Route>

        {/* Coordenação: mesmas telas de gestão, sem a gestão de usuários (exclusiva do Admin) */}
        <Route path="/coordenador" element={<AppShell key="coordenador" area="coordenador" />}>
          <Route index element={<DashboardCoordenador />} />
          {rotasGestao()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;