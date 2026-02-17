using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class VendorRepository : IVendorRepository
    {
        private readonly WorkOrderManagementSystemContext _context;

        public VendorRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vendor>> GetAllAsync()
        {
            return await _context.Vendors.ToListAsync();
        }

        public async Task<Vendor?> GetByIdAsync(int id)
        {
            return await _context.Vendors.FindAsync(id);
        }

        public async Task<Vendor> AddAsync(VendorDto dto)
        {
            var vendor = new Vendor
            {
                VendorName = dto.VendorName,
                Address = dto.Address,
                ContactPersonName = dto.ContactPersonName,
                ContactPersonNo = dto.ContactPersonNo,
                UserName = dto.UserName,
                Password = dto.Password
            };

            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();
            return vendor;
        }

        public async Task<Vendor?> UpdateAsync(VendorDto dto)
        {
            var vendor = await _context.Vendors.FindAsync(dto.VendorId);
            if (vendor == null) return null;

            vendor.VendorName = dto.VendorName;
            vendor.Address = dto.Address;
            vendor.ContactPersonName = dto.ContactPersonName;
            vendor.ContactPersonNo = dto.ContactPersonNo;
            vendor.UserName = dto.UserName;
            vendor.Password = dto.Password;

            await _context.SaveChangesAsync();
            return vendor;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var vendor = await _context.Vendors.FindAsync(id);
            if (vendor == null) return false;

            _context.Vendors.Remove(vendor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
