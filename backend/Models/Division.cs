using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class Division
{
    public int DivisionId { get; set; }

    public string DivisionName { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public string? DivisionCode { get; set; }

    public int? LocationId { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Location? Location { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<WorkOrder> WorkOrders { get; set; } = new List<WorkOrder>();
}
