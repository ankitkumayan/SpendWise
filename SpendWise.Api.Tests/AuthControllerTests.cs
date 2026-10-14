using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SpendWise.Api.Controllers;
using SpendWise.Api.Data;
using SpendWise.Api.Models;
using SpendWise.Api.Services;

namespace SpendWise.Api.Tests;

public class AuthControllerTests
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

    private static AuthService CreateAuthService()
    {
        var settings = new Dictionary<string, string?>
        {
            ["Jwt:Key"] =
                "SpendWise-test-secret-key-123456789",
            ["Jwt:Issuer"] = "SpendWise.Api"
        };

        var configuration =
            new ConfigurationBuilder()
                .AddInMemoryCollection(settings)
                .Build();

        return new AuthService(configuration);
    }

    [Fact]
    public async Task Register_CreatesNewUser()
    {
        await using var context = CreateContext();

        var controller = new AuthController(
            context,
            CreateAuthService());

        var request = new RegisterRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Password = "password123"
        };

        var result =
            await controller.Register(request);

        Assert.NotNull(result);

        var user =
            await context.Users
                .FirstOrDefaultAsync();

        Assert.NotNull(user);
        Assert.Equal(
            "John Doe",
            user.Name);

        Assert.Equal(
            "john@example.com",
            user.Email);

        Assert.NotEqual(
            "password123",
            user.PasswordHash);
    }

    [Fact]
    public async Task Register_RejectsDuplicateEmail()
    {
        await using var context = CreateContext();

        var authService = CreateAuthService();

        context.Users.Add(
            new User
            {
                Name = "Existing User",
                Email = "john@example.com",
                PasswordHash =
                    authService.HashPassword(
                        new User(),
                        "password123")
            });

        await context.SaveChangesAsync();

        var controller = new AuthController(
            context,
            authService);

        var request = new RegisterRequest
        {
            Name = "Another User",
            Email = "john@example.com",
            Password = "password123"
        };

        var result =
            await controller.Register(request);

        Assert.IsType<
            Microsoft.AspNetCore.Mvc.ConflictObjectResult>(
            result);
    }

    [Fact]
    public async Task Login_ReturnsTokenForValidCredentials()
    {
        await using var context = CreateContext();

        var authService = CreateAuthService();

        var user = new User
        {
            Name = "John Doe",
            Email = "john@example.com"
        };

        user.PasswordHash =
            authService.HashPassword(
                user,
                "password123");

        context.Users.Add(user);

        await context.SaveChangesAsync();

        var controller = new AuthController(
            context,
            authService);

        var request = new LoginRequest
        {
            Email = "john@example.com",
            Password = "password123"
        };

        var result =
            await controller.Login(request);

        var response =
            Assert.IsType<
                Microsoft.AspNetCore.Mvc.OkObjectResult>(
                result);

        Assert.NotNull(response.Value);
    }

    [Fact]
    public async Task Login_RejectsInvalidPassword()
    {
        await using var context = CreateContext();

        var authService = CreateAuthService();

        var user = new User
        {
            Name = "John Doe",
            Email = "john@example.com"
        };

        user.PasswordHash =
            authService.HashPassword(
                user,
                "password123");

        context.Users.Add(user);

        await context.SaveChangesAsync();

        var controller = new AuthController(
            context,
            authService);

        var request = new LoginRequest
        {
            Email = "john@example.com",
            Password = "wrongpassword"
        };

        var result =
            await controller.Login(request);

        Assert.IsType<
            Microsoft.AspNetCore.Mvc.UnauthorizedObjectResult>(
            result);
    }
}
