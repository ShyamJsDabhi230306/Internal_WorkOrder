using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class PriorityRepository : IPriorityRepository
    {
        private readonly WorkOrderManagementSystemContext _context;

        public PriorityRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WoPriorityType>> GetAllAsync()
        {
            return await _context.WoPriorityTypes
                .Where(x => x.IsDeleted == false)
                .ToListAsync();
        }

        public async Task<WoPriorityType?> GetByIdAsync(int id)
        {
            return await _context.WoPriorityTypes
                .FirstOrDefaultAsync(x => x.WoPriorityId == id && x.IsDeleted == false);
        }

        public async Task<WoPriorityType> CreateAsync(PriorityDto dto)
        {
            var entity = new WoPriorityType
            {
                WoPriorityType1 = dto.WoPriorityType,
                IsDeleted = false
            };

            _context.WoPriorityTypes.Add(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<bool> UpdateAsync(int id, PriorityDto dto)
        {
            var entity = await _context.WoPriorityTypes.FindAsync(id);
            if (entity == null) return false;

            entity.WoPriorityType1 = dto.WoPriorityType;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            var entity = await _context.WoPriorityTypes.FindAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = false;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
