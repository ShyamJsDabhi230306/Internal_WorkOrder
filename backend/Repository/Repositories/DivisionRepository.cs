using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

public class DivisionRepository : IDivisionRepository
{
    private readonly WorkOrderManagementSystemContext _context;

    public DivisionRepository(WorkOrderManagementSystemContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Division>> GetAllDivisionsAsync()
    {
        return await _context.Divisions
            .Where(d => !d.IsDeleted)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Division?> GetDivisionByIdAsync(int id)
    {
        return await _context.Divisions
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.DivisionId == id && !d.IsDeleted);
    }

    public async Task AddDivisionAsync(Division division)
    {
        await _context.Divisions.AddAsync(division);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateDivisionAsync(Division division)
    {
        _context.Divisions.Update(division);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteDivisionAsync(int id)
    {
        var division = await _context.Divisions.FindAsync(id);
        if (division != null)
        {
            // Soft delete
            division.IsDeleted = true;
            await _context.SaveChangesAsync();
        }
    }
}
