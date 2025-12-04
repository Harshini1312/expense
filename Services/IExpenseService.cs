using System.Collections.Generic;
using UseCaseWeb.Models;
using UseCaseWeb.Models.DTO;

namespace UseCaseWeb.Services
{
    public interface IExpenseService
    {
        IEnumerable<Expense> GetUserExpenses(int userId);
        decimal GetTotalExpenses(int userId);
        Expense AddExpense(int userId, AddExpenseDTO dto);
        Expense? UpdateExpense(int id, UpdateExpenseDTO dto);
        bool DeleteExpense(int id);
        Expense? GetById(int id);
    }
}
