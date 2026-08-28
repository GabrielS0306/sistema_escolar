using Microsoft.EntityFrameworkCore;
using SistemaEscolar.Domain.Entities;

namespace SistemaEscolar.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
}