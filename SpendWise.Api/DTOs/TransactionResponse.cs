namespace SpendWise.Api.DTOs;

public class TransactionResponse
{
    public int Id { get; set; }

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Type { get; set; } = string.Empty;

    public DateOnly Date { get; set; }
}
