using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class OrderType
{
    public int OrderTypeId { get; set; }

    public string? OrderTypeName { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
}
