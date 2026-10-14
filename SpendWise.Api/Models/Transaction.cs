using System.ComponentModel.DataAnnotations;

namespace SpendWise.Api.Models;

public class Transaction
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Range(
        typeof(decimal),
        "0.01",
        "999999999.99")]
    public decimal Amount { get; set; }

    [Required]
    [RegularExpression(
        "^(income|expense)$",
        ErrorMessage = "Type must be income or expense.")]
    public string Type { get; set; } = string.Empty;

    public DateOnly Date { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }
}