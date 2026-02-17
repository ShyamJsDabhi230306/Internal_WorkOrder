public class WorkOrderListProductDto
{
    public string Category { get; set; }
    public string Product { get; set; }
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public int Quantity { get; set; }
    public int? DispatchedQuantity { get; set; } = 0;
    public int? ReceivedQuantity { get; set; } = 0;
    public int? PendingQuantity { get; set; } = 0;
    // ⭐ REQUIRED FOR UI
    public int? LastDispatchedQty { get; set; } = 0;


}
