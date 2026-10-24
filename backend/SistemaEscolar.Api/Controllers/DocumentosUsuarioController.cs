using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Api.Services;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DocumentosUsuarioController : ControllerBase
{
    private const string Bucket = "documentos-usuario";
    private const int ValidadeUrlSegundos = 300;

    private readonly AppDbContext _context;
    private readonly SupabaseStorageService _storageService;

    public DocumentosUsuarioController(AppDbContext context, SupabaseStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }

    [HttpGet("usuario/{usuarioId}")]
    public async Task<ActionResult<IEnumerable<DocumentoUsuarioResponseDto>>> GetPorUsuario(Guid usuarioId)
    {
        var documentos = await _context.DocumentosUsuario
            .Where(d => d.UsuarioId == usuarioId)
            .OrderByDescending(d => d.Data)
            .Select(d => new DocumentoUsuarioResponseDto
            {
                Id = d.Id,
                Tipo = d.Tipo,
                Descricao = d.Descricao,
                Data = d.Data,
                RegistradoPor = d.RegistradoPorUsuario.Nome
            })
            .ToListAsync();

        return Ok(documentos);
    }

    // URL temporária para abrir o arquivo do bucket privado. Expira em poucos minutos.
    [HttpGet("{id}/url")]
    public async Task<ActionResult<DocumentoUrlResponseDto>> GetUrl(Guid id)
    {
        var documento = await _context.DocumentosUsuario.FindAsync(id);
        if (documento is null) return NotFound();

        var url = await _storageService.CriarUrlAssinadaAsync(Bucket, documento.CaminhoArquivo, ValidadeUrlSegundos);

        return Ok(new DocumentoUrlResponseDto
        {
            Url = url,
            ExpiraEm = DateTime.UtcNow.AddSeconds(ValidadeUrlSegundos)
        });
    }

    [HttpPost]
    public async Task<ActionResult<DocumentoUsuarioResponseDto>> Create([FromForm] CreateDocumentoUsuarioDto dto, IFormFile arquivo)
    {
        var usuarioDono = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuarioDono is null) return BadRequest("UsuarioId informado não existe.");

        var registradoPorId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var registradoPor = await _context.Usuarios.FindAsync(registradoPorId);

        var caminho = $"{dto.UsuarioId}/{Guid.NewGuid()}{Path.GetExtension(arquivo.FileName)}";
        await _storageService.UploadArquivoPrivadoAsync(arquivo, Bucket, caminho);

        var documento = new DocumentoUsuario
        {
            Id = Guid.NewGuid(),
            UsuarioId = dto.UsuarioId,
            Tipo = dto.Tipo,
            Descricao = dto.Descricao,
            CaminhoArquivo = caminho,
            Data = DateTime.UtcNow,
            RegistradoPorUsuarioId = registradoPorId
        };

        _context.DocumentosUsuario.Add(documento);
        await _context.SaveChangesAsync();

        var response = new DocumentoUsuarioResponseDto
        {
            Id = documento.Id,
            Tipo = documento.Tipo,
            Descricao = documento.Descricao,
            Data = documento.Data,
            RegistradoPor = registradoPor!.Nome
        };

        return CreatedAtAction(nameof(GetPorUsuario), new { usuarioId = dto.UsuarioId }, response);
    }
}
