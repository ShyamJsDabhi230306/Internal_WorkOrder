using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IPriorityRepository
    {
        Task<IEnumerable<WoPriorityType>> GetAllAsync();
        Task<WoPriorityType?> GetByIdAsync(int id);
        Task<WoPriorityType> CreateAsync(PriorityDto dto);
        Task<bool> UpdateAsync(int id, PriorityDto dto);
        Task<bool> SoftDeleteAsync(int id);
    }
}
