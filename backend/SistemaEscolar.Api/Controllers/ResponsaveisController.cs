using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Api.DTOs;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Domain.Entities.Perfis;
using SistemaEscolar.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace SistemaEscolar.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResponsaveisController : ControllerBase
{
    private readonly AppDbContext _context;

    public ResponsaveisController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResponsavelResponseDto>>> GetAll()
    {
        var responsaveis = await _context.Responsaveis
            .Include(r => r.Usuario)
            .Select(r => new ResponsavelResponseDto { Id = r.Id, NomeUsuario = r.Usuario.Nome })
            .ToListAsync();

        return Ok(responsaveis);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Coordenador")]
    public async Task<ActionResult<ResponsavelResponseDto>> Create(CreateResponsavelDto dto)
    {
        var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
        if (usuario is null) return BadRequest("UsuarioId informado não existe.");

        var responsavel = new Responsavel { Id = Guid.NewGuid(), UsuarioId = dto.UsuarioId };

        _context.Responsaveis.Add(responsavel);
        await _context.SaveChangesAsync();

        var response = new ResponsavelResponseDto { Id = responsavel.Id, NomeUsuario = usuario.Nome };

        return CreatedAtAction(nameof(GetAll), response);
    }

    [HttpPost("{id}/vincular-aluno")]
    [Authorize(Roles = "Admin,Coordenador")]
    public async Task<ActionResult> VincularAluno(Guid id, VincularAlunoDto dto)
    {
        var responsavel = await _context.Responsaveis.FindAsync(id);
        if (responsavel is null) return NotFound();

        var aluno = await _context.Alunos.FindAsync(dto.AlunoId);
        if (aluno is null) return BadRequest("AlunoId informado não existe.");

        var jaVinculado = await _context.ResponsaveisAlunos
            .AnyAsync(ra => ra.ResponsavelId == id && ra.AlunoId == dto.AlunoId);
        if (jaVinculado) return BadRequest("Esse responsável já está vinculado a esse aluno.");

        var vinculo = new ResponsavelAluno
        {
            Id = Guid.NewGuid(),
            ResponsavelId = id,
            AlunoId = dto.AlunoId
        };

        _context.ResponsaveisAlunos.Add(vinculo);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("{id}/alunos")]
    public async Task<ActionResult<IEnumerable<object>>> GetAlunosVinculados(Guid id)
    {
        var alunos = await _context.ResponsaveisAlunos
            .Include(ra => ra.Aluno).ThenInclude(a => a.Usuario)
            .Where(ra => ra.ResponsavelId == id)
            .Select(ra => new { ra.Aluno.Id, Nome = ra.Aluno.Usuario.Nome, ra.Aluno.Matricula })
            .ToListAsync();

        return Ok(alunos);
    }
}