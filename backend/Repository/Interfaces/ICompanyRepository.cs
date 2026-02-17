using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface ICompanyRepository
    {
        Task<IEnumerable<Company>> GetAllCompanyAsync();
        Task<Company>GetCompanyByIdAsync(int id);
        Task AddCompanyAsync(Company company);
        Task UpdateCompanyAsync(Company company);
        Task DeleteCompanyAsync(int id);
      
    }
}
