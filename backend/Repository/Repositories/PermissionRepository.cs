using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly WorkOrderManagementSystemContext _context;

        public PermissionRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<bool> HasPermissionAsync(
            int userId,
            string menuKey,
            string action)
        {
            var user = await _context.Users.FindAsync(userId);

            // 🔐 ADMIN BYPASS
            if (user.UserTypeId == 1)
                return true;

            var permission = await _context.UserMenuPermissions
                .Include(p => p.Menu)
                .FirstOrDefaultAsync(p =>
                    p.UserId == userId &&
                    p.Menu.MenuKey == menuKey);

            if (permission == null)
                return false;

            return action switch
            {
                "View" => permission.CanView,
                "Create" => permission.CanCreate,
                "Edit" => permission.CanEdit,
                "Delete" => permission.CanDelete,
                _ => false
            };
        }
    }

}
