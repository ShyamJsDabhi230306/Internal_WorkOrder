using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using WorkOderManagementSystem.ALLDTO;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;

namespace WorkOderManagementSystem.Repository.Repositories
{
    public class WorkOrderRepository : IWorkOrderRepository
    {
        private readonly WorkOrderManagementSystemContext _context;
        public WorkOrderRepository(WorkOrderManagementSystemContext context)
        {
            _context = context;
        }

        // =============================
        // Generate Work Order No
        // =============================

        // =============================
        // Generate Work Order No (Division-wise)
        // Format: WO-KPM-0001
        // =============================
        //private async Task<string> GenerateWorkOrderNo(int divisionId)
        //{
        //    // 1) Get division
        //    var division = await _context.Divisions
        //        .FirstOrDefaultAsync(d => d.DivisionId == divisionId);

        //    if (division == null)
        //    {
        //        throw new Exception($"Division not found for DivisionId={divisionId}");
        //    }

        //    // 2) Build division code from DivisionName (KPM, ETM etc.)
        //    //    - remove spaces & hyphen
        //    //    - uppercase
        //    //    - keep max 3 letters
        //    string rawName = (division.DivisionCode ?? "DIV")
        //        .Replace(" ", "")
        //        .Replace("-", "");

        //    string divCode = rawName.ToUpper();
        //    if (divCode.Length > 3)
        //    {
        //        divCode = divCode.Substring(0, 3);
        //    }

        //    // 3) Find last WorkOrder for THIS division
        //    var last = await _context.WorkOrders
        //        .Where(w => w.DivisionId == divisionId)
        //        .OrderByDescending(w => w.WorkOrderId)
        //        .FirstOrDefaultAsync();

        //    int lastNum = 0;

        //    if (last != null && !string.IsNullOrWhiteSpace(last.WorkOrderNo))
        //    {
        //        // Support both: "WO-0001" and "WO-KPM-0001"
        //        var parts = last.WorkOrderNo.Split('-');

        //        string numberPart = null;

        //        if (parts.Length == 2)
        //        {
        //            // "WO-0001"
        //            numberPart = parts[1];
        //        }
        //        else if (parts.Length == 3)
        //        {
        //            // "WO-KPM-0001"
        //            numberPart = parts[2];
        //        }

        //        if (!string.IsNullOrEmpty(numberPart))
        //        {
        //            int.TryParse(numberPart, out lastNum);
        //        }
        //    }

        //    int next = lastNum + 1;
        //    string numStr = next.ToString("0000");   // 0001, 0002 ...

        //    return $"WO-{divCode}-{numStr}";         // WO-KPM-0001
        //}

        // =============================
        // CREATE WORK ORDER
        // =============================



        //public async Task<WorkOrder> CreateAsync(WorkOrderDto dto)
        // {
        //     var entity = new WorkOrder
        //     {
        //         WorkOrderNo = await GenerateWorkOrderNo(dto.DivisionId),
        //         VendorId = dto.VendorId,
        //         OrderTypeId = dto.OrderTypeId,
        //         WoPriorityId = dto.WoPriorityId,
        //         WorkOrderDate = dto.WorkOrderDate,
        //         DeliveryDate = dto.DeliveryDate,
        //         Address = dto.Address,
        //         PreparedBy = dto.PreparedBy,
        //         DivisionId = dto.DivisionId,
        //         Pono = dto.OrderTypeId == 1 ? dto.Pono : null,
        //         Podate = dto.OrderTypeId == 1 ? dto.Podate : null,
        //         AuthorizedPerson = dto.OrderTypeId == 1 ? dto.AuthorizedPerson : null,
        //         Status = "Pending"
        //     };

        //     foreach (var p in dto.Products)
        //     {
        //         entity.WorkOrderProducts.Add(new WorkOrderProduct
        //         {
        //             CategoryId = p.CategoryId,
        //             ProductId = p.ProductId,
        //             Quantity = p.Quantity,
        //             PendingQuantity = p.Quantity,
        //             DispatchedQuantity = 0,
        //             ReceivedQuantity = 0
        //         });
        //     }

        //     _context.WorkOrders.Add(entity);
        //     await _context.SaveChangesAsync();

        //     return entity;
        // }
        private async Task<string> GenerateWorkOrderNo(int divisionId)
        {
            var division = await _context.Divisions
                .FirstOrDefaultAsync(d => d.DivisionId == divisionId);

            if (division == null)
                throw new Exception($"Division not found for DivisionId={divisionId}");

            // ✅ USE DIVISION CODE DIRECTLY
            // Example: "-SDV"
            var divCode = division.DivisionCode;

            if (string.IsNullOrWhiteSpace(divCode))
                throw new Exception("DivisionCode is missing in Division table");

            // 2) Find last WorkOrder for THIS division
            var lastWoNo = await _context.WorkOrders
                .Where(w => w.DivisionId == divisionId)
                .OrderByDescending(w => w.WorkOrderId)
                .Select(w => w.WorkOrderNo)
                .FirstOrDefaultAsync();

            int lastNum = 0;

            if (!string.IsNullOrWhiteSpace(lastWoNo))
            {
                // Supports: WO-0001, WO-SDV-0001
                var parts = lastWoNo.Split('-');
                int.TryParse(parts.Last(), out lastNum);
            }

            int next = lastNum + 1;
            string numStr = next.ToString("0000");

            return $"WO{divCode}-{numStr}";   // ✅ WO-SDV-0001
        }

        public async Task<WorkOrder> CreateAsync(WorkOrderDto dto)
        {
            try
            {

                /* ===================== SAVE PO PDF (ONLY IF PROVIDED) ===================== */
                string? poAttachmentPath = null;

                if (dto.OrderTypeId == 1 && dto.POAttachment != null)
                {
                    var uploadsRoot = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        "po-files"
                    );

                    if (!Directory.Exists(uploadsRoot))
                        Directory.CreateDirectory(uploadsRoot);

                    var fileName =
                        $"{Guid.NewGuid()}_{Path.GetFileName(dto.POAttachment.FileName)}";

                    var fullPath = Path.Combine(uploadsRoot, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await dto.POAttachment.CopyToAsync(stream);
                    }

                    poAttachmentPath = $"po-files/{fileName}";
                }




                var entity = new WorkOrder
                {
                    WorkOrderNo = await GenerateWorkOrderNo(dto.DivisionId),
                    VendorId = dto.VendorId == 0 ? null : dto.VendorId, 
                    OrderTypeId = dto.OrderTypeId,
                    WoPriorityId = dto.WoPriorityId,
                    WorkOrderDate = dto.WorkOrderDate,
                    DeliveryDate = dto.DeliveryDate,
                    Address = dto.Address,
                    PreparedBy = dto.PreparedBy,
                    DivisionId = dto.DivisionId,
                    Pono = dto.OrderTypeId == 1 ? dto.Pono : null,
                    Podate = dto.OrderTypeId == 1 ? dto.Podate : null,
                    AuthorizedPerson = dto.OrderTypeId == 1 ? dto.AuthorizedPerson : null,
                    // ✅ NEW (SAFE)
                    POAttachmentPath = poAttachmentPath,

                    Status = "Pending",
                };

                // IMPORTANT: ensure collection exists
                if (entity.WorkOrderProducts == null)
                    entity.WorkOrderProducts = new List<WorkOrderProduct>();

                foreach (var p in dto.Products)
                {
                    entity.WorkOrderProducts.Add(new WorkOrderProduct
                    {
                        CategoryId = p.CategoryId,
                        ProductId = p.ProductId,
                        Quantity = p.Quantity,
                        PendingQuantity = p.Quantity,
                        DispatchedQuantity = 0,
                        ReceivedQuantity = 0
                    });
                }

                _context.WorkOrders.Add(entity);
                await _context.SaveChangesAsync();

                return entity;
            }
            catch (Exception ex)
            {
                // Shows inner database errors also
                var message =
                    ex.InnerException?.Message ??
                    ex.Message ??
                    "Unknown error occurred while creating work order";

                throw new Exception("WorkOrder Create Error: " + message);
            }
        }


        // =============================
        // UPDATE WORK ORDER
        // =============================
        public async Task<bool> UpdateAsync(int id, WorkOrderDto dto)
        {
            var entity = await _context.WorkOrders
                .Include(x => x.WorkOrderProducts)
                .FirstOrDefaultAsync(x => x.WorkOrderId == id);

            if (entity == null) return false;

            entity.VendorId = dto.VendorId;
            entity.OrderTypeId = dto.OrderTypeId;
            entity.WoPriorityId = dto.WoPriorityId;
            entity.WorkOrderDate = dto.WorkOrderDate;
            entity.DeliveryDate = dto.DeliveryDate;
            entity.Address = dto.Address;
            entity.PreparedBy = dto.PreparedBy;
            entity.DivisionId = dto.DivisionId;
            entity.Pono = dto.OrderTypeId == 1 ? dto.Pono : null;
            entity.Podate = dto.OrderTypeId == 1 ? dto.Podate : null;
            entity.AuthorizedPerson = dto.OrderTypeId == 1 ? dto.AuthorizedPerson : null;

            _context.WorkOrderProducts.RemoveRange(entity.WorkOrderProducts);

            foreach (var p in dto.Products)
            {
                entity.WorkOrderProducts.Add(new WorkOrderProduct
                {
                    CategoryId = p.CategoryId,
                    ProductId = p.ProductId,
                    Quantity = p.Quantity,
                    PendingQuantity = p.Quantity,
                    DispatchedQuantity = 0,
                    ReceivedQuantity = 0
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // =============================
        // DELETE WORK ORDER
        // =============================
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.WorkOrders
                .Include(x => x.WorkOrderProducts)
                .FirstOrDefaultAsync(x => x.WorkOrderId == id);

            if (entity == null) return false;

            _context.WorkOrderProducts.RemoveRange(entity.WorkOrderProducts);
            _context.WorkOrders.Remove(entity);

            await _context.SaveChangesAsync();
            return true;
        }


        // =============================
        // GET BY ID
        // =============================
        //public async Task<WorkOrder?> GetByIdAsync(int id)
        //{
        //    return await _context.WorkOrders
        //        .Include(x => x.WorkOrderProducts)
        //        .FirstOrDefaultAsync(x => x.WorkOrderId == id);
        //}
        public async Task<WorkOrder?> GetByIdAsync(int id)
        {
            return await _context.WorkOrders
                .Include(x => x.WorkOrderProducts)
                    .ThenInclude(p => p.Category)   // ⭐ ADD THIS
                .Include(x => x.WorkOrderProducts)
                    .ThenInclude(p => p.Product)    // ⭐ ADD THIS
                .FirstOrDefaultAsync(x => x.WorkOrderId == id);
        }
        // =============================
        // ACCEPT WORK ORDER
        // =============================
        public async Task<bool> AcceptWorkOrderAsync(int id, int vendorId, AcceptWorkOrderDto dto)
        {
            var wo = await _context.WorkOrders.FindAsync(id);
            if (wo == null) return false;

            wo.VendorId = vendorId;
            wo.Status = "Accepted";
            wo.AcceptDate = DateTime.Now;
            wo.AcceptDeliveryDate = dto.AcceptDeliveryDate;

            await _context.SaveChangesAsync();
            return true;
        }

        // =============================
        // DISPATCH PRODUCT-WISE
        // =============================
        //public async Task<bool> DispatchProductAsync(int workOrderId, int productId, DispatchWorkOrderDto dto)
        //{
        //    var wo = await _context.WorkOrders
        //        .Include(w => w.WorkOrderProducts)
        //        .FirstOrDefaultAsync(w => w.WorkOrderId == workOrderId);

        //    if (wo == null) return false;

        //    var product = wo.WorkOrderProducts.FirstOrDefault(p => p.ProductId == productId);
        //    if (product == null) return false;

        //    var dtoItem = dto.Products.FirstOrDefault(x => x.ProductId == productId);
        //    if (dtoItem == null) return false;

        //    int qty = dtoItem.DispatchQty;
        //    if (qty <= 0) return false;

        //    int available = product.Quantity - product.DispatchedQuantity;
        //    if (qty > available) return false;

        //    product.DispatchedQuantity += qty;
        //    product.PendingQuantity = product.Quantity - product.DispatchedQuantity;

        //    wo.Status = "Dispatched";
        //    wo.DispatchDate = DateTime.Now;

        //    await _context.SaveChangesAsync();
        //    return true;
        //}
        //public async Task<bool> DispatchProductAsync(int workOrderId, int productId, DispatchWorkOrderDto dto)
        //{
        //    var wo = await _context.WorkOrders
        //        .Include(w => w.WorkOrderProducts)
        //        .FirstOrDefaultAsync(w => w.WorkOrderId == workOrderId);

        //    if (wo == null) return false;

        //    var product = wo.WorkOrderProducts.FirstOrDefault(p => p.ProductId == productId);
        //    if (product == null) return false;

        //    var dtoItem = dto.Products.FirstOrDefault(x => x.ProductId == productId);
        //    if (dtoItem == null) return false;

        //    int qty = dtoItem.DispatchQty;
        //    if (qty <= 0) return false;

        //    int available = product.Quantity - product.DispatchedQuantity;
        //    if (qty > available) return false;

        //    // TOTAL DISPATCH
        //    product.DispatchedQuantity += qty;
        //    product.PendingQuantity = product.Quantity - product.DispatchedQuantity;

        //    // STORE LAST DISPATCH IN MEMORY (NO DB NEEDED)
        //    LastDispatchMap[product.WorkOrderProductId] = qty;

        //    wo.Status = "Dispatched";
        //    wo.DispatchDate = DateTime.Now;

        //    await _context.SaveChangesAsync();
        //    return true;
        //}

        //    public async Task<IEnumerable<WorkOrderListDto>> GetAcceptedWorkOrdersAsync(
        //int userTypeId,
        //int? divisionId,
        //int? vendorId)
        //    {
        //        var query = _context.WorkOrders
        //            .Include(w => w.Vendor)
        //            .Include(w => w.OrderType)
        //            .Include(w => w.WoPriority)
        //            .Include(w => w.Division)
        //            .Include(w => w.WorkOrderProducts).ThenInclude(p => p.Category)
        //            .Include(w => w.WorkOrderProducts).ThenInclude(p => p.Product)
        //            .Where(w => w.Status == "Accepted")   // ⭐ ONLY ACCEPTED
        //            .AsQueryable();

        //        // ================= ROLE FILTER =================
        //        if (userTypeId == 2 && divisionId.HasValue)
        //        {
        //            query = query.Where(w => w.DivisionId == divisionId.Value);
        //        }

        //        if (userTypeId == 3 && vendorId.HasValue)
        //        {
        //            query = query.Where(w => w.VendorId == vendorId.Value);
        //        }

        //        return await query
        //            .OrderByDescending(w => w.AcceptDate)
        //            .Select(w => new WorkOrderListDto
        //            {
        //                WorkOrderId = w.WorkOrderId,
        //                WorkOrderNo = w.WorkOrderNo,
        //                VendorName = w.Vendor.VendorName,
        //                OrderTypeName = w.OrderType.OrderTypeName,
        //                PriorityType = w.WoPriority.WoPriorityType1,
        //                WorkOrderDate = w.WorkOrderDate,
        //                DeliveryDate = w.DeliveryDate,
        //                PreparedBy = w.PreparedBy,
        //                Address = w.Address,
        //                Status = w.Status,

        //                AcceptDate = w.AcceptDate,
        //                AcceptDeliveryDate = w.AcceptDeliveryDate,

        //                DivisionId = w.DivisionId,
        //                DivisionName = w.Division.DivisionName,
        //                VendorId = w.VendorId,
        //                PoFilePath = w.POAttachmentPath,

        //                Products = w.WorkOrderProducts.Select(p => new WorkOrderListProductDto
        //                {
        //                    ProductId = p.ProductId,
        //                    CategoryId = p.CategoryId,
        //                    Category = p.Category.CategoryName,
        //                    Product = p.Product.ProductName,
        //                    Quantity = p.Quantity,
        //                    DispatchedQuantity = p.DispatchedQuantity,
        //                    PendingQuantity = p.PendingQuantity,
        //                    ReceivedQuantity = p.ReceivedQuantity,
        //                    LastDispatchedQty = p.LastDispatchQty
        //                }).ToList()
        //            })
        //            .AsNoTracking()
        //            .ToListAsync();
        //    }
        public async Task<IEnumerable<WorkOrderListDto>> GetAcceptedWorkOrdersAsync(
        int userTypeId,
        int? divisionId,
        int? vendorId)
        {
            var query = _context.WorkOrders
                .Include(w => w.Vendor)
                .Include(w => w.OrderType)
                .Include(w => w.WoPriority)
                .Include(w => w.Division)
                .Include(w => w.WorkOrderProducts).ThenInclude(p => p.Category)
                .Include(w => w.WorkOrderProducts).ThenInclude(p => p.Product)
                .Where(w => w.AcceptDate != null)   // ✅ KEY FIX
                .AsQueryable();

            // ROLE FILTER
            if (userTypeId == 2 && divisionId.HasValue)
                query = query.Where(w => w.DivisionId == divisionId.Value);

            if (userTypeId == 3 && vendorId.HasValue)
                query = query.Where(w => w.VendorId == vendorId.Value);

            return await query
                .OrderByDescending(w => w.AcceptDate)
                .Select(w => new WorkOrderListDto
                {
                    WorkOrderId = w.WorkOrderId,
                    WorkOrderNo = w.WorkOrderNo,
                    VendorName = w.Vendor.VendorName,
                    OrderTypeName = w.OrderType.OrderTypeName,
                    PriorityType = w.WoPriority.WoPriorityType1,
                    WorkOrderDate = w.WorkOrderDate,
                    DeliveryDate = w.DeliveryDate,
                    PreparedBy = w.PreparedBy,
                    Address = w.Address,

                    Status = w.Status,   // Accepted / Dispatched / Completed

                    AcceptDate = w.AcceptDate,
                    AcceptDeliveryDate = w.AcceptDeliveryDate,

                    DivisionId = w.DivisionId,
                    DivisionName = w.Division.DivisionName,
                    VendorId = w.VendorId,
                    PoFilePath = w.POAttachmentPath,

                    Products = w.WorkOrderProducts.Select(p => new WorkOrderListProductDto
                    {
                        ProductId = p.ProductId,
                        CategoryId = p.CategoryId,
                        Category = p.Category.CategoryName,
                        Product = p.Product.ProductName,
                        Quantity = p.Quantity,
                        DispatchedQuantity = p.DispatchedQuantity,
                        PendingQuantity = p.PendingQuantity,
                        ReceivedQuantity = p.ReceivedQuantity,
                        LastDispatchedQty = p.LastDispatchQty
                    }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<bool> DispatchProductAsync(int workOrderId, int productId, DispatchWorkOrderDto dto)
        {
            var wo = await _context.WorkOrders
                .Include(w => w.WorkOrderProducts)
                .FirstOrDefaultAsync(w => w.WorkOrderId == workOrderId);

            if (wo == null) return false;

            var product = wo.WorkOrderProducts.FirstOrDefault(p => p.ProductId == productId);
            if (product == null) return false;

            var dtoItem = dto.Products.FirstOrDefault(x => x.ProductId == productId);
            if (dtoItem == null) return false;

            int qty = dtoItem.DispatchQty;

            // VALIDATION
            if (qty <= 0) return false;
            if (qty > (product.Quantity - product.DispatchedQuantity)) return false;

            // ⭐ TOTAL DISPATCHED
            product.DispatchedQuantity += qty;

            // ⭐ LAST DISPATCHED ONLY
            product.LastDispatchQty = qty;

            // PENDING
            product.PendingQuantity = product.Quantity - product.DispatchedQuantity;

            wo.Status = "Dispatched";
            wo.DispatchDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }


        // =============================
        // RECEIVE PRODUCT-WISE
        // =============================
        public async Task<bool> ReceiveProductAsync(int workOrderId, int productId, int qty)
        {
            var product = await _context.WorkOrderProducts
                .FirstOrDefaultAsync(x => x.WorkOrderId == workOrderId && x.ProductId == productId);

            if (product == null) return false;

            int canReceive = product.DispatchedQuantity - product.ReceivedQuantity;
            if (qty <= 0 || qty > canReceive) return false;

            product.ReceivedQuantity += qty;
            product.PendingQuantity = product.Quantity - product.ReceivedQuantity;

            var allProducts = await _context.WorkOrderProducts
                .Where(x => x.WorkOrderId == workOrderId)
                .ToListAsync();

            if (allProducts.All(p => p.PendingQuantity == 0))
            {
                var wo = await _context.WorkOrders.FindAsync(workOrderId);
                if (wo != null)
                {
                    wo.Status = "Completed";
                    wo.ReceiveDate = DateTime.Now;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // =============================
        // RECEIVE FULL WORK ORDER
        // =============================
        public async Task<bool> ReceiveWorkOrderAsync(int id)
        {
            var wo = await _context.WorkOrders
                .Include(x => x.WorkOrderProducts)
                .FirstOrDefaultAsync(x => x.WorkOrderId == id);

            if (wo == null) return false;

            if (!wo.WorkOrderProducts.All(p => p.ReceivedQuantity >= p.Quantity))
                return false;

            wo.Status = "Completed";
            wo.ReceiveDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public Task<bool> DispatchWorkOrderAsync(int workOrderId, DispatchWorkOrderDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<WorkOrderListDto>> GetAllWithVendorAsync(int userTypeId, int? divisionId, int? vendorId)
        {
            var query = _context.WorkOrders
                .Include(w => w.Vendor)
                .Include(w => w.OrderType)
                .Include(w => w.WoPriority)
                .Include(w => w.WorkOrderProducts).ThenInclude(p => p.Category)
                .Include(w => w.WorkOrderProducts).ThenInclude(p => p.Product)
                .AsQueryable();

            // ===========================================================
            // ADMIN (1) → sees everything
            // DIVISION USER (2) → sees ONLY work orders created by his own division
            // VENDOR USER (3) → sees ONLY work orders of his vendor
            // ===========================================================

            if (userTypeId == 2 && divisionId.HasValue)
            {
                // ⭐ Division user should only see their division's work orders
                query = query.Where(w => w.DivisionId == divisionId.Value);
            }

            if (userTypeId == 3)
            {
                if (vendorId.HasValue && vendorId.Value != 0)
                {
                    // Regular filter: All pending + specifically mine
                    query = query.Where(w => w.Status == "Pending" || w.VendorId == vendorId.Value);
                }
                else
                {
                    // Global pool request (vendorId is null): See ALL pending
                    query = query.Where(w => w.Status == "Pending");
                }
            }

            return await query
                .OrderByDescending(w => w.WorkOrderId)
                .Select(w => new WorkOrderListDto
                {
                    WorkOrderId = w.WorkOrderId,
                    WorkOrderNo = w.WorkOrderNo,
                    VendorName = w.Vendor != null ? w.Vendor.VendorName : "Unassigned",
                    OrderTypeName = w.OrderType.OrderTypeName,
                    PriorityType = w.WoPriority.WoPriorityType1,
                    WorkOrderDate = w.WorkOrderDate,
                    DeliveryDate = w.DeliveryDate,
                    PreparedBy = w.PreparedBy,
                    Address = w.Address,
                    Pono = w.Pono,
                    Podate = w.Podate,
                    AuthorizedPerson = w.AuthorizedPerson,
                    Status = w.Status,
                    AcceptDate = w.AcceptDate,
                    AcceptDeliveryDate = w.AcceptDeliveryDate,
                    DispatchDate = w.DispatchDate,
                    ReceiveDate = w.ReceiveDate,
                    DivisionId = w.DivisionId,
                    DivisionName = w.Division.DivisionName,
                    VendorId = w.VendorId,
                    // ⭐ ADD THIS LINE
                   PoFilePath = w.POAttachmentPath,


                    // ⭐ NEW: CALCULATED DELIVERY STATUS
                    //    DeliveryStatus =
                    //w.DispatchDate == null
                    //    ? "Pending Dispatch"
                    //    : (w.AcceptDeliveryDate != null && w.DispatchDate <= w.AcceptDeliveryDate
                    //        ? "On Time"
                    //        : "Late Delivery"),
                    DeliveryStatus =
                     w.DispatchDate == null
                         ? "Pending Dispatch"
                            : (
                         w.AcceptDeliveryDate != null
                                 ? (
                    w.DispatchDate <= w.AcceptDeliveryDate
                        ? "On Time"
                        : $"Late Delivery ({(w.DispatchDate.Value - w.AcceptDeliveryDate.Value).Days} days)"
                  )
                      : "Pending Target"
                        ),


                    Products = w.WorkOrderProducts.Select(p => new WorkOrderListProductDto
                    {
                        ProductId = p.ProductId,
                        CategoryId = p.CategoryId,
                        Category = p.Category.CategoryName,
                        Product = p.Product.ProductName,
                        Quantity = p.Quantity,
                        DispatchedQuantity = p.DispatchedQuantity,
                        PendingQuantity = p.PendingQuantity,
                        ReceivedQuantity = p.ReceivedQuantity,
                        LastDispatchedQty = p.LastDispatchQty
                    }).ToList()
                })
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<string> GeneratePreviewWorkOrderNo(int divisionId)
        {
            var division = await _context.Divisions
        .FirstOrDefaultAsync(d => d.DivisionId == divisionId);

            if (division == null)
                throw new Exception("Division not found");

            var divCode = division.DivisionCode;

            var lastWo = await _context.WorkOrders
                .Where(w => w.DivisionId == divisionId)
                .OrderByDescending(w => w.WorkOrderId)
                .Select(w => w.WorkOrderNo)
                .FirstOrDefaultAsync();

            int lastNum = 0;
            if (!string.IsNullOrWhiteSpace(lastWo))
            {
                var parts = lastWo.Split("-");
                int.TryParse(parts.Last(), out lastNum);
            }

            return $"WO{divCode}-{(lastNum + 1).ToString("0000")}";
        }
    }
}






























