using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class UserType
{
    public int UserTypeId { get; set; }

    public string? UserTypeName { get; set; }

    public string? UserTypeRemark { get; set; }

    public bool? IsDeleted { get; set; }
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
