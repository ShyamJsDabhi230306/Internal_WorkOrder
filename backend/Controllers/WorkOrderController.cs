using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Repository.Interfaces;
using WorkOderManagementSystem.Repository.Repositories;

namespace WorkOderManagementSystem.Controllers
{
    //[Authorize]

    [Route("api/[controller]")]
    [ApiController]
    public class WorkOrderController : ControllerBase
    {
        private readonly IWorkOrderRepository _repo;

        public WorkOrderController(IWorkOrderRepository repo)
        {
            _repo = repo;
        }

        //[HttpPost("create")]
        //public async Task<IActionResult> Create([FromBody] WorkOrderDto dto)
        //{
        //    var result = await _repo.CreateAsync(dto);
        //    return Ok(result);
        //}

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] WorkOrderDto dto)
        {
            var created = await _repo.CreateAsync(dto);

            return Ok(new
            {
                workOrderId = created.WorkOrderId,
                workOrderNo = created.WorkOrderNo
            });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] WorkOrderDto dto)
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

        //[HttpGet("all")]
        //public async Task<IActionResult> All()
        //{
        //    var list = await _repo.GetAllAsync();
        //    return Ok(list);
        //}

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var data = await _repo.GetByIdAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPut("accept/{id}/{vendorId}")]
        public async Task<IActionResult> Accept(int id, int vendorId, [FromBody] AcceptWorkOrderDto dto)
        {
            var ok = await _repo.AcceptWorkOrderAsync(id, vendorId, dto);
            if (!ok) return BadRequest("Accept failed");
            return Ok("Accepted");
        }

        [HttpPut("dispatch-product/{workOrderId}/{productId}")]
        public async Task<IActionResult> DispatchProduct(
            int workOrderId,
            int productId,
            [FromBody] DispatchWorkOrderDto dto)
        {
            var ok = await _repo.DispatchProductAsync(workOrderId, productId, dto);
            if (!ok) return BadRequest("Product dispatch failed");
            return Ok("Product dispatched successfully");
        }

        [HttpPut("receive-product/{workOrderId}/{productId}")]
        public async Task<IActionResult> ReceiveProduct(
            int workOrderId,
            int productId,
            [FromBody] ReceiveProductDto dto)
        {
            var ok = await _repo.ReceiveProductAsync(workOrderId, productId, dto.Qty);
            if (!ok) return BadRequest("Receive failed");
            return Ok("Received successfully");
        }

        [HttpPut("receive/{id}")]
        public async Task<IActionResult> Receive(int id)
        {
            var ok = await _repo.ReceiveWorkOrderAsync(id);
            if (!ok) return BadRequest("Receive failed");
            return Ok("Completed");
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll(int userTypeId, int? divisionId, int? vendorId)
        {
            // CALL REPO WITH PARAMETERS (NEEDED!)
            var list = await _repo.GetAllWithVendorAsync(userTypeId, divisionId, vendorId);

            // ========== ADMIN (1) ==========
            if (userTypeId == 1)
            {
                return Ok(list); // Admin sees everything
            }

            // ========== DIVISION USER (2) ==========
            if (userTypeId == 2)
            {
                if (!divisionId.HasValue || divisionId == 0)
                    return BadRequest("DivisionId is required for division users");

                // Repo already filtered, return final filtered list
                return Ok(list);
            }

            // ========== VENDOR USER (3) ==========
            if (userTypeId == 3)
            {
                return Ok(list);
            }

            return BadRequest("Invalid userType");
        }
        [HttpGet("preview-no/{divisionId}")]
        public async Task<IActionResult> PreviewWorkOrderNo(int divisionId)
        {
            var no = await _repo.GeneratePreviewWorkOrderNo(divisionId);
            return Ok(new { workOrderNo = no });
        }

        [Authorize]
        [HttpGet("po/{fileName}")]
        public IActionResult GetPoFile(string fileName)
        {
            var filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "po-files",
                fileName
            );

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            return PhysicalFile(filePath, "application/pdf");
        }
        [HttpGet("accepted")]
        public async Task<IActionResult> GetAcceptedWorkOrders(
    int userTypeId,
    int? divisionId,
    int? vendorId)
        {
            var data = await _repo
                .GetAcceptedWorkOrdersAsync(userTypeId, divisionId, vendorId);

            return Ok(data);
        }



    }
}


