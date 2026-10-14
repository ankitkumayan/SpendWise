using System.ComponentModel.DataAnnotations;

namespace SpendWise.Api.Models;

public class Budget
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Range(
        typeof(decimal),
        "0.01",
        "999999999.99")]
    public decimal MonthlyLimit { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }
}