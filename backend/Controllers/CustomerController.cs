using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _repo;

        public CustomerController(ICustomerRepository repo)
        {
            _repo = repo;
        }

        // GET: api/customer
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _repo.GetAllCustomersAsync();
            var result = customers.Select(c => new CustomerDto
            {
                CustomerId = c.CustomerId,
                CustomerName = c.CustomerName ?? string.Empty,
                CustomerRemark = c.CustomerRemark
            });

            return Ok(result);
        }

        // GET: api/customer/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _repo.GetCustomerByIdAsync(id);
            if (customer == null)
                return NotFound();

            var result = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                CustomerName = customer.CustomerName ?? string.Empty,
                CustomerRemark = customer.CustomerRemark
            };

            return Ok(result);
        }

        // POST: api/customer
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CustomerDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var customer = new Customer
            {
                CustomerName = dto.CustomerName,
                CustomerRemark = dto.CustomerRemark
            };

            await _repo.AddCustomerAsync(customer);

            dto.CustomerId = customer.CustomerId;
            return CreatedAtAction(nameof(GetById), new { id = customer.CustomerId }, dto);
        }

        // PUT: api/customer/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != dto.CustomerId)
                return BadRequest("ID mismatch");

            var existingCustomer = await _repo.GetCustomerByIdAsync(id);
            if (existingCustomer == null)
                return NotFound();

            existingCustomer.CustomerName = dto.CustomerName;
            existingCustomer.CustomerRemark = dto.CustomerRemark;

            await _repo.UpdateCustomerAsync(existingCustomer);
            return NoContent();
        }

        // DELETE: api/customer/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingCustomer = await _repo.GetCustomerByIdAsync(id);
            if (existingCustomer == null)
                return NotFound();

            await _repo.DeleteCustomerAsync(id);
            return NoContent();
        }
    }

}
