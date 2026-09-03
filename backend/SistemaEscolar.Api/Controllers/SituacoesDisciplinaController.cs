using SistemaEscolar.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SituacoesDisciplinaController : ControllerBase
{
    private readonly AppDbContext _context;

    public SituacoesDisciplinaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("aluno/{alunoId}")]
    public async Task<ActionResult<IEnumerable<SituacaoDisciplinaResponseDto>>> GetPorAluno(Guid alunoId)
    {
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

    [HttpPost("{id}/prova-final")]
    public async Task<ActionResult<SituacaoDisciplinaResponseDto>> RegistrarProvaFinal(Guid id, RegistrarProvaFinalDto dto)
    {
        var situacao = await _context.SituacoesDisciplina
            .Include(s => s.Aluno).ThenInclude(a => a.Usuario)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Turma)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Disciplina)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (situacao is null) return NotFound();

        if (situacao.Status != StatusDisciplina.EmRecuperacao)
            return BadRequest("Essa situação não está em recuperação (não precisa de prova final).");

        situacao.NotaProvaFinal = dto.NotaProvaFinal;

        var mediaComProvaFinal = (situacao.MediaFinal!.Value + dto.NotaProvaFinal) / 2;

        situacao.Status = mediaComProvaFinal >= 6
            ? StatusDisciplina.Aprovado
            : StatusDisciplina.Reprovado;

        await _context.SaveChangesAsync();

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
}