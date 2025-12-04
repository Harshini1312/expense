using UseCaseWeb.Data;
using UseCaseWeb.Models;


using System.Linq;
using UseCaseWeb.Data;
using UseCaseWeb.Models;

namespace UseCaseWeb.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ExpenseContext context) : base(context) { }

        public User GetByName(string name) => _dbSet.FirstOrDefault(u => u.Name == name);
    }
}