using UseCaseWeb.Models;


using System.Collections.Generic;
using UseCaseWeb.Models;

namespace UseCaseWeb.Repositories
{
    public interface ICategoryRepository : IRepository<Category>
    {
        IEnumerable<Category> GetAllWithExpenses();
    }
}