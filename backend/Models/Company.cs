using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class Company
{
    public int CompanyId { get; set; }

    public string CompanyName { get; set; }
    public string CompanyCity { get; set; }
    public string CompanyCode { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Location> Locations { get; set; }
    = new List<Location>();
}

