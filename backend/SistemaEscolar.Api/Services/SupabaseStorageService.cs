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

    public async Task<string> UploadArquivoAsync(IFormFile arquivo, string bucket, string nomeArquivo)
    {
        await _client.InitializeAsync();

        using var stream = new MemoryStream();
        await arquivo.CopyToAsync(stream);
        var bytes = stream.ToArray();

        await _client.Storage
            .From(bucket)
            .Upload(bytes, nomeArquivo, new Supabase.Storage.FileOptions { Upsert = true });

        return _client.Storage.From(bucket).GetPublicUrl(nomeArquivo);
    }

    public Task<string> UploadFotoAsync(IFormFile arquivo, Guid usuarioId)
    {
        var extensao = Path.GetExtension(arquivo.FileName);
        return UploadArquivoAsync(arquivo, "fotos-perfil", $"{usuarioId}{extensao}");
    }
}