using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class WorkOrderProduct
{
    public int WorkOrderProductId { get; set; }

    public int WorkOrderId { get; set; }

    public int CategoryId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public int DispatchedQuantity { get; set; }

    public int? PendingQuantity { get; set; }

    public int ReceivedQuantity { get; set; }

    public int? LastDispatchQty { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual WorkOrder WorkOrder { get; set; } = null!;
}
