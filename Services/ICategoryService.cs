using System.Collections.Generic;
using UseCaseWeb.Models;
using UseCaseWeb.Models.DTO;

namespace UseCaseWeb.Services
{
    public interface ICategoryService
    {
        IEnumerable<Category> GetAll();
        Category AddCategory(AddCategoryDTO dto);
        Category? GetById(int id);
        IEnumerable<Category> GetAllWithExpenses();
    }
}
