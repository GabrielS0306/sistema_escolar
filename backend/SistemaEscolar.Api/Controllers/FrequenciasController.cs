using SistemaEscolar.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using SistemaEscolar.Api.Services;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FrequenciasController : ControllerBase
{
    private readonly AppDbContext _context;

    public FrequenciasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("registrar")]
    [Authorize(Roles = "Admin,Coordenador,Professor")]
    public async Task<ActionResult<IEnumerable<FrequenciaResponseDto>>> Registrar(RegistrarFrequenciaDto dto)
    {
        var vinculoExiste = await _context.ProfessorTurmaDisciplinas.AnyAsync(v => v.Id == dto.ProfessorTurmaDisciplinaId);
        if (!vinculoExiste) return BadRequest("ProfessorTurmaDisciplinaId informado não existe.");

        var frequencias = new List<Frequencia>();

        foreach (var presenca in dto.Presencas)
        {
            var alunoExiste = await _context.Alunos.AnyAsync(a => a.Id == presenca.AlunoId);
            if (!alunoExiste) return BadRequest($"AlunoId {presenca.AlunoId} não existe.");

            frequencias.Add(new Frequencia
            {
                Id = Guid.NewGuid(),
                ProfessorTurmaDisciplinaId = dto.ProfessorTurmaDisciplinaId,
                AlunoId = presenca.AlunoId,
                Data = dto.Data,
                Presente = presenca.Presente
            });
        }

        _context.Frequencias.AddRange(frequencias);
        await _context.SaveChangesAsync();

        var alunoIds = frequencias.Select(f => f.AlunoId).ToList();
        var nomesAlunos = await _context.Alunos
            .Include(a => a.Usuario)
            .Where(a => alunoIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => a.Usuario.Nome);

        var response = frequencias.Select(f => new FrequenciaResponseDto
        {
            Id = f.Id,
            NomeAluno = nomesAlunos[f.AlunoId],
            Data = f.Data,
            Presente = f.Presente
        });

        return Ok(response);
    }

    [HttpGet("aluno/{alunoId}")]
    public async Task<ActionResult<IEnumerable<FrequenciaResponseDto>>> GetPorAluno(Guid alunoId)
    {
        var frequencias = await _context.Frequencias
            .Include(f => f.Aluno).ThenInclude(a => a.Usuario)
            .Where(f => f.AlunoId == alunoId)
            .Select(f => new FrequenciaResponseDto
            {
                Id = f.Id,
                NomeAluno = f.Aluno.Usuario.Nome,
                Data = f.Data,
                Presente = f.Presente
            })
            .ToListAsync();

        return Ok(frequencias);
    }

    [HttpPost("importar")]
    [Authorize(Roles = "Admin,Coordenador,Professor")]
    public async Task<ActionResult<IEnumerable<FrequenciaResponseDto>>> Importar([FromQuery] Guid professorTurmaDisciplinaId, [FromQuery] DateTime data, IFormFile arquivo)
    {
        var vinculoExiste = await _context.ProfessorTurmaDisciplinas.AnyAsync(v => v.Id == professorTurmaDisciplinaId);
        if (!vinculoExiste) return BadRequest("ProfessorTurmaDisciplinaId informado não existe.");

        List<Dictionary<string, string>> linhas;
        try
        {
            linhas = PlanilhaReader.Ler(arquivo);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        var frequencias = new List<Frequencia>();
        var erros = new List<string>();

        foreach (var linha in linhas)
        {
            if (!linha.TryGetValue("Matricula", out var matricula) || !linha.TryGetValue("Presente", out var presenteTexto))
            {
                erros.Add("Linha sem coluna Matricula ou Presente.");
                continue;
            }

            var aluno = await _context.Alunos.FirstOrDefaultAsync(a => a.Matricula == matricula);
            if (aluno is null)
            {
                erros.Add($"Matrícula {matricula} não encontrada.");
                continue;
            }

            var presente = presenteTexto.Trim().ToLowerInvariant() is "1" or "true" or "sim" or "presente";

            frequencias.Add(new Frequencia
            {
                Id = Guid.NewGuid(),
                ProfessorTurmaDisciplinaId = professorTurmaDisciplinaId,
                AlunoId = aluno.Id,
                Data = data,
                Presente = presente
            });
        }

        if (frequencias.Count == 0)
            return BadRequest(new { mensagem = "Nenhuma frequência válida encontrada.", erros });

        _context.Frequencias.AddRange(frequencias);
        await _context.SaveChangesAsync();

        var alunoIds = frequencias.Select(f => f.AlunoId).ToList();
        var nomesAlunos = await _context.Alunos
            .Include(a => a.Usuario)
            .Where(a => alunoIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => a.Usuario.Nome);

        var response = frequencias.Select(f => new FrequenciaResponseDto
        {
            Id = f.Id,
            NomeAluno = nomesAlunos[f.AlunoId],
            Data = f.Data,
            Presente = f.Presente
        });

        return Ok(new { importadas = response, erros });
    }
}