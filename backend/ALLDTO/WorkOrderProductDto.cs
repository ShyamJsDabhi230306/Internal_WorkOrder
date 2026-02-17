namespace WorkOderManagementSystem.ALLDTO
{
    public class WorkOrderProductDto
    {
        public int CategoryId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int DispatchedQuantity { get; set; } = 0;
        public int ReceivedQuantity { get; set; } = 0;
        public int? PendingQuantity { get; set; } = 0;
        public int? LastDispatchedQty { get; set; }

    }
}
