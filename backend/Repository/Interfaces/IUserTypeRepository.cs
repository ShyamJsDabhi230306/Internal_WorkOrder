using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IUserTypeRepository
    {
        Task<IEnumerable<UserType>> GetAllAsync();
        Task<UserType?> GetByIdAsync(int id);
        Task<UserType> AddAsync(UserTypeDto dto);
        Task<UserType?> UpdateAsync(UserTypeDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
