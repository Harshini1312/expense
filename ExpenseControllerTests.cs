using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UseCaseWeb.Controllers;
using UseCaseWeb.Data;
using UseCaseWeb.Models;    
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Repositories;
using UseCaseWeb.Services;
using Xunit;

public class ExpenseControllerTests
{
    private ExpenseContext GetInMemoryDb()
    {
        var options = new DbContextOptionsBuilder<ExpenseContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ExpenseContext(options);
    }

    private ExpenseController CreateControllerWithService(ExpenseContext db, int? userId = null)
    {
        var expenseRepo = new ExpenseRepository(db);
        var userRepo = new UserRepository(db);
        var categoryRepo = new CategoryRepository(db);
        var service = new ExpenseService(expenseRepo, userRepo, categoryRepo);
        var controller = new ExpenseController(service);

        if (userId.HasValue)
            AttachUserToController(controller, userId.Value);

        return controller;
    }

    private void AttachUserToController(ExpenseController controller, int userId)
    {
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }, "mock"));

        controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    [Fact]
    public void GetUserExpenses_Returns_ListOfExpenses()
    {
        // Arrange
        var db = GetInMemoryDb();

        db.Categories.Add(new Category { CategoryId = 2, CategoryName = "Clothes" });
        db.Expenses.Add(new Expense { ExpenseId = 1, UserId = 5, AmountSpent = 100M, CategoryId = 2, Description = "Jeans", SpendDate = DateTime.Now });
        db.Expenses.Add(new Expense { ExpenseId = 2, UserId = 5, AmountSpent = 200M, CategoryId = 2, Description = "Shirt", SpendDate = DateTime.Now });
        db.SaveChanges();

        var controller = CreateControllerWithService(db, 5);

        // Act
        var result = controller.GetUserExpenses() as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var list = result.Value as IEnumerable<object>;
        Assert.NotNull(list);
        Assert.Equal(2, list.Count());
    }

    [Fact]
    public void GetTotalExpenses_Returns_SumString()
    {
        // Arrange
        var db = GetInMemoryDb();
        db.Users.Add(new User { UserId = 9, Name = "Test", PasswordHash = "pw" });
        db.Expenses.Add(new Expense { ExpenseId = 1, UserId = 9, AmountSpent = 10M, CategoryId = 1, Description = "A", SpendDate = DateTime.Now });
        db.Expenses.Add(new Expense { ExpenseId = 2, UserId = 9, AmountSpent = 15.5M, CategoryId = 1, Description = "B", SpendDate = DateTime.Now });
        db.SaveChanges();

        var controller = CreateControllerWithService(db, 9);

        // Act
        var result = controller.GetTotalExpenses() as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.IsType<string>(result.Value);
        Assert.Equal("Amount Spent:25.5", result.Value);
    }

    [Fact]
    public void AddExpense_Returns_BadRequest_When_UserNotFound()
    {
        // Arrange
        var db = GetInMemoryDb();
        var controller = CreateControllerWithService(db, 42); // user 42 does not exist

        var dto = new AddExpenseDTO
        {
            AmountSpent = 10M,
            Description = "X",
            SpendDate = DateTime.Now,
            CategoryId = 1
        };

        // Act
        var result = controller.AddExpense(dto) as BadRequestObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal("User Not Found", result.Value);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void AddExpense_Returns_BadRequest_When_InvalidAmount(decimal amount)
    {
        // Arrange
        var db = GetInMemoryDb();
        db.Users.Add(new User { UserId = 7, Name = "U", PasswordHash = "pw" });
        db.SaveChanges();

        var controller = CreateControllerWithService(db, 7);

        var dto = new AddExpenseDTO
        {
            AmountSpent = amount,
            Description = "Invalid amount",
            SpendDate = DateTime.Now,
            CategoryId = 1
        };

        // Act
        var result = controller.AddExpense(dto) as BadRequestObjectResult;

        // Assert
        Assert.NotNull(result);
        Assert.Equal("AmountSpent must be greater than 0.", result.Value);
    }

    [Fact]
    public void AddExpense_AddsExpense_Returns_Ok_WithExpense()
    {
        // Arrange
        var db = GetInMemoryDb();
        db.Users.Add(new User { UserId = 11, Name = "U11", PasswordHash = "pw" });
        // seed required category - service validates category existence
        db.Categories.Add(new Category { CategoryId = 3, CategoryName = "Food" });
        db.SaveChanges();

        var controller = CreateControllerWithService(db, 11);

        var dto = new AddExpenseDTO
        {
            AmountSpent = 123.45M,
            Description = "Lunch",
            SpendDate = new DateTime(2025, 1, 1),
            CategoryId = 3
        };

        // Act
        var result = controller.AddExpense(dto) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var created = Assert.IsType<Expense>(result.Value);
        Assert.Equal(123.45M, created.AmountSpent);
        Assert.Equal("Lunch", created.Description);
        Assert.Equal(11, created.UserId);

        // Verify persisted
        Assert.Equal(1, db.Expenses.Count());
        var fromDb = db.Expenses.First();
        Assert.Equal(123.45M, fromDb.AmountSpent);
        Assert.Equal(11, fromDb.UserId);
    }

    [Fact]
    public void UpdateExpense_Returns_NotFound_When_Missing()
    {
        // Arrange
        var db = GetInMemoryDb();
        var controller = CreateControllerWithService(db);

        var dto = new UpdateExpenseDTO
        {
            ExpenseId = 999,
            AmountSpent = 50M,
            CategoryId = 1,
            SpendDate = DateTime.Now,
            Description = "Doesn't matter"
        };

        // Act
        var result = controller.UpdateExpense(999, dto);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void UpdateExpense_Updates_ExistingExpense()
    {
        // Arrange
        var db = GetInMemoryDb();
        db.Expenses.Add(new Expense { ExpenseId = 20, UserId = 2, AmountSpent = 5M, CategoryId = 1, Description = "Old", SpendDate = new DateTime(2020, 1, 1) });
        db.SaveChanges();

        var controller = CreateControllerWithService(db);

        var dto = new UpdateExpenseDTO
        {
            ExpenseId = 20,
            AmountSpent = 99.99M,
            CategoryId = 2,
            SpendDate = new DateTime(2025, 5, 5),
            Description = "Updated"
        };

        // Act
        var result = controller.UpdateExpense(20, dto) as OkObjectResult;

        // Assert
        Assert.NotNull(result);
        var updated = Assert.IsType<Expense>(result.Value);
        Assert.Equal(99.99M, updated.AmountSpent);
        Assert.Equal(2, updated.CategoryId);
        Assert.Equal("Updated", updated.Description);

        // Verify persisted
        var fromDb = db.Expenses.Find(20);
        Assert.Equal(99.99M, fromDb.AmountSpent);
        Assert.Equal(2, fromDb.CategoryId);
    }

    [Fact]
    public void DeleteExpense_Returns_NotFound_When_Missing()
    {
        // Arrange
        var db = GetInMemoryDb();
        var controller = CreateControllerWithService(db);

        // Act
        var result = controller.DeleteExpense(333);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void DeleteExpense_Removes_Expense()
    {
        // Arrange
        var db = GetInMemoryDb();
        db.Expenses.Add(new Expense { ExpenseId = 55, UserId = 3, AmountSpent = 11M, CategoryId = 1, Description = "ToDelete", SpendDate = DateTime.Now });
        db.SaveChanges();

        var controller = CreateControllerWithService(db);

        // Act
        var result = controller.DeleteExpense(55);

        // Assert
        Assert.IsType<OkResult>(result);
        Assert.Null(db.Expenses.Find(55));
    }
}