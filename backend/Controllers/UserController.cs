using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Authorize]

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repo;

        public UserController(IUserRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _repo.GetAllAsync();
            return Ok(list);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] UserDto dto)
        {
            var data = await _repo.CreateAsync(dto);
            return Ok(data);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserDto dto)
        {
            var ok = await _repo.UpdateAsync(id, dto);
            if (!ok) return NotFound();
            return Ok("Updated");
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _repo.DeleteAsync(id);
            if (!ok) return NotFound();
            return Ok("Deleted");
        }
    }
}
