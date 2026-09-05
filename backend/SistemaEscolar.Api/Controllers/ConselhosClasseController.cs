using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Infrastructure.Data;

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
        var conselhos = await _context.ConselhosClasse
            .Include(c => c.Aluno).ThenInclude(a => a.Usuario)
            .Include(c => c.AnoLetivo)
            .ToListAsync();

        var response = new List<ConselhoClasseResponseDto>();

        foreach (var c in conselhos)
        {
            var votos = await _context.VotosConselho
                .Where(v => v.ConselhoClasseId == c.Id)
                .ToListAsync();

            response.Add(new ConselhoClasseResponseDto
            {
                Id = c.Id,
                NomeAluno = c.Aluno.Usuario.Nome,
                AnoLetivo = c.AnoLetivo.Ano,
                Data = c.Data,
                Resultado = c.Resultado,
                VotosAprovar = votos.Count(v => v.Voto == TipoVoto.Aprovar),
                VotosReprovar = votos.Count(v => v.Voto == TipoVoto.Reprovar)
            });
        }

        return Ok(response);
    }

    [HttpPost("{id}/votar")]
    public async Task<ActionResult<ConselhoClasseResponseDto>> Votar(Guid id, RegistrarVotoDto dto)
    {
        var conselho = await _context.ConselhosClasse
            .Include(c => c.Aluno).ThenInclude(a => a.Usuario)
            .Include(c => c.AnoLetivo)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (conselho is null) return NotFound();

        if (conselho.Resultado != ResultadoConselho.PendenteVotacao)
            return BadRequest("Esse conselho já foi encerrado.");

        var professorExiste = await _context.Professores.AnyAsync(p => p.Id == dto.ProfessorId);
        if (!professorExiste) return BadRequest("ProfessorId informado não existe.");

        var jaVotou = await _context.VotosConselho
            .AnyAsync(v => v.ConselhoClasseId == id && v.ProfessorId == dto.ProfessorId);
        if (jaVotou) return BadRequest("Esse professor já votou nesse conselho.");

        var voto = new VotoConselho
        {
            Id = Guid.NewGuid(),
            ConselhoClasseId = id,
            ProfessorId = dto.ProfessorId,
            Voto = dto.Voto
        };

        _context.VotosConselho.Add(voto);
        await _context.SaveChangesAsync();

        var votos = await _context.VotosConselho
            .Where(v => v.ConselhoClasseId == id)
            .ToListAsync();

        var response = new ConselhoClasseResponseDto
        {
            Id = conselho.Id,
            NomeAluno = conselho.Aluno.Usuario.Nome,
            AnoLetivo = conselho.AnoLetivo.Ano,
            Data = conselho.Data,
            Resultado = conselho.Resultado,
            VotosAprovar = votos.Count(v => v.Voto == TipoVoto.Aprovar),
            VotosReprovar = votos.Count(v => v.Voto == TipoVoto.Reprovar)
        };

        return Ok(response);
    }

    [HttpPost("{id}/encerrar")]
    public async Task<ActionResult<ConselhoClasseResponseDto>> Encerrar(Guid id)
    {
        var conselho = await _context.ConselhosClasse
            .Include(c => c.Aluno).ThenInclude(a => a.Usuario)
            .Include(c => c.AnoLetivo)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (conselho is null) return NotFound();

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

        var response = new ConselhoClasseResponseDto
        {
            Id = conselho.Id,
            NomeAluno = conselho.Aluno.Usuario.Nome,
            AnoLetivo = conselho.AnoLetivo.Ano,
            Data = conselho.Data,
            Resultado = conselho.Resultado,
            VotosAprovar = votosAprovar,
            VotosReprovar = votosReprovar
        };

        return Ok(response);
    }
}