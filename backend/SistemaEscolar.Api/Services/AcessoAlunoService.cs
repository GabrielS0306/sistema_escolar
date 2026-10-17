using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Infrastructure.Data;

namespace SistemaEscolar.Api.Services;

// Regra única de quem pode ver dados acadêmicos de um aluno (notas, frequência, situações...).
public class AcessoAlunoService
{
    private readonly AppDbContext _context;

    public AcessoAlunoService(AppDbContext context)
    {
        _context = context;
    }

    // Equipe vê qualquer aluno; os demais, só o próprio cadastro ou o de um filho vinculado.
    public async Task<bool> PodeVerAluno(ClaimsPrincipal usuario, Guid alunoId)
    {
        var ehEquipe = usuario.IsInRole("Admin") || usuario.IsInRole("Coordenador")
            || usuario.IsInRole("Professor") || usuario.IsInRole("Funcionario");

        if (ehEquipe) return true;

        var usuarioId = Guid.Parse(usuario.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var ehOProprioAluno = await _context.Alunos
            .AnyAsync(a => a.Id == alunoId && a.UsuarioId == usuarioId);
        if (ehOProprioAluno) return true;

        return await _context.ResponsaveisAlunos
            .AnyAsync(ra => ra.AlunoId == alunoId && ra.Responsavel.UsuarioId == usuarioId);
    }
}
