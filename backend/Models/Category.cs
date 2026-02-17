using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public string? CategoryRemark { get; set; }

    public bool IsDeleted { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<WorkOrderProduct> WorkOrderProducts { get; set; } = new List<WorkOrderProduct>();
}
