using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyRepository companyRepository;

        public CompanyController(ICompanyRepository companyRepository)
        {
            this.companyRepository = companyRepository;
        }

        [HttpGet]

        public async Task<IActionResult> GetAllCom()
        {
            var data = await companyRepository.GetAllCompanyAsync();

            var comp = data.Select(c => new CompanyDto
            {
                CompanyId = c.CompanyId,
                CompanyName = c.CompanyName,
                CompanyCity = c.CompanyCity,
                CompanyCode = c.CompanyCode,
            });

            return Ok(comp);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var company = await companyRepository.GetCompanyByIdAsync(id);
            if (company == null)
                return NotFound();

            return Ok(new CompanyDto
            {
                CompanyId = company.CompanyId,
                CompanyName = company.CompanyName,
                CompanyCity = company.CompanyCity,
                CompanyCode = company.CompanyCode
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CompanyDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var company = new Company
            {
                CompanyName = dto.CompanyName,
                CompanyCity = dto.CompanyCity,
                CompanyCode = dto.CompanyCode
            };

            await companyRepository.AddCompanyAsync(company);

            return CreatedAtAction(nameof(GetById),
                new { id = company.CompanyId }, dto);
        }

        // 🚀 FIXED UPDATE (NO ERROR NOW)
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CompanyDto dto)
        {
            if (id != dto.CompanyId)
                return BadRequest("ID mismatch");

            var existingCompany = await companyRepository.GetCompanyByIdAsync(id);
            if (existingCompany == null)
                return NotFound();

            existingCompany.CompanyName = dto.CompanyName;
            existingCompany.CompanyCity = dto.CompanyCity;
            existingCompany.CompanyCode = dto.CompanyCode;

            await companyRepository.UpdateCompanyAsync(existingCompany);

            return Ok("Updated Successfully");
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingCompany = await companyRepository.GetCompanyByIdAsync(id);

            if (existingCompany == null)
                return NotFound();

            await companyRepository.DeleteCompanyAsync(id);

            return Ok("Deleted Successfully");
        }
    }
}
