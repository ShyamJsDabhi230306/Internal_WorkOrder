using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class OrderTypeRepository : IOrderTypeRepository
    {
        private readonly WorkOrderManagementSystemContext _context;

        public OrderTypeRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderType>> GetAllAsync()
        {
            return await _context.OrderTypes
                .Where(x => x.IsDeleted == false)
                .ToListAsync();
        }

        public async Task<OrderType?> GetByIdAsync(int id)
        {
            return await _context.OrderTypes
                .FirstOrDefaultAsync(x => x.OrderTypeId == id && x.IsDeleted == false);
        }

        public async Task<OrderType> CreateAsync(OrderTypeDto dto)
        {
            var entity = new OrderType
            {
                OrderTypeName = dto.OrderTypeName,
                IsDeleted = false
            };

            _context.OrderTypes.Add(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<bool> UpdateAsync(int id, OrderTypeDto dto)
        {
            var entity = await _context.OrderTypes.FindAsync(id);
            if (entity == null) return false;

            entity.OrderTypeName = dto.OrderTypeName;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoftDeleteAsync(int id)
        {
            var entity = await _context.OrderTypes.FindAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = false;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
