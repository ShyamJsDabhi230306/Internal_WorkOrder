using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly WorkOrderManagementSystemContext context;

        public CompanyRepository(WorkOrderManagementSystemContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Company>> GetAllCompanyAsync()
        {
            return await context.Companies
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Company> GetCompanyByIdAsync(int id)
        {
            return await context.Companies
                .FirstOrDefaultAsync(c => c.CompanyId == id); // Tracking enabled now
        }

        public async Task AddCompanyAsync(Company company)
        {
            await context.Companies.AddAsync(company);
            await context.SaveChangesAsync();
        }

        // FIXED UPDATE
        public async Task UpdateCompanyAsync(Company company)
        {
            context.Entry(company).State = EntityState.Modified;
            await context.SaveChangesAsync();
        }

        public async Task DeleteCompanyAsync(int id)
        {
            var existing = await context.Companies.FindAsync(id);

            if (existing != null)
            {
                context.Companies.Remove(existing);
                await context.SaveChangesAsync();
            }
        }
    }
}
