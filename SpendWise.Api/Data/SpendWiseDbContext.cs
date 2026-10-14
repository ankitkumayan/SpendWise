using Microsoft.EntityFrameworkCore;
using SpendWise.Api.Models;

namespace SpendWise.Api.Data;

public class SpendWiseDbContext : DbContext
{
    public SpendWiseDbContext(
        DbContextOptions<SpendWiseDbContext> options)
        : base(options)
    {
    }

    public DbSet<Transaction> Transactions =>
        Set<Transaction>();

    public DbSet<Budget> Budgets =>
        Set<Budget>();

    public DbSet<User> Users =>
        Set<User>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaction>(
            entity =>
            {
                entity.Property(
                    transaction => transaction.Amount)
                    .HasPrecision(18, 2);

                entity.Property(
                    transaction => transaction.Description)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(
                    transaction => transaction.Category)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(
                    transaction => transaction.Type)
                    .HasMaxLength(20)
                    .IsRequired();

                entity.HasOne(
                    transaction => transaction.User)
                    .WithMany(
                        user => user.Transactions)
                    .HasForeignKey(
                        transaction => transaction.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        modelBuilder.Entity<Budget>(
            entity =>
            {
                entity.Property(
                    budget => budget.MonthlyLimit)
                    .HasPrecision(18, 2);

                entity.Property(
                    budget => budget.Category)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.HasOne(
                    budget => budget.User)
                    .WithMany(
                        user => user.Budgets)
                    .HasForeignKey(
                        budget => budget.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

        modelBuilder.Entity<User>(
            entity =>
            {
                entity.Property(user => user.Name)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(user => user.Email)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(user => user.PasswordHash)
                    .IsRequired();

                entity.HasIndex(user => user.Email)
                    .IsUnique();
            });
    }
}