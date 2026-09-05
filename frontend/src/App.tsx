import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ListaAlunos } from './pages/ListaAlunos';
import { ListaTurmas } from './pages/ListaTurmas';
import { ListaProfessores } from './pages/ListaProfessores';
import { ConsultaFrequencia } from './pages/ConsultaFrequencia';
import { ConsultaNotas } from './pages/ConsultaNotas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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