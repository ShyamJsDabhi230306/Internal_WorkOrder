using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
  
        public class UserTypeRepository : IUserTypeRepository
        {
            private readonly WorkOrderManagementSystemContext _context;

            public UserTypeRepository(WorkOrderManagementSystemContext context)
            {
                _context = context;
            }

            public async Task<IEnumerable<UserType>> GetAllAsync()
            {
                return await _context.UserTypes
                    .Where(x => x.IsDeleted == false || x.IsDeleted == null)
                    .ToListAsync();
            }

            public async Task<UserType?> GetByIdAsync(int id)
            {
                return await _context.UserTypes.FindAsync(id);
            }

            public async Task<UserType> AddAsync(UserTypeDto dto)
            {
                var userType = new UserType
                {
                    UserTypeName = dto.UserTypeName,
                    UserTypeRemark = dto.UserTypeRemark,
                    IsDeleted = false,
                };

                _context.UserTypes.Add(userType);
                await _context.SaveChangesAsync();
                return userType;
            }

            public async Task<UserType?> UpdateAsync(UserTypeDto dto)
            {
                var userType = await _context.UserTypes.FindAsync(dto.UserTypeId);
                if (userType == null) return null;

                userType.UserTypeName = dto.UserTypeName;
                userType.UserTypeRemark = dto.UserTypeRemark;
                //userType.IsDeleted = dto.IsDeleted;

                await _context.SaveChangesAsync();
                return userType;
            }

            public async Task<bool> DeleteAsync(int id)
            {
                var userType = await _context.UserTypes.FindAsync(id);
                if (userType == null) return false;

                userType.IsDeleted = true;   // Soft delete
                await _context.SaveChangesAsync();
                return true;
            }
        }
    
}
