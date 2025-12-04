using UseCaseWeb.Models;

using UseCaseWeb.Models;

namespace UseCaseWeb.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        User GetByName(string name);
    }
}