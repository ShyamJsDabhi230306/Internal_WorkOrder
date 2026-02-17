using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class MenuRepository : IMenuRepository
    {
        
        
            private readonly WorkOrderManagementSystemContext _context;

            public MenuRepository(WorkOrderManagementSystemContext context)
            {
                _context = context;
            }

            public async Task<List<Menu>> GetAllAsync()
            {
                return await _context.Menus
                    .OrderBy(m => m.MenuId)
                    .ToListAsync();
            }
        }
    
}
