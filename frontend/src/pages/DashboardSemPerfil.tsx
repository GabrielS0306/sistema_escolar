import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TelaEntrada } from '../components/auth/TelaEntrada';
import { EstadoVazio } from '../components/ui/Estrutura';
import { Button } from '../components/ui/Button';

// Usuário que loga sem nenhum perfil (Aluno, Professor...) vinculado ainda.
export function DashboardSemPerfil() {
    const navigate = useNavigate();
    const { sair } = useAuth();

    return (
        <TelaEntrada>
            <EstadoVazio
                icone="usuario"
                titulo="Aguardando vínculo de perfil"
                descricao="Sua conta foi criada, mas ainda não tem uma função na escola (aluno, professor, responsável...). Procure a secretaria."
                acao={<Button variante="secundario" icone="sair" onClick={() => { sair(); navigate('/login'); }}>Sair</Button>}
            />
        </TelaEntrada>
    );
}
