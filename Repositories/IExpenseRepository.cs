using UseCaseWeb.Models;

using System.Collections.Generic;
using UseCaseWeb.Models;

namespace UseCaseWeb.Repositories
{
    public interface IExpenseRepository : IRepository<Expense>
    {
        IEnumerable<Expense> GetByUserWithCategory(int userId);
        decimal GetTotalByUser(int userId);
    }
}