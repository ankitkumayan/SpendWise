namespace SpendWise.Api.DTOs;

public class BudgetResponse
{
    public int Id { get; set; }

    public string Category { get; set; } = string.Empty;

    public decimal MonthlyLimit { get; set; }
}