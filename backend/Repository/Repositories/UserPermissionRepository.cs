using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class UserPermissionRepository: IUserPermissionRepository
    {
        private readonly WorkOrderManagementSystemContext _context;

        public UserPermissionRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<List<UserMenuPermission>> GetByUserIdAsync(int userId)
        {
            return await _context.UserMenuPermissions
                .Include(x => x.Menu)
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task SaveAsync(int userId, List<UserMenuPermission> permissions)
        {
            var old = _context.UserMenuPermissions
                .Where(x => x.UserId == userId);

            _context.UserMenuPermissions.RemoveRange(old);
            await _context.UserMenuPermissions.AddRangeAsync(permissions);
            await _context.SaveChangesAsync();
        }
    }
}
