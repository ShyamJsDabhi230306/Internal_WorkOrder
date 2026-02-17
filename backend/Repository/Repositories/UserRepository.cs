using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly WorkOrderManagementSystemContext _context;

        public UserRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        // -------------------------------------------------
        // LOGIN
        // -------------------------------------------------
        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            return await _context.Users
         .Include(u => u.Division)     // ⭐ REQUIRED
         .FirstOrDefaultAsync(u =>
             u.UserName == username &&
             u.Password == password &&
             u.IsDeleted == false);
        }

        // -------------------------------------------------
        // GET ALL USERS
        // -------------------------------------------------
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users
                .Include(u => u.UserType)
                .Include(u => u.Division)
                .Include(u => u.Vendor)
                .Where(u => u.IsDeleted == false)
                .ToListAsync();
        }

        // -------------------------------------------------
        // CREATE USER
        // -------------------------------------------------
        public async Task<User> CreateAsync(UserDto dto)
        {
            var user = new User
            {
                UserFullName = dto.UserFullName,
                UserName = dto.UserName,
                Password = dto.Password,
                UserRemark = dto.UserRemark,
                UserTypeId = dto.UserTypeId,
                DivisionId = dto.DivisionId,
                VendorId = dto.VendorId,
                IsDeleted = false
            };

            // ⭐ Only Vendor user must have VendorId
            if (dto.UserTypeId == 3)
            {
                if (dto.VendorId == null || dto.VendorId <= 0)
                    throw new Exception("VendorId is required for Vendor user.");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // -------------------------------------------------
        // UPDATE USER
        // -------------------------------------------------
        public async Task<bool> UpdateAsync(int id, UserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.UserFullName = dto.UserFullName;
            user.UserName = dto.UserName;
            user.Password = dto.Password;
            user.UserRemark = dto.UserRemark;
            user.UserTypeId = dto.UserTypeId;
            user.DivisionId = dto.DivisionId;
            user.VendorId = dto.VendorId;

            if (dto.UserTypeId == 3)
            {
                if (dto.VendorId == null || dto.VendorId <= 0)
                    throw new Exception("VendorId is required for Vendor user.");
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // -------------------------------------------------
        // DELETE USER
        // -------------------------------------------------
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

       
    }
}
