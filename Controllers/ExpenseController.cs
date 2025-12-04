using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Services;

namespace UseCaseWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpenseController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet("GetUserExpenses")]
        public IActionResult GetUserExpenses()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var data = _expenseService.GetUserExpenses(userId)
                        .Select(e => new
                        {
                            e.ExpenseId,
                            e.AmountSpent,
                            e.Description,
                            e.SpendDate,
                            e.CategoryId,
                            CategoryName = e.Category?.CategoryName
                        })
                        .ToList();

            return Ok(data);
        }

        [HttpGet("TotalExpenses")]
        public IActionResult GetTotalExpenses()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var res = _expenseService.GetTotalExpenses(userId);
            return Ok($"Amount Spent:{res}");
        }

        [HttpPost("AddExpense")]
        public IActionResult AddExpense(AddExpenseDTO expensedto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            try
            {
                var created = _expenseService.AddExpense(userId, expensedto);
                return Ok(created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("UpdateExpense/{id}")]
        public IActionResult UpdateExpense(int id, UpdateExpenseDTO dto)
        {
            var updated = _expenseService.UpdateExpense(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("DeleteExpense/{id}")]
        public IActionResult DeleteExpense(int id)
        {
            var deleted = _expenseService.DeleteExpense(id);
            if (!deleted) return NotFound();
            return Ok();
        }
    }
}