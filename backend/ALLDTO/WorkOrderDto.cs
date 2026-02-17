using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.ALLDTO
{
    public class WorkOrderDto
    {
        public int WorkOrderId { get; set; }
        public string? WorkOrderNo { get; set; }
        public int VendorId { get; set; }
        public int OrderTypeId { get; set; }
        public int WoPriorityId { get; set; }
        public DateTime WorkOrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? Address { get; set; }
        public string PreparedBy { get; set; }
        public int DivisionId {  get; set; }

        // NEW STATUS FIELDS ------------------
        public string Status { get; set; } = "Pending";
        public DateTime? AcceptDate { get; set; }
        public DateTime? AcceptDeliveryDate { get; set; }
        public DateTime? DispatchDate { get; set; }
        public DateTime? ReceiveDate { get; set; }

        // Conditional fields (only for Against Order)
        public string? Pono { get; set; }
        public DateTime? Podate { get; set; }
        public string? AuthorizedPerson { get; set; }

        public IFormFile? POAttachment { get; set; }

        public List<WorkOrderProductDto> Products { get; set; } = new();
    }
}
