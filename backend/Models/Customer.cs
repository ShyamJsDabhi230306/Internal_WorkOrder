using System;
using System.Collections.Generic;

namespace WorkOderManagementSystem.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string? CustomerName { get; set; }

    public string? CustomerRemark { get; set; }

    public bool? IsDeleted { get; set; }
}
