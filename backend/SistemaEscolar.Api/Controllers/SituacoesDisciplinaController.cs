using SistemaEscolar.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SituacoesDisciplinaController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly SistemaEscolar.Api.Services.AcessoAlunoService _acessoAluno;

    public SituacoesDisciplinaController(AppDbContext context, SistemaEscolar.Api.Services.AcessoAlunoService acessoAluno)
    {
        _context = context;
        _acessoAluno = acessoAluno;
    }

    [HttpGet("aluno/{alunoId}")]
    public async Task<ActionResult<IEnumerable<SituacaoDisciplinaResponseDto>>> GetPorAluno(Guid alunoId)
    {
        if (!await _acessoAluno.PodeVerAluno(User, alunoId)) return Forbid();

        var situacoes = await _context.SituacoesDisciplina
            .Include(s => s.Aluno).ThenInclude(a => a.Usuario)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Turma)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Disciplina)
            .Where(s => s.AlunoId == alunoId)
            .Select(s => new SituacaoDisciplinaResponseDto
            {
                Id = s.Id,
                NomeAluno = s.Aluno.Usuario.Nome,
                Disciplina = s.ProfessorTurmaDisciplina.Disciplina.Nome,
                Turma = s.ProfessorTurmaDisciplina.Turma.Nome,
                MediaFinal = s.MediaFinal,
                Status = s.Status
            })
            .ToListAsync();

        return Ok(situacoes);
    }

    [HttpGet("recuperacao")]
    [Authorize(Roles = "Admin,Coordenador")]
    public async Task<ActionResult<IEnumerable<SituacaoRecuperacaoResponseDto>>> GetEmRecuperacao()
    {
        var situacoes = await _context.SituacoesDisciplina
            .Where(s => s.Status == StatusDisciplina.EmRecuperacao)
            .OrderBy(s => s.Aluno.Usuario.Nome)
            .ThenBy(s => s.ProfessorTurmaDisciplina.Disciplina.Nome)
            .Select(s => new SituacaoRecuperacaoResponseDto
            {
                Id = s.Id,
                AlunoId = s.AlunoId,
                NomeAluno = s.Aluno.Usuario.Nome,
                Matricula = s.Aluno.Matricula,
                Disciplina = s.ProfessorTurmaDisciplina.Disciplina.Nome,
                Turma = s.ProfessorTurmaDisciplina.Turma.Nome,
                AnoLetivo = s.ProfessorTurmaDisciplina.Turma.AnoLetivo.Ano,
                MediaFinal = s.MediaFinal
            })
            .ToListAsync();

        return Ok(situacoes);
    }

    [HttpPost("{id}/prova-final")]
    [Authorize(Roles = "Admin,Coordenador")]
    public async Task<ActionResult<SituacaoDisciplinaResponseDto>> RegistrarProvaFinal(Guid id, RegistrarProvaFinalDto dto)
    {
        var situacao = await _context.SituacoesDisciplina
            .Include(s => s.Aluno).ThenInclude(a => a.Usuario)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Turma)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Disciplina)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (situacao is null) return NotFound();

        if (dto.NotaProvaFinal < 0 || dto.NotaProvaFinal > 10)
            return BadRequest("A nota da prova final deve estar entre 0 e 10.");

        if (situacao.Status != StatusDisciplina.EmRecuperacao)
            return BadRequest("Essa situação não está em recuperação (não precisa de prova final).");

        situacao.NotaProvaFinal = dto.NotaProvaFinal;

        var mediaComProvaFinal = (situacao.MediaFinal!.Value + dto.NotaProvaFinal) / 2;

        situacao.Status = mediaComProvaFinal >= 6
            ? StatusDisciplina.Aprovado
            : StatusDisciplina.Reprovado;

        await _context.SaveChangesAsync();

        if (situacao.Status == StatusDisciplina.Reprovado)
        {
            await VerificarNecessidadeConselho(situacao.AlunoId, situacao.ProfessorTurmaDisciplina.TurmaId);
        }

        var response = new SituacaoDisciplinaResponseDto
        {
            Id = situacao.Id,
            NomeAluno = situacao.Aluno.Usuario.Nome,
            Disciplina = situacao.ProfessorTurmaDisciplina.Disciplina.Nome,
            Turma = situacao.ProfessorTurmaDisciplina.Turma.Nome,
            MediaFinal = situacao.MediaFinal,
            Status = situacao.Status
        };

        return Ok(response);
    }

    private async Task VerificarNecessidadeConselho(Guid alunoId, Guid turmaId)
    {
        var turma = await _context.Turmas.FindAsync(turmaId);
        if (turma is null) return;

        // Só contam as reprovações do mesmo ano letivo da turma.
        var totalReprovadas = await _context.SituacoesDisciplina
            .CountAsync(s => s.AlunoId == alunoId
                && s.Status == StatusDisciplina.Reprovado
                && s.ProfessorTurmaDisciplina.Turma.AnoLetivoId == turma.AnoLetivoId);

        if (totalReprovadas < 3) return;

        // Um conselho por aluno por ano letivo — mesmo que o anterior já tenha sido encerrado.
        var jaExisteConselho = await _context.ConselhosClasse
            .AnyAsync(c => c.AlunoId == alunoId && c.AnoLetivoId == turma.AnoLetivoId);

        if (jaExisteConselho) return;

        var conselho = new ConselhoClasse
        {
            Id = Guid.NewGuid(),
            AlunoId = alunoId,
            AnoLetivoId = turma.AnoLetivoId,
            Data = DateTime.UtcNow,
            Resultado = ResultadoConselho.PendenteVotacao
        };

        _context.ConselhosClasse.Add(conselho);
        await _context.SaveChangesAsync();
    }
}