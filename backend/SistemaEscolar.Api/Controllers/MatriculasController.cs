using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatriculasController : ControllerBase
{
    private readonly AppDbContext _context;

    public MatriculasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MatriculaResponseDto>>> GetAll()
    {
        var matriculas = await _context.Matriculas
            .Include(m => m.Aluno).ThenInclude(a => a.Usuario)
            .Include(m => m.Turma)
            .Select(m => new MatriculaResponseDto
            {
                Id = m.Id,
                NomeAluno = m.Aluno.Usuario.Nome,
                Matricula = m.Aluno.Matricula,
                Turma = m.Turma.Nome,
                DataMatricula = m.DataMatricula
            })
            .ToListAsync();

        return Ok(matriculas);
    }

    [HttpPost]
    public async Task<ActionResult<MatriculaResponseDto>> Create(CreateMatriculaDto dto)
    {
        var aluno = await _context.Alunos
            .Include(a => a.Usuario)
            .FirstOrDefaultAsync(a => a.Id == dto.AlunoId);
        if (aluno is null) return BadRequest("AlunoId informado não existe.");

        var turma = await _context.Turmas.FindAsync(dto.TurmaId);
        if (turma is null) return BadRequest("TurmaId informado não existe.");

        var matricula = new Matricula
        {
            Id = Guid.NewGuid(),
            AlunoId = dto.AlunoId,
            TurmaId = dto.TurmaId,
            DataMatricula = DateTime.UtcNow
        };

        _context.Matriculas.Add(matricula);
        await _context.SaveChangesAsync();

        var response = new MatriculaResponseDto
        {
            Id = matricula.Id,
            NomeAluno = aluno.Usuario.Nome,
            Matricula = aluno.Matricula,
            Turma = turma.Nome,
            DataMatricula = matricula.DataMatricula
        };

        return CreatedAtAction(nameof(GetAll), response);
    }
}