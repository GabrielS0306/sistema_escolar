using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEscolar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutorComunicado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AutorUsuarioId",
                table: "Comunicados",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comunicados_AutorUsuarioId",
                table: "Comunicados",
                column: "AutorUsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comunicados_Usuarios_AutorUsuarioId",
                table: "Comunicados",
                column: "AutorUsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comunicados_Usuarios_AutorUsuarioId",
                table: "Comunicados");

            migrationBuilder.DropIndex(
                name: "IX_Comunicados_AutorUsuarioId",
                table: "Comunicados");

            migrationBuilder.DropColumn(
                name: "AutorUsuarioId",
                table: "Comunicados");
        }
    }
}
