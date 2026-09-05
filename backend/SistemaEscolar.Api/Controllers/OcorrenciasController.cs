using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OcorrenciasController : ControllerBase
{
    private readonly AppDbContext _context;

    public OcorrenciasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("aluno/{alunoId}")]
    public async Task<ActionResult<IEnumerable<OcorrenciaResponseDto>>> GetPorAluno(Guid alunoId)
    {
        var ocorrencias = await _context.Ocorrencias
            .Include(o => o.Aluno).ThenInclude(a => a.Usuario)
            .Include(o => o.RegistradoPorUsuario)
            .Where(o => o.AlunoId == alunoId)
            .OrderByDescending(o => o.Data)
            .Select(o => new OcorrenciaResponseDto
            {
                Id = o.Id,
                NomeAluno = o.Aluno.Usuario.Nome,
                RegistradoPor = o.RegistradoPorUsuario.Nome,
                Tipo = o.Tipo,
                Descricao = o.Descricao,
                Data = o.Data
            })
            .ToListAsync();

        return Ok(ocorrencias);
    }

    [HttpPost]
    public async Task<ActionResult<OcorrenciaResponseDto>> Create(CreateOcorrenciaDto dto)
    {
        var aluno = await _context.Alunos
            .Include(a => a.Usuario)
            .FirstOrDefaultAsync(a => a.Id == dto.AlunoId);
        if (aluno is null) return BadRequest("AlunoId informado não existe.");

        var usuarioRegistrador = await _context.Usuarios.FindAsync(dto.RegistradoPorUsuarioId);
        if (usuarioRegistrador is null) return BadRequest("RegistradoPorUsuarioId informado não existe.");

        var ocorrencia = new Ocorrencia
        {
            Id = Guid.NewGuid(),
            AlunoId = dto.AlunoId,
            RegistradoPorUsuarioId = dto.RegistradoPorUsuarioId,
            Tipo = dto.Tipo,
            Descricao = dto.Descricao,
            Data = DateTime.UtcNow
        };

        _context.Ocorrencias.Add(ocorrencia);
        await _context.SaveChangesAsync();

        var response = new OcorrenciaResponseDto
        {
            Id = ocorrencia.Id,
            NomeAluno = aluno.Usuario.Nome,
            RegistradoPor = usuarioRegistrador.Nome,
            Tipo = ocorrencia.Tipo,
            Descricao = ocorrencia.Descricao,
            Data = ocorrencia.Data
        };

        return CreatedAtAction(nameof(GetPorAluno), new { alunoId = ocorrencia.AlunoId }, response);
    }
}