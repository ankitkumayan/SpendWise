using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendWise.Api.Controllers;
using SpendWise.Api.Data;
using SpendWise.Api.DTOs;
using SpendWise.Api.Models;

namespace SpendWise.Api.Tests;

public class BudgetsControllerTests
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

    private static BudgetsController
        CreateController(
            SpendWiseDbContext context,
            int userId)
    {
        var controller =
            new BudgetsController(context);

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
    public async Task GetBudgets_ReturnsOnlyCurrentUsersBudgets()
    {
        await using var context = CreateContext();

        context.Budgets.AddRange(
            new Budget
            {
                Id = 1,
                Category = "Food",
                MonthlyLimit = 600,
                UserId = 1
            },
            new Budget
            {
                Id = 2,
                Category = "Entertainment",
                MonthlyLimit = 200,
                UserId = 2
            });

        await context.SaveChangesAsync();

        var controller =
            CreateController(context, 1);

        var result =
            await controller.GetBudgets();

        var response =
            Assert.IsType<OkObjectResult>(result.Result);

        var budgets =
            Assert.IsAssignableFrom<
                IEnumerable<BudgetResponse>>(
                response.Value);

        Assert.Single(budgets);

        Assert.Equal(
            "Food",
            budgets.First().Category);
    }

    [Fact]
    public async Task CreateBudget_AssignsCurrentUser()
    {
        await using var context = CreateContext();

        var controller =
            CreateController(context, 5);

        var request = new BudgetRequest
        {
            Category = "Food",
            MonthlyLimit = 500
        };

        await controller.CreateBudget(request);

        var budget =
            await context.Budgets
                .SingleAsync();

        Assert.Equal(
            5,
            budget.UserId);

        Assert.Equal(
            "Food",
            budget.Category);

        Assert.Equal(
            500,
            budget.MonthlyLimit);
    }

    [Fact]
    public async Task UpdateBudget_CannotUpdateAnotherUsersBudget()
    {
        await using var context = CreateContext();

        context.Budgets.Add(
            new Budget
            {
                Id = 1,
                Category = "Food",
                MonthlyLimit = 500,
                UserId = 2
            });

        await context.SaveChangesAsync();

        var controller =
            CreateController(context, 1);

        var request = new BudgetRequest
        {
            Category = "Food",
            MonthlyLimit = 1000
        };

        var result =
            await controller.UpdateBudget(
                1,
                request);

        Assert.IsType<NotFoundResult>(
            result.Result);
    }

    [Fact]
    public async Task DeleteBudget_CannotDeleteAnotherUsersBudget()
    {
        await using var context = CreateContext();

        context.Budgets.Add(
            new Budget
            {
                Id = 1,
                Category = "Food",
                MonthlyLimit = 500,
                UserId = 2
            });

        await context.SaveChangesAsync();

        var controller =
            CreateController(context, 1);

        var result =
            await controller.DeleteBudget(1);

        Assert.IsType<NotFoundResult>(
            result);

        Assert.True(
            await context.Budgets
                .AnyAsync(budget =>
                    budget.Id == 1));
    }
}