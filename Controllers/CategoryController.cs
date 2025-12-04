using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Services;

namespace UseCaseWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoryController(ICategoryService service)
        {
            _service = service;
        }

        [HttpGet("GetAllCategories")]
        public IActionResult GetCategories()
        {
            var categories = _service.GetAll();
            return Ok(categories);
        }

        [HttpPost("AddCategory")]
        public IActionResult AddCategory(AddCategoryDTO category)
        {
            _service.AddCategory(category);
            return Ok("Category Added Successfully");
        }
    }
}