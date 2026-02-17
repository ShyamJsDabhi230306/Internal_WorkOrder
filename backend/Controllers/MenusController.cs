using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenusController : ControllerBase
    {

        private readonly IMenuRepository _repo;

        public MenusController(IMenuRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _repo.GetAllAsync());
        }
    }
}
