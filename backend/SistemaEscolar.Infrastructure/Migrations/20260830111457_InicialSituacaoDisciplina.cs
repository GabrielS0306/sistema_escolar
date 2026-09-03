using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEscolar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InicialSituacaoDisciplina : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SituacoesDisciplina",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AlunoId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessorTurmaDisciplinaId = table.Column<Guid>(type: "uuid", nullable: false),
                    MediaFinal = table.Column<decimal>(type: "numeric", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SituacoesDisciplina", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SituacoesDisciplina_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SituacoesDisciplina_ProfessorTurmaDisciplinas_ProfessorTurm~",
                        column: x => x.ProfessorTurmaDisciplinaId,
                        principalTable: "ProfessorTurmaDisciplinas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SituacoesDisciplina_AlunoId",
                table: "SituacoesDisciplina",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_SituacoesDisciplina_ProfessorTurmaDisciplinaId",
                table: "SituacoesDisciplina",
                column: "ProfessorTurmaDisciplinaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SituacoesDisciplina");
        }
    }
}
