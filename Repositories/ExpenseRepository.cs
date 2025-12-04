using Microsoft.EntityFrameworkCore;
using UseCaseWeb.Data;
using UseCaseWeb.Models;

using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using UseCaseWeb.Data;
using UseCaseWeb.Models;

namespace UseCaseWeb.Repositories
{
    public class ExpenseRepository : Repository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(ExpenseContext context) : base(context) { }

        public IEnumerable<Expense> GetByUserWithCategory(int userId)
        {
            return _dbSet
                .Include(e => e.Category)
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.SpendDate)
                .ToList();
        }

        public decimal GetTotalByUser(int userId)
        {
            return _dbSet.Where(e => e.UserId == userId).Sum(e => e.AmountSpent);
        }
    }
}