using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public int CategoryId { get; set; }

    public string? ProductName { get; set; }

    public string? ProductRemark { get; set; }

    public string? IsDeleted { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<WorkOrderProduct> WorkOrderProducts { get; set; } = new List<WorkOrderProduct>();
}
