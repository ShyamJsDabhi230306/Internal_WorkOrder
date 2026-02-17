using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class UserMenuPermissionRepository: IUserMenuPermissionRepository
    {
        private readonly WorkOrderManagementSystemContext _context;

        public UserMenuPermissionRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<List<UserMenuPermission>> GetByUserIdAsync(int userId)
        {
            return await _context.UserMenuPermissions
                .Include(x => x.Menu)   // ⭐ THIS IS THE FIX
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task SaveAsync(int userId, List<UserMenuPermission> permissions)
        {
            var old = _context.UserMenuPermissions
                .Where(x => x.UserId == userId);

            _context.UserMenuPermissions.RemoveRange(old);

            foreach (var p in permissions)
            {
                p.UserId = userId;
                _context.UserMenuPermissions.Add(p);
            }

            await _context.SaveChangesAsync();
        }
    }
}
