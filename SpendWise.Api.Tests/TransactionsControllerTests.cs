
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendWise.Api.Controllers;
using SpendWise.Api.Data;
using SpendWise.Api.DTOs;
using SpendWise.Api.Models;

namespace SpendWise.Api.Tests;

public class TransactionsControllerTests
{
    private static SpendWiseDbContext CreateContext()
    {
        var options =
            new DbContextOptionsBuilder<SpendWiseDbContext>()
                .UseInMemoryDatabase(
                    Guid.NewGuid().ToString())
                .Options;

        return new SpendWiseDbContext(options);
    }

    private static TransactionsController
        CreateController(
            SpendWiseDbContext context,
            int userId)
    {
        var controller =
            new TransactionsController(context);

        var identity =
            new ClaimsIdentity(
                new[]
                {
                    new Claim(
                        ClaimTypes.NameIdentifier,
                        userId.ToString())
                },
                "TestAuth");

        controller.ControllerContext =
            new ControllerContext
            {
                HttpContext =
                    new DefaultHttpContext
                    {
                        User =
                            new ClaimsPrincipal(identity)
                    }
            };

        return controller;
    }

    [Fact]
    public async Task GetTransactions_ReturnsOnlyCurrentUsersTransactions()
    {
        await using var context = CreateContext();

        context.Transactions.AddRange(
            new Transaction
            {
                Id = 1,
                Description = "User One Grocery",
                Category = "Food",
                Amount = 50,
                Type = "expense",
                Date = new DateOnly(2026, 10, 1),
                UserId = 1
            },
            new Transaction
            {
                Id = 2,
                Description = "User Two Grocery",
                Category = "Food",
                Amount = 75,
                Type = "expense",
                Date = new DateOnly(2026, 10, 1),
                UserId = 2
            });

        await context.SaveChangesAsync();

        var controller =
            CreateController(context, 1);

        var result =
            await controller.GetTransactions();

        var response =
            Assert.IsType<OkObjectResult>(result.Result);

        var transactions =
            Assert.IsAssignableFrom<
                IEnumerable<TransactionResponse>>(
                response.Value);

        Assert.Single(transactions);

        Assert.Equal(
            "User One Grocery",
            transactions.First().Description);
    }

    [Fact]
    public async Task CreateTransaction_AssignsCurrentUser()
    {
        await using var context = CreateContext();

        var controller =
            CreateController(context, 5);

        var request = new TransactionRequest
        {
            Description = "Coffee",
            Category = "Food",
            Amount = 5.50m,
            Type = "expense",
            Date = new DateOnly(2026, 10, 7)
        };

        await controller.CreateTransaction(request);

        var transaction =
            await context.Transactions
                .SingleAsync();

        Assert.Equal(
            5,
            transaction.UserId);

        Assert.Equal(
            "Coffee",
            transaction.Description);
    }

    [Fact]
    public async Task UpdateTransaction_CannotUpdateAnotherUsersTransaction()
    {
        await using var context = CreateContext();

        context.Transactions.Add(
            new Transaction
            {
                Id = 1,
                Description = "Private Transaction",
                Category = "Food",
                Amount = 100,
                Type = "expense",
                Date = new DateOnly(2026, 10, 1),
                UserId = 2
            });

        await context.SaveChangesAsync();

        var controller =
            CreateController(context, 1);

        var request = new TransactionRequest
        {
            Description = "Changed",
            Category = "Food",
            Amount = 200,
            Type = "expense",
            Date = new DateOnly(2026, 10, 1)
        };

        var result =
            await controller.UpdateTransaction(
                1,
                request);

        Assert.IsType<NotFoundResult>(
            result.Result);
    }

    [Fact]
    public async Task DeleteTransaction_CannotDeleteAnotherUsersTransaction()
    {
        await using var context = CreateContext();

        context.Transactions.Add(
            new Transaction
            {
                Id = 1,
                Description = "Private Transaction",
                Category = "Food",
                Amount = 100,
                Type = "expense",
                Date = new DateOnly(2026, 10, 1),
                UserId = 2
            });

        await context.SaveChangesAsync();

        var controller =
            CreateController(context, 1);

        var result =
            await controller.DeleteTransaction(1);

        Assert.IsType<NotFoundResult>(
            result);

        Assert.True(
            await context.Transactions
                .AnyAsync(transaction =>
                    transaction.Id == 1));
    }
}
