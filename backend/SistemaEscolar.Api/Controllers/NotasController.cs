using SistemaEscolar.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using SistemaEscolar.Api.Services;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotasController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("lancar")]
    public async Task<ActionResult<IEnumerable<NotaResponseDto>>> Lancar(LancarNotasDto dto)
    {
        var avaliacao = await _context.Avaliacoes.FirstOrDefaultAsync(a => a.Id == dto.AvaliacaoId);
        if (avaliacao is null) return BadRequest("AvaliacaoId informado não existe.");

        var notas = new List<Nota>();

        foreach (var item in dto.Notas)
        {
            var alunoExiste = await _context.Alunos.AnyAsync(a => a.Id == item.AlunoId);
            if (!alunoExiste) return BadRequest($"AlunoId {item.AlunoId} não existe.");

            notas.Add(new Nota
            {
                Id = Guid.NewGuid(),
                AvaliacaoId = dto.AvaliacaoId,
                AlunoId = item.AlunoId,
                Valor = item.Valor
            });
        }

        _context.Notas.AddRange(notas);
        await _context.SaveChangesAsync();

        foreach (var nota in notas)
        {
            await AtualizarSituacaoDisciplina(nota.AlunoId, avaliacao.ProfessorTurmaDisciplinaId);
        }

        var alunoIds = notas.Select(n => n.AlunoId).ToList();
        var nomesAlunos = await _context.Alunos
            .Include(a => a.Usuario)
            .Where(a => alunoIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => a.Usuario.Nome);

        var response = notas.Select(n => new NotaResponseDto
        {
            Id = n.Id,
            NomeAluno = nomesAlunos[n.AlunoId],
            Valor = n.Valor
        });

        return Ok(response);
    }

    [HttpGet("aluno/{alunoId}")]
    public async Task<ActionResult<IEnumerable<NotaComAvaliacaoResponseDto>>> GetPorAluno(Guid alunoId)
    {
        var notas = await _context.Notas
            .Include(n => n.Avaliacao)
            .Where(n => n.AlunoId == alunoId)
            .Select(n => new NotaComAvaliacaoResponseDto
            {
                Id = n.Id,
                Valor = n.Valor,
                Bimestre = n.Avaliacao.Bimestre,
                NomeAvaliacao = n.Avaliacao.Nome
            })
            .ToListAsync();

        return Ok(notas);
    }

    private async Task AtualizarSituacaoDisciplina(Guid alunoId, Guid professorTurmaDisciplinaId)
    {
        var notasDoAluno = await _context.Notas
            .Include(n => n.Avaliacao)
            .Where(n => n.AlunoId == alunoId
                    && n.Avaliacao.ProfessorTurmaDisciplinaId == professorTurmaDisciplinaId)
            .ToListAsync();

        var mediasPorBimestre = new List<decimal>();

        for (int bimestre = 1; bimestre <= 4; bimestre++)
        {
            var notasDoBimestre = notasDoAluno
                .Where(n => n.Avaliacao.Bimestre == bimestre)
                .ToList();

            var tiposLancados = notasDoBimestre
                .Select(n => n.Avaliacao.Tipo)
                .Distinct()
                .ToList();

            var tiposObrigatorios = new[]
            {
                TipoAvaliacao.Comportamento,
                TipoAvaliacao.Atividade,
                TipoAvaliacao.ProvaBimestral
            };

            var bimestreCompleto = tiposObrigatorios.All(t => tiposLancados.Contains(t));
            if (!bimestreCompleto) return;

            var mediaBimestre = notasDoBimestre.Average(n => n.Valor);
            mediasPorBimestre.Add(mediaBimestre);
        }

        var mediaFinal = mediasPorBimestre.Average();

        var situacao = await _context.SituacoesDisciplina
            .FirstOrDefaultAsync(s => s.AlunoId == alunoId && s.ProfessorTurmaDisciplinaId == professorTurmaDisciplinaId);

        if (situacao is null)
        {
            situacao = new SituacaoDisciplina
            {
                Id = Guid.NewGuid(),
                AlunoId = alunoId,
                ProfessorTurmaDisciplinaId = professorTurmaDisciplinaId
            };
            _context.SituacoesDisciplina.Add(situacao);
        }

        situacao.MediaFinal = mediaFinal;
        situacao.Status = mediaFinal >= 6
            ? StatusDisciplina.Aprovado
            : StatusDisciplina.EmRecuperacao;

        await _context.SaveChangesAsync();
    }

    [HttpPost("importar")]
    public async Task<ActionResult<IEnumerable<NotaResponseDto>>> Importar([FromQuery] Guid avaliacaoId, IFormFile arquivo)
    {
        var avaliacao = await _context.Avaliacoes.FirstOrDefaultAsync(a => a.Id == avaliacaoId);
        if (avaliacao is null) return BadRequest($"AvaliacaoId recebido: '{avaliacaoId}' — não existe.");

        List<Dictionary<string, string>> linhas;
        try
        {
            linhas = PlanilhaReader.Ler(arquivo);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        var notas = new List<Nota>();
        var erros = new List<string>();

        foreach (var linha in linhas)
        {
            if (!linha.TryGetValue("Matricula", out var matricula) || !linha.TryGetValue("Valor", out var valorTexto))
            {
                erros.Add("Linha sem coluna Matricula ou Valor.");
                continue;
            }

            var aluno = await _context.Alunos.FirstOrDefaultAsync(a => a.Matricula == matricula);
            if (aluno is null)
            {
                erros.Add($"Matrícula {matricula} não encontrada.");
                continue;
            }

            if (!decimal.TryParse(valorTexto, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var valor))
            {
                erros.Add($"Valor inválido para matrícula {matricula}: '{valorTexto}'.");
                continue;
            }

            notas.Add(new Nota
            {
                Id = Guid.NewGuid(),
                AvaliacaoId = avaliacaoId,
                AlunoId = aluno.Id,
                Valor = valor
            });
        }

        if (notas.Count == 0)
            return BadRequest(new { mensagem = "Nenhuma nota válida encontrada.", erros });

        _context.Notas.AddRange(notas);
        await _context.SaveChangesAsync();

        foreach (var nota in notas)
            await AtualizarSituacaoDisciplina(nota.AlunoId, avaliacao.ProfessorTurmaDisciplinaId);

        var alunoIds = notas.Select(n => n.AlunoId).ToList();
        var nomesAlunos = await _context.Alunos
            .Include(a => a.Usuario)
            .Where(a => alunoIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => a.Usuario.Nome);

        var response = notas.Select(n => new NotaResponseDto
        {
            Id = n.Id,
            NomeAluno = nomesAlunos[n.AlunoId],
            Valor = n.Valor
        });

        return Ok(new { importadas = response, erros });
    }
}