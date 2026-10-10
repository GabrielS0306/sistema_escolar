using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConselhosClasseController : ControllerBase
{
    private readonly AppDbContext _context;

    public ConselhosClasseController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ConselhoClasseResponseDto>>> GetAll()
    {
        var professorId = await ObterProfessorLogadoId();

        var conselhos = await ProjetarConselhos(professorId)
            .OrderBy(c => c.Resultado != ResultadoConselho.PendenteVotacao)
            .ThenByDescending(c => c.Data)
            .ToListAsync();

        return Ok(conselhos);
    }

    [HttpPost("{id}/votar")]
    [Authorize(Roles = "Professor")]
    public async Task<ActionResult<ConselhoClasseResponseDto>> Votar(Guid id, RegistrarVotoDto dto)
    {
        var conselho = await _context.ConselhosClasse.FindAsync(id);
        if (conselho is null) return NotFound();

        if (conselho.Resultado != ResultadoConselho.PendenteVotacao)
            return BadRequest("Esse conselho já foi encerrado.");

        // O professor vem do token, não do corpo — senão um professor poderia votar no lugar de outro.
        var professorId = await ObterProfessorLogadoId();
        if (professorId is null) return BadRequest("Usuário logado não tem perfil de professor.");

        var jaVotou = await _context.VotosConselho
            .AnyAsync(v => v.ConselhoClasseId == id && v.ProfessorId == professorId);
        if (jaVotou) return BadRequest("Você já votou nesse conselho.");

        var voto = new VotoConselho
        {
            Id = Guid.NewGuid(),
            ConselhoClasseId = id,
            ProfessorId = professorId.Value,
            Voto = dto.Voto
        };

        _context.VotosConselho.Add(voto);
        await _context.SaveChangesAsync();

        return Ok(await ProjetarConselhos(professorId).FirstAsync(c => c.Id == id));
    }

    [HttpPost("{id}/encerrar")]
    [Authorize(Roles = "Admin,Coordenador")]
    public async Task<ActionResult<ConselhoClasseResponseDto>> Encerrar(Guid id)
    {
        var conselho = await _context.ConselhosClasse.FindAsync(id);
        if (conselho is null) return NotFound();

        if (conselho.Resultado != ResultadoConselho.PendenteVotacao)
            return BadRequest("Esse conselho já foi encerrado.");

        var votos = await _context.VotosConselho
            .Where(v => v.ConselhoClasseId == id)
            .ToListAsync();

        if (votos.Count == 0) return BadRequest("Nenhum voto registrado ainda.");

        var votosAprovar = votos.Count(v => v.Voto == TipoVoto.Aprovar);
        var votosReprovar = votos.Count(v => v.Voto == TipoVoto.Reprovar);

        conselho.Resultado = votosAprovar > votosReprovar
            ? ResultadoConselho.Aprovado
            : ResultadoConselho.Reprovado;

        await _context.SaveChangesAsync();

        return Ok(await ProjetarConselhos(null).FirstAsync(c => c.Id == id));
    }

    private async Task<Guid?> ObterProfessorLogadoId()
    {
        if (!User.IsInRole("Professor")) return null;

        var usuarioId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        return await _context.Professores
            .Where(p => p.UsuarioId == usuarioId)
            .Select(p => (Guid?)p.Id)
            .FirstOrDefaultAsync();
    }

    // Uma única consulta por listagem: contagem de votos, voto do professor logado e disciplinas reprovadas no ano.
    private IQueryable<ConselhoClasseResponseDto> ProjetarConselhos(Guid? professorId)
    {
        return _context.ConselhosClasse.Select(c => new ConselhoClasseResponseDto
        {
            Id = c.Id,
            AlunoId = c.AlunoId,
            NomeAluno = c.Aluno.Usuario.Nome,
            Matricula = c.Aluno.Matricula,
            AnoLetivo = c.AnoLetivo.Ano,
            Data = c.Data,
            Resultado = c.Resultado,
            VotosAprovar = _context.VotosConselho.Count(v => v.ConselhoClasseId == c.Id && v.Voto == TipoVoto.Aprovar),
            VotosReprovar = _context.VotosConselho.Count(v => v.ConselhoClasseId == c.Id && v.Voto == TipoVoto.Reprovar),
            MeuVoto = _context.VotosConselho
                .Where(v => v.ConselhoClasseId == c.Id && v.ProfessorId == professorId)
                .Select(v => (TipoVoto?)v.Voto)
                .FirstOrDefault(),
            DisciplinasReprovadas = _context.SituacoesDisciplina
                .Where(s => s.AlunoId == c.AlunoId
                    && s.Status == StatusDisciplina.Reprovado
                    && s.ProfessorTurmaDisciplina.Turma.AnoLetivoId == c.AnoLetivoId)
                .Select(s => s.ProfessorTurmaDisciplina.Disciplina.Nome)
                .ToList()
        });
    }
}
