using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
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
}