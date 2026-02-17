
public class WorkOrderListDto
{
    public int WorkOrderId { get; set; }


    // ⭐ ADD THIS
    public string? PoFilePath { get; set; }
    public string WorkOrderNo { get; set; }
    public string VendorName { get; set; }
    public string OrderTypeName { get; set; }
    public string PriorityType { get; set; }
    public DateTime WorkOrderDate { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string PreparedBy { get; set; }
    public string? Pono { get; set; }
    public DateTime? Podate { get; set; }
    public string? Address { get; set; }
    public int DivisionId { get; set; }
    public int VendorId { get; set; }
    public string DivisionName { get; set; }
    public string? AuthorizedPerson { get; set; }
    public string Status { get; set; }
    public DateTime? AcceptDate { get; set; }
    public DateTime? AcceptDeliveryDate { get; set; }
    public DateTime? DispatchDate { get; set; }
    public DateTime? ReceiveDate { get; set; }
    public string DeliveryStatus { get; set; }

    //public int DispatchedQuantity { get; set; } = 0;
    //public int PendingQuantity { get; set; } = 0;

    public IEnumerable<WorkOrderListProductDto> Products { get; set; }
}