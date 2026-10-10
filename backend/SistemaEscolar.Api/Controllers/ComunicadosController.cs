using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComunicadosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ComunicadosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Coordenador")]
    public async Task<ActionResult<IEnumerable<ComunicadoResponseDto>>> GetAll()
    {
        var comunicados = await Projetar(_context.Comunicados)
            .OrderByDescending(c => c.DataEnvio)
            .ToListAsync();

        return Ok(comunicados);
    }

    // Comunicados que o usuário logado deve ver, de acordo com seus papéis.
    [HttpGet("me")]
    public async Task<ActionResult<IEnumerable<ComunicadoResponseDto>>> GetMeus()
    {
        if (User.IsInRole("Admin") || User.IsInRole("Coordenador")) return await GetAll();

        var usuarioId = ObterUsuarioLogadoId();
        var ehProfessor = User.IsInRole("Professor");
        var ehAlunoOuResponsavel = User.IsInRole("Aluno") || User.IsInRole("Responsavel");

        var turmaIds = await ObterTurmasDoUsuario(usuarioId);

        var comunicados = await Projetar(_context.Comunicados.Where(c =>
                c.PublicoAlvo == PublicoAlvoComunicado.TodaEscola
                || (c.PublicoAlvo == PublicoAlvoComunicado.Professores && ehProfessor)
                || (c.PublicoAlvo == PublicoAlvoComunicado.Alunos && ehAlunoOuResponsavel)
                || (c.PublicoAlvo == PublicoAlvoComunicado.Turma && c.TurmaId != null && turmaIds.Contains(c.TurmaId.Value))
                || c.AutorUsuarioId == usuarioId))
            .OrderByDescending(c => c.DataEnvio)
            .ToListAsync();

        return Ok(comunicados);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Coordenador,Professor")]
    public async Task<ActionResult<ComunicadoResponseDto>> Create(CreateComunicadoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Titulo) || string.IsNullOrWhiteSpace(dto.Mensagem))
            return BadRequest("Título e mensagem são obrigatórios.");

        if (dto.PublicoAlvo == PublicoAlvoComunicado.Turma && dto.TurmaId is null)
            return BadRequest("TurmaId é obrigatório quando o público-alvo é Turma.");

        // TurmaId só faz sentido para público Turma.
        var turmaId = dto.PublicoAlvo == PublicoAlvoComunicado.Turma ? dto.TurmaId : null;

        if (turmaId is not null && !await _context.Turmas.AnyAsync(t => t.Id == turmaId))
            return BadRequest("TurmaId informado não existe.");

        var usuarioId = ObterUsuarioLogadoId();
        var ehGestao = User.IsInRole("Admin") || User.IsInRole("Coordenador");

        // Professor só envia para turmas em que dá aula.
        if (!ehGestao)
        {
            if (dto.PublicoAlvo != PublicoAlvoComunicado.Turma)
                return BadRequest("Professor só pode enviar comunicados para uma turma.");

            var daAulaNaTurma = await _context.ProfessorTurmaDisciplinas
                .AnyAsync(v => v.TurmaId == turmaId && v.Professor.UsuarioId == usuarioId);
            if (!daAulaNaTurma) return BadRequest("Você não dá aula nessa turma.");
        }

        var comunicado = new Comunicado
        {
            Id = Guid.NewGuid(),
            Titulo = dto.Titulo.Trim(),
            Mensagem = dto.Mensagem.Trim(),
            PublicoAlvo = dto.PublicoAlvo,
            TurmaId = turmaId,
            AutorUsuarioId = usuarioId,
            DataEnvio = DateTime.UtcNow
        };

        _context.Comunicados.Add(comunicado);
        await _context.SaveChangesAsync();

        var response = await Projetar(_context.Comunicados).FirstAsync(c => c.Id == comunicado.Id);

        return CreatedAtAction(nameof(GetAll), response);
    }

    private Guid ObterUsuarioLogadoId()
    {
        return Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
    }

    // Turmas ligadas ao usuário: onde dá aula, onde está matriculado e onde os filhos estão matriculados.
    private async Task<List<Guid>> ObterTurmasDoUsuario(Guid usuarioId)
    {
        var turmasProfessor = _context.ProfessorTurmaDisciplinas
            .Where(v => v.Professor.UsuarioId == usuarioId)
            .Select(v => v.TurmaId);

        var turmasAluno = _context.Matriculas
            .Where(m => m.Aluno.UsuarioId == usuarioId)
            .Select(m => m.TurmaId);

        var turmasFilhos = _context.Matriculas
            .Where(m => _context.ResponsaveisAlunos
                .Any(ra => ra.AlunoId == m.AlunoId && ra.Responsavel.UsuarioId == usuarioId))
            .Select(m => m.TurmaId);

        return await turmasProfessor.Union(turmasAluno).Union(turmasFilhos).ToListAsync();
    }

    private static IQueryable<ComunicadoResponseDto> Projetar(IQueryable<Comunicado> query)
    {
        return query.Select(c => new ComunicadoResponseDto
        {
            Id = c.Id,
            Titulo = c.Titulo,
            Mensagem = c.Mensagem,
            PublicoAlvo = c.PublicoAlvo,
            Turma = c.Turma != null ? c.Turma.Nome : null,
            Autor = c.AutorUsuario != null ? c.AutorUsuario.Nome : null,
            DataEnvio = c.DataEnvio
        });
    }
}
