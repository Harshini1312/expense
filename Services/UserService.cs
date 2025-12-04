using UseCaseWeb.Models;
using UseCaseWeb.Models.DTO;
using UseCaseWeb.Repositories;

namespace UseCaseWeb.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo) => _repo = repo;

        public User? GetById(int id) => _repo.GetById(id);

        public User? GetByName(string name) => _repo.GetByName(name);

        public User Register(AddUserDTO dto)
        {
            var user = new User
            {
                Name = dto.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };
            _repo.Add(user);
            return user;
        }

        public bool VerifyPassword(User user, string password) =>
            BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }
}
