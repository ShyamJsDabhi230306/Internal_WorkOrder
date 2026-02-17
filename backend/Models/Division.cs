using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class Division
{
    public int DivisionId { get; set; }

    public int CompanyId { get; set; }

    public string? DivisionName { get; set; }

    public bool IsDeleted { get; set; }

    public string? DivisionCode { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
}
