using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Api.Services;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OcorrenciasController : ControllerBase
{
    private const int LimiteRecentes = 50;

    private readonly AppDbContext _context;
    private readonly AcessoAlunoService _acessoAluno;

    public OcorrenciasController(AppDbContext context, AcessoAlunoService acessoAluno)
    {
        _context = context;
        _acessoAluno = acessoAluno;
    }

    [HttpGet("aluno/{alunoId}")]
    public async Task<ActionResult<IEnumerable<OcorrenciaResponseDto>>> GetPorAluno(Guid alunoId)
    {
        if (!await _acessoAluno.PodeVerAluno(User, alunoId)) return Forbid();

        var ocorrencias = await Projetar(_context.Ocorrencias.Where(o => o.AlunoId == alunoId))
            .OrderByDescending(o => o.Data)
            .ToListAsync();

        return Ok(ocorrencias);
    }

    // Últimas ocorrências da escola toda, para quem acompanha o dia a dia (secretaria/portaria e gestão).
    [HttpGet("recentes")]
    [Authorize(Roles = "Admin,Coordenador,Funcionario")]
    public async Task<ActionResult<IEnumerable<OcorrenciaResponseDto>>> GetRecentes()
    {
        var ocorrencias = await Projetar(_context.Ocorrencias)
            .OrderByDescending(o => o.Data)
            .Take(LimiteRecentes)
            .ToListAsync();

        return Ok(ocorrencias);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Coordenador,Professor,Funcionario")]
    public async Task<ActionResult<OcorrenciaResponseDto>> Create(CreateOcorrenciaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao)) return BadRequest("A descrição é obrigatória.");

        var alunoExiste = await _context.Alunos.AnyAsync(a => a.Id == dto.AlunoId);
        if (!alunoExiste) return BadRequest("AlunoId informado não existe.");

        // Quem registra vem do token, não do corpo — senão daria para registrar em nome de outra pessoa.
        var usuarioId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        var ocorrencia = new Ocorrencia
        {
            Id = Guid.NewGuid(),
            AlunoId = dto.AlunoId,
            RegistradoPorUsuarioId = usuarioId,
            Tipo = dto.Tipo,
            Descricao = dto.Descricao.Trim(),
            Data = DateTime.UtcNow
        };

        _context.Ocorrencias.Add(ocorrencia);
        await _context.SaveChangesAsync();

        var response = await Projetar(_context.Ocorrencias).FirstAsync(o => o.Id == ocorrencia.Id);

        return CreatedAtAction(nameof(GetPorAluno), new { alunoId = ocorrencia.AlunoId }, response);
    }

    [HttpGet("turma/{turmaId}")]
    [Authorize(Roles = "Admin,Coordenador,Professor")]
    public async Task<ActionResult<IEnumerable<OcorrenciaResponseDto>>> GetPorTurma(Guid turmaId)
    {
        var ocorrencias = await Projetar(_context.Ocorrencias
                .Where(o => _context.Matriculas.Any(m => m.AlunoId == o.AlunoId && m.TurmaId == turmaId)))
            .OrderByDescending(o => o.Data)
            .ToListAsync();

        return Ok(ocorrencias);
    }

    private static IQueryable<OcorrenciaResponseDto> Projetar(IQueryable<Ocorrencia> query)
    {
        return query.Select(o => new OcorrenciaResponseDto
        {
            Id = o.Id,
            NomeAluno = o.Aluno.Usuario.Nome,
            RegistradoPor = o.RegistradoPorUsuario.Nome,
            Tipo = o.Tipo,
            Descricao = o.Descricao,
            Data = o.Data
        });
    }
}
