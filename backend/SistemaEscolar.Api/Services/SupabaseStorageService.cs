using Supabase;

namespace SistemaEscolar.Api.Services;

public class SupabaseStorageService
{
    private readonly Client _client;
    private const string Bucket = "fotos-perfil";

    public SupabaseStorageService(IConfiguration configuration)
    {
        var url = configuration["Supabase:Url"]!;
        var key = configuration["Supabase:ServiceKey"]!;

        _client = new Client(url, key, new SupabaseOptions { AutoConnectRealtime = false });
    }

    public async Task<string> UploadFotoAsync(IFormFile arquivo, Guid usuarioId)
    {
        await _client.InitializeAsync();

        var extensao = Path.GetExtension(arquivo.FileName);
        var nomeArquivo = $"{usuarioId}{extensao}";

        using var stream = new MemoryStream();
        await arquivo.CopyToAsync(stream);
        var bytes = stream.ToArray();

        await _client.Storage
            .From(Bucket)
            .Upload(bytes, nomeArquivo, new Supabase.Storage.FileOptions { Upsert = true });

        return _client.Storage.From(Bucket).GetPublicUrl(nomeArquivo);
    }
}