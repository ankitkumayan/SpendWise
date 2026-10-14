using System.ComponentModel.DataAnnotations;

namespace SpendWise.Api.DTOs;

public class BudgetRequest
{
    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Range(
        typeof(decimal),
        "0.01",
        "999999999.99")]
    public decimal MonthlyLimit { get; set; }
}
