using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class WorkOrder
{
    public int WorkOrderId { get; set; }

    public string WorkOrderNo { get; set; } = null!;

    public int? VendorId { get; set; }

    public int OrderTypeId { get; set; }

    public int WoPriorityId { get; set; }

    public DateTime WorkOrderDate { get; set; }

    public DateTime? DeliveryDate { get; set; }

    public string? Address { get; set; }

    public string PreparedBy { get; set; } = null!;

    public string? Pono { get; set; }

    public DateTime? Podate { get; set; }

    public string? AuthorizedPerson { get; set; }

    public string? Status { get; set; }

    public DateTime? AcceptDeliveryDate { get; set; }

    public DateTime? AcceptDate { get; set; }

    public DateTime? DispatchDate { get; set; }

    public DateTime? ReceiveDate { get; set; }

    public int DivisionId { get; set; }

    public virtual OrderType OrderType { get; set; } = null!;

    public virtual Vendor? Vendor { get; set; }

    public virtual WoPriorityType WoPriority { get; set; } = null!;
    public virtual Division Division { get; set; }


    // for work po atachment 
    public string? POAttachmentPath { get; set; }


    public virtual ICollection<WorkOrderProduct> WorkOrderProducts { get; set; } = new List<WorkOrderProduct>();
}
