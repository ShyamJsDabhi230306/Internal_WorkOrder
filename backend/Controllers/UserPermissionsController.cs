using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Route("api/user-permissions")]
    public class UserPermissionsController : ControllerBase
    {
        private readonly IUserPermissionRepository _repo;

        public UserPermissionsController(IUserPermissionRepository repo)
        {
            _repo = repo;
        }

        // 🔹 ADMIN: Get permissions of a user
        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            var permissions = await _repo.GetByUserIdAsync(userId);
            return Ok(permissions);
        }

        // 🔹 ADMIN: Save permissions
        [HttpPost("{userId}")]
        public async Task<IActionResult> Save(
            int userId,
            [FromBody] List<UserMenuPermission> permissions)
        {
            await _repo.SaveAsync(userId, permissions);
            return Ok();
        }
    }
}
