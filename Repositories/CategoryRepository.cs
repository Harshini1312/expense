using Microsoft.EntityFrameworkCore;
using UseCaseWeb.Data;
using UseCaseWeb.Models;


namespace UseCaseWeb.Repositories
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(ExpenseContext context) : base(context) { }

        public IEnumerable<Category> GetAllWithExpenses()
        {
            return _dbSet.Include(c => c.Expenses).ToList();
        }
    }
}