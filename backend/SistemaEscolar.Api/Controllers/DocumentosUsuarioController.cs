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
            .Include(d => d.RegistradoPorUsuario)
            .Where(d => d.UsuarioId == usuarioId)
            .OrderByDescending(d => d.Data)
            .Select(d => new DocumentoUsuarioResponseDto
            {
                Id = d.Id,
                Tipo = d.Tipo,
                Descricao = d.Descricao,
                ArquivoUrl = d.ArquivoUrl,
                Data = d.Data,
                RegistradoPor = d.RegistradoPorUsuario.Nome
            })
            .ToListAsync();

        return Ok(documentos);
    }

    [HttpPost]
    public async Task<ActionResult<DocumentoUsuarioResponseDto>> Create([FromForm] CreateDocumentoUsuarioDto dto, IFormFile arquivo)
    {
        var usuarioDono = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuarioDono is null) return BadRequest("UsuarioId informado não existe.");

        var registradoPorId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var registradoPor = await _context.Usuarios.FindAsync(registradoPorId);

        var nomeArquivo = $"{dto.UsuarioId}/{Guid.NewGuid()}{Path.GetExtension(arquivo.FileName)}";
        var arquivoUrl = await _storageService.UploadArquivoAsync(arquivo, "documentos-usuario", nomeArquivo);

        var documento = new DocumentoUsuario
        {
            Id = Guid.NewGuid(),
            UsuarioId = dto.UsuarioId,
            Tipo = dto.Tipo,
            Descricao = dto.Descricao,
            ArquivoUrl = arquivoUrl,
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
            ArquivoUrl = documento.ArquivoUrl,
            Data = documento.Data,
            RegistradoPor = registradoPor!.Nome
        };

        return CreatedAtAction(nameof(GetPorUsuario), new { usuarioId = dto.UsuarioId }, response);
    }
}