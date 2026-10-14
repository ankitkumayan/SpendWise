using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpendWise.Api.Data;
using SpendWise.Api.Models;
using SpendWise.Api.Services;

namespace SpendWise.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SpendWiseDbContext _context;
    private readonly AuthService _authService;

    public AuthController(
        SpendWiseDbContext context,
        AuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var existingUser =
            await _context.Users
                .FirstOrDefaultAsync(
                    user => user.Email == email);

        if (existingUser is not null)
        {
            return Conflict(
                new
                {
                    message =
                        "An account with this email already exists."
                });
        }

        var user = new User
        {
            Name = request.Name.Trim(),
            Email = email
        };

        user.PasswordHash =
            _authService.HashPassword(
                user,
                request.Password);

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var token =
            _authService.GenerateToken(user);

        return Ok(
            new AuthResponse
            {
                Token = token,
                User = new UserResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email
                }
            });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    existingUser =>
                        existingUser.Email == email);

        if (user is null ||
            !_authService.VerifyPassword(
                user,
                request.Password))
        {
            return Unauthorized(
                new
                {
                    message =
                        "Invalid email or password."
                });
        }

        var token =
            _authService.GenerateToken(user);

        return Ok(
            new AuthResponse
            {
                Token = token,
                User = new UserResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email
                }
            });
    }
}

public class RegisterRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;

    public UserResponse User { get; set; } = new();
}

public class UserResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
}