const API_BASE_URL = 'http://localhost:5155/api';
const CHAVE_SESSAO = 'sistema-escolar-sessao';

// Erro com o status HTTP e uma mensagem pronta para mostrar ao usuário.
export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, mensagem: string) {
        super(mensagem);
        this.name = 'ApiError';
        this.status = status;
    }
}

const MENSAGEM_POR_STATUS: Record<number, string> = {
    400: 'Os dados enviados não são válidos.',
    401: 'Sua sessão expirou. Entre novamente.',
    403: 'Você não tem permissão para fazer isso.',
    404: 'O item procurado não foi encontrado.',
    409: 'Essa ação entra em conflito com dados existentes.',
    500: 'Erro no servidor. Tente novamente em instantes.',
};

function obterToken(): string | null {
    const salvo = sessionStorage.getItem(CHAVE_SESSAO);

    if (!salvo) return null;

    try {
        return JSON.parse(salvo).token ?? null;
    } catch {
        return null;
    }
}

function montarHeaders(comJson: boolean): HeadersInit {
    const headers: HeadersInit = {};
    const token = obterToken();

    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (comJson) headers['Content-Type'] = 'application/json';

    return headers;
}

// O backend devolve erros como texto puro (BadRequest("...")), string JSON ou ProblemDetails.
function extrairMensagem(corpo: string): string | null {
    if (!corpo.trim()) return null;

    try {
        const dados = JSON.parse(corpo);

        if (typeof dados === 'string') return dados;

        if (dados?.errors && typeof dados.errors === 'object') {
            const primeiros = Object.values(dados.errors as Record<string, string[]>).flat();
            if (primeiros.length > 0) return primeiros[0];
        }

        return dados?.detail ?? dados?.title ?? null;
    } catch {
        return corpo.length <= 300 ? corpo : null;
    }
}

async function requisicao<T>(endpoint: string, init: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, init);
    } catch {
        // fetch só lança quando nem chegou ao servidor (API fora do ar, sem rede, CORS).
        throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique se a API está rodando.');
    }

    // Alguns endpoints respondem 200/204 sem corpo (ex.: vincular-aluno).
    const corpo = await response.text();

    if (!response.ok) {
        const mensagem = extrairMensagem(corpo)
            ?? MENSAGEM_POR_STATUS[response.status]
            ?? `Erro inesperado (${response.status}).`;

        throw new ApiError(response.status, mensagem);
    }

    return (corpo ? JSON.parse(corpo) : undefined) as T;
}

export function apiGet<T>(endpoint: string): Promise<T> {
    return requisicao<T>(endpoint, { headers: montarHeaders(false) });
}

export function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
    return requisicao<T>(endpoint, { method: 'POST', headers: montarHeaders(true), body: JSON.stringify(body) });
}

export function apiPut<T>(endpoint: string, body: unknown): Promise<T> {
    return requisicao<T>(endpoint, { method: 'PUT', headers: montarHeaders(true), body: JSON.stringify(body) });
}

export function apiPostForm<T>(endpoint: string, formData: FormData): Promise<T> {
    return requisicao<T>(endpoint, { method: 'POST', headers: montarHeaders(false), body: formData });
}

export function apiPutForm<T>(endpoint: string, formData: FormData): Promise<T> {
    return requisicao<T>(endpoint, { method: 'PUT', headers: montarHeaders(false), body: formData });
}

// Mensagem amigável para qualquer erro capturado num catch.
export function mensagemDeErro(erro: unknown, padrao = 'Algo deu errado. Tente novamente.'): string {
    if (erro instanceof ApiError) return erro.message;
    if (erro instanceof Error && erro.message) return erro.message;
    return padrao;
}
