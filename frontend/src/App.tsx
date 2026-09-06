import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ListaAlunos } from './pages/ListaAlunos';
import { ListaTurmas } from './pages/ListaTurmas';
import { ListaProfessores } from './pages/ListaProfessores';
import { ConsultaFrequencia } from './pages/ConsultaFrequencia';
import { ConsultaNotas } from './pages/ConsultaNotas';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { DashboardAluno } from './pages/DashboardAluno';
import { DashboardProfessor } from './pages/DashboardProfessor';
import { DashboardSemPerfil } from './pages/DashboardSemPerfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashboard/aluno" element={<DashboardAluno />} />
        <Route path="/dashboard/professor" element={<DashboardProfessor />} />
        <Route path="/dashboard/sem-perfil" element={<DashboardSemPerfil />} />

        <Route element={<Layout />}>
          <Route index element={<Navigate to="/alunos" replace />} />
          <Route path="/alunos" element={<ListaAlunos />} />
          <Route path="/turmas" element={<ListaTurmas />} />
          <Route path="/professores" element={<ListaProfessores />} />
          <Route path="/frequencia" element={<ConsultaFrequencia />} />
          <Route path="/notas" element={<ConsultaNotas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;