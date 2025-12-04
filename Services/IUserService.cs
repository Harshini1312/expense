using UseCaseWeb.Models;
using UseCaseWeb.Models.DTO;

namespace UseCaseWeb.Services
{
    public interface IUserService
    {
        User? GetById(int id);
        User? GetByName(string name);
        User Register(AddUserDTO dto);
        bool VerifyPassword(User user, string password);
    }
}
