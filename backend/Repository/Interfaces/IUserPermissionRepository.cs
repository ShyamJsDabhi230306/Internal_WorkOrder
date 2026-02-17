using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IUserPermissionRepository
    {
        Task<List<UserMenuPermission>> GetByUserIdAsync(int userId);
        Task SaveAsync(int userId, List<UserMenuPermission> permissions);
    }
}
