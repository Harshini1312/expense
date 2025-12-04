using System;
using System.Collections.Generic;
using UseCaseWeb.Models;
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Repositories;

namespace UseCaseWeb.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepo;
        private readonly IUserRepository _userRepo;
        private readonly ICategoryRepository _categoryRepo;

        public ExpenseService(IExpenseRepository expenseRepo, IUserRepository userRepo, ICategoryRepository categoryRepo)
        {
            _expenseRepo = expenseRepo;
            _userRepo = userRepo;
            _categoryRepo = categoryRepo;
        }

        public IEnumerable<Expense> GetUserExpenses(int userId) =>
            _expenseRepo.GetByUserWithCategory(userId);

        public decimal GetTotalExpenses(int userId) =>
            _expenseRepo.GetTotalByUser(userId);

        public Expense AddExpense(int userId, AddExpenseDTO dto)
        {
            if (_userRepo.GetById(userId) == null)
                throw new ArgumentException("User Not Found");
            if (dto.AmountSpent <= 0)
                throw new ArgumentException("AmountSpent must be greater than 0.");
            if (_categoryRepo.GetById(dto.CategoryId) == null)
                throw new ArgumentException("Category Not Found");

            var expense = new Expense
            {
                AmountSpent = dto.AmountSpent,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                SpendDate = dto.SpendDate,
                UserId = userId
            };

            _expenseRepo.Add(expense);
            return expense;
        }

        public Expense? UpdateExpense(int id, UpdateExpenseDTO dto)
        {
            var existing = _expenseRepo.GetById(id);
            if (existing == null) return null;

            existing.AmountSpent = dto.AmountSpent;
            existing.CategoryId = dto.CategoryId;
            existing.SpendDate = dto.SpendDate;
            existing.Description = dto.Description;

            _expenseRepo.Update(existing);
            return existing;
        }

        public bool DeleteExpense(int id)
        {
            var existing = _expenseRepo.GetById(id);
            if (existing == null) return false;
            _expenseRepo.Delete(id);
            return true;
        }

        public Expense? GetById(int id) => _expenseRepo.GetById(id);
    }
}
