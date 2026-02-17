using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMenuPermissionsController : ControllerBase
    {
        private readonly IUserMenuPermissionRepository _repo;

        public UserMenuPermissionsController(IUserMenuPermissionRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            var data = await _repo.GetByUserIdAsync(userId);
            return Ok(data);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> Save(
            int userId,
            [FromBody] List<UserMenuPermissionDto> permissions)
        {
            if (permissions == null)
                return BadRequest("Permissions are required");

            var entities = permissions
                .Where(p => p.MenuId > 0)
                .Select(p => new UserMenuPermission
                {
                    UserId = userId,
                    MenuId = p.MenuId,
                    CanView = p.CanView,
                    CanCreate = p.CanCreate,
                    CanEdit = p.CanEdit,
                    CanDelete = p.CanDelete
                })
                .ToList();

            await _repo.SaveAsync(userId, entities);
            return Ok();
        }
    }
}
