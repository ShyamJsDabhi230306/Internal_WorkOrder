using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _repo;

        public CategoryController(ICategoryRepository repo)
        {
            _repo = repo;
        }

        // GET: api/category
        [HttpGet]
       
        public async Task<IActionResult> GetAll()
        {
            var categories = await _repo.GetAllCategoriesAsync();
            var result = categories.Select(c => new CategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName ?? string.Empty,
                CategoryRemark = c.CategoryRemark
            });

            return Ok(result);
        }

        // GET: api/category/5
        [HttpGet("{id:int}")]
        
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _repo.GetCategoryByIdAsync(id);
            if (category == null)
                return NotFound();

            var result = new CategoryDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName ?? string.Empty,
                CategoryRemark = category.CategoryRemark
            };

            return Ok(result);
        }

        // POST: api/category
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = new Category
            {
                CategoryName = dto.CategoryName,
                CategoryRemark = dto.CategoryRemark
            };

            await _repo.AddCategoryAsync(category);

            dto.CategoryId = category.CategoryId;
            return CreatedAtAction(nameof(GetById), new { id = category.CategoryId }, dto);
        }

        // PUT: api/category/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != dto.CategoryId)
                return BadRequest("ID mismatch");

            var existingCategory = await _repo.GetCategoryByIdAsync(id);
            if (existingCategory == null)
                return NotFound();

            existingCategory.CategoryName = dto.CategoryName;
            existingCategory.CategoryRemark = dto.CategoryRemark;

            await _repo.UpdateCategoryAsync(existingCategory);
            return NoContent();
        }

        // DELETE: api/category/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingCategory = await _repo.GetCategoryByIdAsync(id);
            if (existingCategory == null)
                return NotFound();

            await _repo.DeleteCategoryAsync(id);
            return NoContent();
        }
    }

}
