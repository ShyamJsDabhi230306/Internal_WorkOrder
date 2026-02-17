using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IMenuRepository
    {
        Task<List<Menu>> GetAllAsync();

    }
}
