using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> AuthenticateAsync(string username, string password);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> CreateAsync(UserDto dto);
        Task<bool> UpdateAsync(int id, UserDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
