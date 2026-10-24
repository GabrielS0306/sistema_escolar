using Supabase;

namespace SistemaEscolar.Api.Services;

public class SupabaseStorageService
{
    private readonly Client _client;

    public SupabaseStorageService(IConfiguration configuration)
    {
        var url = configuration["Supabase:Url"]!;
        var key = configuration["Supabase:ServiceKey"]!;

        _client = new Client(url, key, new SupabaseOptions { AutoConnectRealtime = false });
    }

    // Para buckets públicos: devolve a URL pública do arquivo.
    public async Task<string> UploadArquivoAsync(IFormFile arquivo, string bucket, string nomeArquivo)
    {
        await EnviarAsync(arquivo, bucket, nomeArquivo);

        return _client.Storage.From(bucket).GetPublicUrl(nomeArquivo);
    }

    // Para buckets privados: devolve só o caminho; quem for exibir pede uma URL assinada.
    public async Task<string> UploadArquivoPrivadoAsync(IFormFile arquivo, string bucket, string caminho)
    {
        await EnviarAsync(arquivo, bucket, caminho);

        return caminho;
    }

    public async Task<string> CriarUrlAssinadaAsync(string bucket, string caminho, int segundosValidade)
    {
        await _client.InitializeAsync();

        return await _client.Storage.From(bucket).CreateSignedUrl(caminho, segundosValidade);
    }

    public Task<string> UploadFotoAsync(IFormFile arquivo, Guid usuarioId)
    {
        var extensao = Path.GetExtension(arquivo.FileName);
        return UploadArquivoAsync(arquivo, "fotos-perfil", $"{usuarioId}{extensao}");
    }

    private async Task EnviarAsync(IFormFile arquivo, string bucket, string caminho)
    {
        await _client.InitializeAsync();

        using var stream = new MemoryStream();
        await arquivo.CopyToAsync(stream);
        var bytes = stream.ToArray();

        await _client.Storage
            .From(bucket)
            .Upload(bytes, caminho, new Supabase.Storage.FileOptions { Upsert = true });
    }
}
