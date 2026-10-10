using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEscolar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class IndicesUnicosResponsavel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ResponsaveisAlunos_ResponsavelId",
                table: "ResponsaveisAlunos");

            migrationBuilder.DropIndex(
                name: "IX_Responsaveis_UsuarioId",
                table: "Responsaveis");

            migrationBuilder.CreateIndex(
                name: "IX_ResponsaveisAlunos_ResponsavelId_AlunoId",
                table: "ResponsaveisAlunos",
                columns: new[] { "ResponsavelId", "AlunoId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Responsaveis_UsuarioId",
                table: "Responsaveis",
                column: "UsuarioId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ResponsaveisAlunos_ResponsavelId_AlunoId",
                table: "ResponsaveisAlunos");

            migrationBuilder.DropIndex(
                name: "IX_Responsaveis_UsuarioId",
                table: "Responsaveis");

            migrationBuilder.CreateIndex(
                name: "IX_ResponsaveisAlunos_ResponsavelId",
                table: "ResponsaveisAlunos",
                column: "ResponsavelId");

            migrationBuilder.CreateIndex(
                name: "IX_Responsaveis_UsuarioId",
                table: "Responsaveis",
                column: "UsuarioId");
        }
    }
}
