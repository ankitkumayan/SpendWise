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
public class TransactionsController : ControllerBase
{
    private readonly SpendWiseDbContext _context;

    public TransactionsController(
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
    public async Task<ActionResult<IEnumerable<TransactionResponse>>>
        GetTransactions()
    {
        var userId = GetUserId();

        var transactions =
            await _context.Transactions
                .Where(transaction =>
                    transaction.UserId == userId)
                .OrderByDescending(
                    transaction => transaction.Date)
                .ThenByDescending(
                    transaction => transaction.Id)
                .Select(transaction =>
                    new TransactionResponse
                    {
                        Id = transaction.Id,
                        Description =
                            transaction.Description,
                        Category =
                            transaction.Category,
                        Amount =
                            transaction.Amount,
                        Type =
                            transaction.Type,
                        Date =
                            transaction.Date
                    })
                .ToListAsync();

        return Ok(transactions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TransactionResponse>>
        GetTransaction(int id)
    {
        var userId = GetUserId();

        var transaction =
            await _context.Transactions
                .Where(transaction =>
                    transaction.Id == id &&
                    transaction.UserId == userId)
                .Select(transaction =>
                    new TransactionResponse
                    {
                        Id = transaction.Id,
                        Description =
                            transaction.Description,
                        Category =
                            transaction.Category,
                        Amount =
                            transaction.Amount,
                        Type =
                            transaction.Type,
                        Date =
                            transaction.Date
                    })
                .FirstOrDefaultAsync();

        if (transaction is null)
        {
            return NotFound();
        }

        return Ok(transaction);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>>
        CreateTransaction(
            TransactionRequest request)
    {
        var userId = GetUserId();

        var transaction = new Transaction
        {
            Description = request.Description.Trim(),
            Category = request.Category.Trim(),
            Amount = request.Amount,
            Type = request.Type.ToLower(),
            Date = request.Date,
            UserId = userId
        };

        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync();

        var response = new TransactionResponse
        {
            Id = transaction.Id,
            Description = transaction.Description,
            Category = transaction.Category,
            Amount = transaction.Amount,
            Type = transaction.Type,
            Date = transaction.Date
        };

        return CreatedAtAction(
            nameof(GetTransaction),
            new { id = transaction.Id },
            response);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TransactionResponse>>
        UpdateTransaction(
            int id,
            TransactionRequest request)
    {
        var userId = GetUserId();

        var transaction =
            await _context.Transactions
                .FirstOrDefaultAsync(
                    existing =>
                        existing.Id == id &&
                        existing.UserId == userId);

        if (transaction is null)
        {
            return NotFound();
        }

        transaction.Description =
            request.Description.Trim();

        transaction.Category =
            request.Category.Trim();

        transaction.Amount =
            request.Amount;

        transaction.Type =
            request.Type.ToLower();

        transaction.Date =
            request.Date;

        await _context.SaveChangesAsync();

        return Ok(
            new TransactionResponse
            {
                Id = transaction.Id,
                Description = transaction.Description,
                Category = transaction.Category,
                Amount = transaction.Amount,
                Type = transaction.Type,
                Date = transaction.Date
            });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult>
        DeleteTransaction(int id)
    {
        var userId = GetUserId();

        var transaction =
            await _context.Transactions
                .FirstOrDefaultAsync(
                    existing =>
                        existing.Id == id &&
                        existing.UserId == userId);

        if (transaction is null)
        {
            return NotFound();
        }

        _context.Transactions.Remove(transaction);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}