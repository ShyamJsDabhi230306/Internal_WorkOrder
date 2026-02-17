using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IOrderTypeRepository
    {
        Task<IEnumerable<OrderType>> GetAllAsync();
        Task<OrderType?> GetByIdAsync(int id);
        Task<OrderType> CreateAsync(OrderTypeDto dto);
        Task<bool> UpdateAsync(int id, OrderTypeDto dto);
        Task<bool> SoftDeleteAsync(int id);
    }
}
