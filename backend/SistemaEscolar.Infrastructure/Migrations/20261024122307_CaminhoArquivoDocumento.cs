using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaEscolar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CaminhoArquivoDocumento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ArquivoUrl",
                table: "DocumentosUsuario",
                newName: "CaminhoArquivo");

            // Documentos antigos guardavam a URL pública (que nem funcionava, o bucket é privado).
            // Fica só o caminho depois de ".../documentos-usuario/".
            migrationBuilder.Sql(
                """
                UPDATE "DocumentosUsuario"
                SET "CaminhoArquivo" = regexp_replace("CaminhoArquivo", '^.*/documentos-usuario/', '')
                WHERE "CaminhoArquivo" LIKE '%/documentos-usuario/%';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CaminhoArquivo",
                table: "DocumentosUsuario",
                newName: "ArquivoUrl");
        }
    }
}
