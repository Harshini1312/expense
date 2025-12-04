using Microsoft.EntityFrameworkCore;
using UseCaseWeb.Models;

namespace UseCaseWeb.Data
{
    public class ExpenseContext:DbContext
    {
        public ExpenseContext(DbContextOptions options) : base(options) 
        {
            
        }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
