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
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _repo;

        public ProductController(IProductRepository repo)
        {
            _repo = repo;
        }

        // GET: api/product
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _repo.GetAllProductsAsync();
            var result = products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                CategoryId = p.CategoryId,
                ProductName = p.ProductName ?? string.Empty,
                ProductRemark = p.ProductRemark
            });

            return Ok(result);
        }

        // GET: api/product/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _repo.GetProductByIdAsync(id);
            if (product == null)
                return NotFound();

            var result = new ProductDto
            {
                ProductId = product.ProductId,
                CategoryId = product.CategoryId,
                ProductName = product.ProductName ?? string.Empty,
                ProductRemark = product.ProductRemark
            };

            return Ok(result);
        }
        [HttpGet("byCategory/{categoryId:int}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var products = await _repo.GetProductsByCategoryAsync(categoryId);

            var result = products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                CategoryId = p.CategoryId,
                ProductName = p.ProductName,
                ProductRemark = p.ProductRemark
            });

            return Ok(result);
        }

        // POST: api/product
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = new Product
            {
                CategoryId = dto.CategoryId,
                ProductName = dto.ProductName,
                ProductRemark = dto.ProductRemark,
                IsDeleted = "false"
            };

            await _repo.AddProductAsync(product);

            dto.ProductId = product.ProductId;
            return CreatedAtAction(nameof(GetById), new { id = product.ProductId }, dto);
        }

        // PUT: api/product/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != dto.ProductId)
                return BadRequest("ID mismatch");

            var existingProduct = await _repo.GetProductByIdAsync(id);
            if (existingProduct == null)
                return NotFound();

            existingProduct.CategoryId = dto.CategoryId;
            existingProduct.ProductName = dto.ProductName;
            existingProduct.ProductRemark = dto.ProductRemark;

            await _repo.UpdateProductAsync(existingProduct);
            return NoContent();
        }

        // DELETE: api/product/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingProduct = await _repo.GetProductByIdAsync(id);
            if (existingProduct == null)
                return NotFound();

            await _repo.DeleteProductAsync(id);
            return NoContent();
        }
    }

}
