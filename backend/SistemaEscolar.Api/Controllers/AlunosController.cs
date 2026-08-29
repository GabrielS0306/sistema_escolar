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
}