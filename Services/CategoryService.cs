using System.Collections.Generic;
using UseCaseWeb.Models;
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Repositories;

namespace UseCaseWeb.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;

        public CategoryService(ICategoryRepository repo) => _repo = repo;

        public IEnumerable<Category> GetAll() => _repo.GetAll();

        public Category AddCategory(AddCategoryDTO dto)
        {
            var cat = new Category { CategoryName = dto.CategoryName };
            _repo.Add(cat);
            return cat;
        }

        public Category? GetById(int id) => _repo.GetById(id);

        public IEnumerable<Category> GetAllWithExpenses() => _repo.GetAllWithExpenses();
    }
}
