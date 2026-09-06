using ClosedXML.Excel;

namespace SistemaEscolar.Api.Services;

public static class PlanilhaReader
{
    public static List<Dictionary<string, string>> Ler(IFormFile arquivo)
    {
        var extensao = Path.GetExtension(arquivo.FileName).ToLowerInvariant();

        return extensao switch
        {
            ".xlsx" => LerXlsx(arquivo),
            ".csv" => LerCsv(arquivo),
            _ => throw new InvalidOperationException("Formato não suportado. Use .xlsx ou .csv.")
        };
    }

    private static List<Dictionary<string, string>> LerXlsx(IFormFile arquivo)
    {
        var linhas = new List<Dictionary<string, string>>();

        using var stream = arquivo.OpenReadStream();
        using var workbook = new XLWorkbook(stream);
        var worksheet = workbook.Worksheet(1);

        var headers = worksheet.Row(1).CellsUsed()
            .Select(c => c.GetString().Trim())
            .ToList();

        foreach (var row in worksheet.RowsUsed().Skip(1))
        {
            var linha = new Dictionary<string, string>();
            for (int i = 0; i < headers.Count; i++)
                linha[headers[i]] = row.Cell(i + 1).GetString().Trim();
            linhas.Add(linha);
        }

        return linhas;
    }

    private static List<Dictionary<string, string>> LerCsv(IFormFile arquivo)
    {
        var linhas = new List<Dictionary<string, string>>();

        using var stream = arquivo.OpenReadStream();
        using var reader = new StreamReader(stream);

        var headerLine = reader.ReadLine();
        if (headerLine is null) return linhas;

        var headers = headerLine.Split(',').Select(h => h.Trim()).ToList();

        string? line;
        while ((line = reader.ReadLine()) is not null)
        {
            if (string.IsNullOrWhiteSpace(line)) continue;

            var valores = line.Split(',').Select(v => v.Trim()).ToList();
            var linha = new Dictionary<string, string>();
            for (int i = 0; i < headers.Count && i < valores.Count; i++)
                linha[headers[i]] = valores[i];
            linhas.Add(linha);
        }

        return linhas;
    }
}