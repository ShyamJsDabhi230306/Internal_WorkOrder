using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PriorityController : ControllerBase
    {
        private readonly IPriorityRepository _repo;

        public PriorityController(IPriorityRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _repo.GetAllAsync());
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] PriorityDto dto)
        {
            var data = await _repo.CreateAsync(dto);
            return Ok(data);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PriorityDto dto)
        {
            bool updated = await _repo.UpdateAsync(id, dto);
            if (!updated) return NotFound();

            return Ok("Updated Successfully!");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deleted = await _repo.SoftDeleteAsync(id);
            if (!deleted) return NotFound();

            return Ok("Deleted Successfully!");
        }
    }
}
