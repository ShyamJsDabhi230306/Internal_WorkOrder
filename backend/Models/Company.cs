using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class Company
{
    public int CompanyId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string CompanyCity { get; set; } = null!;

    public string CompanyCode { get; set; } = null!;

    public virtual ICollection<Division> Divisions { get; set; } = new List<Division>();
}
