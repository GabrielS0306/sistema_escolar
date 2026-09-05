using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEscolar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InicialConselhoClasse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ConselhosClasse",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AlunoId = table.Column<Guid>(type: "uuid", nullable: false),
                    AnoLetivoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Data = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Resultado = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConselhosClasse", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConselhosClasse_Alunos_AlunoId",
                        column: x => x.AlunoId,
                        principalTable: "Alunos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConselhosClasse_AnosLetivos_AnoLetivoId",
                        column: x => x.AnoLetivoId,
                        principalTable: "AnosLetivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VotosConselho",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ConselhoClasseId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Voto = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VotosConselho", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VotosConselho_ConselhosClasse_ConselhoClasseId",
                        column: x => x.ConselhoClasseId,
                        principalTable: "ConselhosClasse",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VotosConselho_Professores_ProfessorId",
                        column: x => x.ProfessorId,
                        principalTable: "Professores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConselhosClasse_AlunoId",
                table: "ConselhosClasse",
                column: "AlunoId");

            migrationBuilder.CreateIndex(
                name: "IX_ConselhosClasse_AnoLetivoId",
                table: "ConselhosClasse",
                column: "AnoLetivoId");

            migrationBuilder.CreateIndex(
                name: "IX_VotosConselho_ConselhoClasseId",
                table: "VotosConselho",
                column: "ConselhoClasseId");

            migrationBuilder.CreateIndex(
                name: "IX_VotosConselho_ProfessorId",
                table: "VotosConselho",
                column: "ProfessorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VotosConselho");

            migrationBuilder.DropTable(
                name: "ConselhosClasse");
        }
    }
}
