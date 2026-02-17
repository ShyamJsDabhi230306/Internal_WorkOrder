using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? UserFullName { get; set; }

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public string? UserRemark { get; set; }

    public bool? IsDeleted { get; set; }

    public int DivisionId { get; set; }

    public int UserTypeId { get; set; }

    public int? VendorId { get; set; }

    public virtual Division Division { get; set; } = null!;

    public virtual Vendor? Vendor { get; set; }
    public virtual UserType UserType { get; set; }
}
