using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IUserMenuPermissionRepository
    {
        Task<List<UserMenuPermission>> GetByUserIdAsync(int userId);
        Task SaveAsync(int userId, List<UserMenuPermission> permissions);
    }
}
