using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities.Perfis;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlunosController : ControllerBase
{
    private readonly AppDbContext _context;

    public AlunosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AlunoResponseDto>>> GetAll()
    {
        var alunos = await _context.Alunos
            .Include(a => a.Usuario)
            .Select(a => new AlunoResponseDto
            {
                Id = a.Id,
                Matricula = a.Matricula,
                DataNascimento = a.DataNascimento,
                NomeUsuario = a.Usuario.Nome
            })
            .ToListAsync();

        return Ok(alunos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AlunoResponseDto>> GetById(Guid id)
    {
        var aluno = await _context.Alunos
            .Include(a => a.Usuario)
            .Where(a => a.Id == id)
            .Select(a => new AlunoResponseDto
            {
                Id = a.Id,
                Matricula = a.Matricula,
                DataNascimento = a.DataNascimento,
                NomeUsuario = a.Usuario.Nome
            })
            .FirstOrDefaultAsync();

        if (aluno is null) return NotFound();

        return Ok(aluno);
    }

    [HttpPost]
    public async Task<ActionResult<AlunoResponseDto>> Create(CreateAlunoDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario is null) return BadRequest("UsuarioId informado não existe.");

        var aluno = new Aluno
        {
            Id = Guid.NewGuid(),
            UsuarioId = dto.UsuarioId,
            Matricula = dto.Matricula,
            DataNascimento = dto.DataNascimento
        };

        _context.Alunos.Add(aluno);
        await _context.SaveChangesAsync();

        var response = new AlunoResponseDto
        {
            Id = aluno.Id,
            Matricula = aluno.Matricula,
            DataNascimento = aluno.DataNascimento,
            NomeUsuario = usuario.Nome
        };

        return CreatedAtAction(nameof(GetById), new { id = aluno.Id }, response);
    }

    [HttpGet("{id}/resumo")]
    public async Task<ActionResult<ResumoAlunoResponseDto>> GetResumo(Guid id)
    {
        var aluno = await _context.Alunos
            .Include(a => a.Usuario)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (aluno is null) return NotFound();

        var situacoes = await _context.SituacoesDisciplina
            .Include(s => s.Aluno).ThenInclude(a => a.Usuario)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Turma)
            .Include(s => s.ProfessorTurmaDisciplina).ThenInclude(v => v.Disciplina)
            .Where(s => s.AlunoId == id)
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

        var frequencias = await _context.Frequencias
            .Include(f => f.Aluno).ThenInclude(a => a.Usuario)
            .Where(f => f.AlunoId == id)
            .Select(f => new FrequenciaResponseDto
            {
                Id = f.Id,
                NomeAluno = f.Aluno.Usuario.Nome,
                Data = f.Data,
                Presente = f.Presente
            })
            .ToListAsync();

        var notas = await _context.Notas
            .Include(n => n.Avaliacao)
            .Where(n => n.AlunoId == id)
            .Select(n => new NotaComAvaliacaoResponseDto
            {
                Id = n.Id,
                Valor = n.Valor,
                Bimestre = n.Avaliacao.Bimestre,
                NomeAvaliacao = n.Avaliacao.Nome
            })
            .ToListAsync();

        var ocorrencias = await _context.Ocorrencias
            .Include(o => o.Aluno).ThenInclude(a => a.Usuario)
            .Include(o => o.RegistradoPorUsuario)
            .Where(o => o.AlunoId == id)
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

        var response = new ResumoAlunoResponseDto
        {
            NomeAluno = aluno.Usuario.Nome,
            Matricula = aluno.Matricula,
            SituacoesDisciplina = situacoes,
            Frequencias = frequencias,
            Notas = notas,
            Ocorrencias = ocorrencias
        };

        return Ok(response);
    }
}