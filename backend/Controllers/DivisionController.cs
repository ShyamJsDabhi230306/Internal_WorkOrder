using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DivisionController : ControllerBase
    {
        private readonly IDivisionRepository _repo;

        public DivisionController(IDivisionRepository repo)
        {
            _repo = repo;
        }

        // GET: api/division
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var divisions = await _repo.GetAllDivisionsAsync();
            var result = divisions.Select(d => new DivisionDto
            {
                DivisionId = d.DivisionId,
                CompanyId = d.CompanyId,
                DivisionName = d.DivisionName ?? string.Empty
            });
            return Ok(result);
        }

        // GET: api/division/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var division = await _repo.GetDivisionByIdAsync(id);
            if (division == null)
                return NotFound();

            var result = new DivisionDto
            {
                DivisionId = division.DivisionId,
                CompanyId = division.CompanyId,
                DivisionName = division.DivisionName ?? string.Empty
            };

            return Ok(result);
        }

        // POST: api/division
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DivisionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var division = new Division
            {
                CompanyId = dto.CompanyId,
                DivisionName = dto.DivisionName
            };

            await _repo.AddDivisionAsync(division);

            dto.DivisionId = division.DivisionId;
            return CreatedAtAction(nameof(GetById), new { id = division.DivisionId }, dto);
        }

        // PUT: api/division/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DivisionDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != dto.DivisionId)
                return BadRequest("ID mismatch");

            var existingDivision = await _repo.GetDivisionByIdAsync(id);
            if (existingDivision == null)
                return NotFound();

            existingDivision.CompanyId = dto.CompanyId;
            existingDivision.DivisionName = dto.DivisionName;

            await _repo.UpdateDivisionAsync(existingDivision);
            return NoContent();
        }

        // DELETE: api/division/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingDivision = await _repo.GetDivisionByIdAsync(id);
            if (existingDivision == null)
                return NotFound();

            await _repo.DeleteDivisionAsync(id);
            return NoContent();
        }
    }

}