using WorkOderManagementSystem.Models;

namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IDivisionRepository
    {
        Task<IEnumerable<Division>> GetAllDivisionsAsync();
        Task<Division?> GetDivisionByIdAsync(int id);
        Task AddDivisionAsync(Division division);
        Task UpdateDivisionAsync(Division division);
        Task DeleteDivisionAsync(int id);
    }
}
