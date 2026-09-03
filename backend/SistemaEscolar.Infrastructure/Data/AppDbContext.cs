using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Domain.Entities;
using SistemaEscolar.Domain.Entities.Perfis;

namespace SistemaEscolar.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Aluno> Alunos => Set<Aluno>();
    public DbSet<Professor> Professores => Set<Professor>();
    public DbSet<AnoLetivo> AnosLetivos => Set<AnoLetivo>();
    public DbSet<Turma> Turmas => Set<Turma>();
    public DbSet<Matricula> Matriculas => Set<Matricula>();
    public DbSet<Disciplina> Disciplinas => Set<Disciplina>();
    public DbSet<ProfessorTurmaDisciplina> ProfessorTurmaDisciplinas => Set<ProfessorTurmaDisciplina>();
    public DbSet<Frequencia> Frequencias => Set<Frequencia>();
    public DbSet<Avaliacao> Avaliacoes => Set<Avaliacao>();
    public DbSet<Nota> Notas => Set<Nota>();
    public DbSet<SituacaoDisciplina> SituacoesDisciplina => Set<SituacaoDisciplina>();
}