using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IVendorRepository
    {
        Task<IEnumerable<Vendor>> GetAllAsync();
        Task<Vendor?> GetByIdAsync(int id);
        Task<Vendor> AddAsync(VendorDto dto);
        Task<Vendor?> UpdateAsync(VendorDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
