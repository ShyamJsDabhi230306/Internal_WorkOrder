using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Authorize]

    [Route("api/[controller]")]
    [ApiController]
    public class VendorController : ControllerBase
    {
        private readonly IVendorRepository _vendorRepo;

        public VendorController(IVendorRepository vendorRepo)
        {
            _vendorRepo = vendorRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _vendorRepo.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var vendor = await _vendorRepo.GetByIdAsync(id);
            if (vendor == null) return NotFound();

            return Ok(vendor);
        }

        [HttpPost]
        public async Task<IActionResult> Create(VendorDto dto)
        {
            var vendor = await _vendorRepo.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = vendor.VendorId }, vendor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, VendorDto dto)
        {
            if (id != dto.VendorId)
                return BadRequest("VendorId mismatch");

            var updated = await _vendorRepo.UpdateAsync(dto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _vendorRepo.DeleteAsync(id);
            if (!result) return NotFound();

            return Ok("Vendor deleted successfully");
        }
    }
}
