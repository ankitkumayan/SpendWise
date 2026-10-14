using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendWise.Api.Data;
using SpendWise.Api.DTOs;
using SpendWise.Api.Models;

namespace SpendWise.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BudgetsController : ControllerBase
{
    private readonly SpendWiseDbContext _context;

    public BudgetsController(
        SpendWiseDbContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BudgetResponse>>>
        GetBudgets()
    {
        var userId = GetUserId();

        var budgets =
            await _context.Budgets
                .Where(budget =>
                    budget.UserId == userId)
                .OrderBy(
                    budget => budget.Category)
                .Select(budget =>
                    new BudgetResponse
                    {
                        Id = budget.Id,
                        Category = budget.Category,
                        MonthlyLimit =
                            budget.MonthlyLimit
                    })
                .ToListAsync();

        return Ok(budgets);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BudgetResponse>>
        GetBudget(int id)
    {
        var userId = GetUserId();

        var budget =
            await _context.Budgets
                .Where(budget =>
                    budget.Id == id &&
                    budget.UserId == userId)
                .Select(budget =>
                    new BudgetResponse
                    {
                        Id = budget.Id,
                        Category = budget.Category,
                        MonthlyLimit =
                            budget.MonthlyLimit
                    })
                .FirstOrDefaultAsync();

        if (budget is null)
        {
            return NotFound();
        }

        return Ok(budget);
    }

    [HttpPost]
    public async Task<ActionResult<BudgetResponse>>
        CreateBudget(
            BudgetRequest request)
    {
        var userId = GetUserId();

        var budget = new Budget
        {
            Category = request.Category.Trim(),
            MonthlyLimit = request.MonthlyLimit,
            UserId = userId
        };

        _context.Budgets.Add(budget);

        await _context.SaveChangesAsync();

        var response = new BudgetResponse
        {
            Id = budget.Id,
            Category = budget.Category,
            MonthlyLimit =
                budget.MonthlyLimit
        };

        return CreatedAtAction(
            nameof(GetBudget),
            new { id = budget.Id },
            response);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<BudgetResponse>>
        UpdateBudget(
            int id,
            BudgetRequest request)
    {
        var userId = GetUserId();

        var budget =
            await _context.Budgets
                .FirstOrDefaultAsync(
                    existing =>
                        existing.Id == id &&
                        existing.UserId == userId);

        if (budget is null)
        {
            return NotFound();
        }

        budget.Category =
            request.Category.Trim();

        budget.MonthlyLimit =
            request.MonthlyLimit;

        await _context.SaveChangesAsync();

        return Ok(
            new BudgetResponse
            {
                Id = budget.Id,
                Category = budget.Category,
                MonthlyLimit =
                    budget.MonthlyLimit
            });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult>
        DeleteBudget(int id)
    {
        var userId = GetUserId();

        var budget =
            await _context.Budgets
                .FirstOrDefaultAsync(
                    existing =>
                        existing.Id == id &&
                        existing.UserId == userId);

        if (budget is null)
        {
            return NotFound();
        }

        _context.Budgets.Remove(budget);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}