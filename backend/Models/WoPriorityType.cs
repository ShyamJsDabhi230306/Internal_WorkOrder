using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class WoPriorityType
{
    public int WoPriorityId { get; set; }

    public string WoPriorityType1 { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
}
