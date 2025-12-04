using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UseCaseWeb.Controllers;
using UseCaseWeb.Data;
using UseCaseWeb.Models;
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Repositories;
using UseCaseWeb.Services;
using Xunit;

namespace TestProject
{
    public class UserControllerTests
    {
        private ExpenseContext GetInMemoryDb()
        {
            var options = new DbContextOptionsBuilder<ExpenseContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ExpenseContext(options);
        }

        private CategoryController CreateControllerWithService(ExpenseContext db)
        {
            var repo = new CategoryRepository(db);
            var service = new CategoryService(repo);
            return new CategoryController(service);
        }

        [Fact]
        public void GetCategories_Returns_ListOfCategories()
        {
            // Arrange
            var db = GetInMemoryDb();
            db.Categories.Add(new Category { CategoryName = "Food" });
            db.Categories.Add(new Category { CategoryName = "Travel" });
            db.Categories.Add(new Category { CategoryName = "Bills" });
            db.SaveChanges();

            var controller = CreateControllerWithService(db);

            // Act
            var result = controller.GetCategories() as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            var categories = result.Value as IEnumerable<Category>; 
            Assert.NotNull(categories);
            Assert.Equal(3, categories.Count());
        }

        [Fact]
        public void AddCategory_Adds_Category_ReturnsOk()
        {
            // Arrange
            var db = GetInMemoryDb();
            var controller = CreateControllerWithService(db);

            var dto = new AddCategoryDTO
            {
                CategoryName = "Groceries"
            };

            // Act
            var result = controller.AddCategory(dto) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Category Added Successfully", result.Value);

            // Verify category is added
            Assert.Equal(1, db.Categories.Count());
            Assert.Equal("Groceries", db.Categories.First().CategoryName);
        }
    }
}
        