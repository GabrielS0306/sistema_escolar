const API_BASE_URL = 'http://localhost:5155/api';
const CHAVE_SESSAO = 'sistema-escolar-sessao';

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

export async function apiGet<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers: montarHeaders(false) });

    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

    return response.json();
}

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: montarHeaders(true),
        body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

    return response.json();
}

export async function apiPostForm<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: montarHeaders(false),
        body: formData,
    });

    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

    return response.json();
}