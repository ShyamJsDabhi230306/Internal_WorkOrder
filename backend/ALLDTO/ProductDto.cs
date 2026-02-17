namespace WorkOderManagementSystem.ALLDTO
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductRemark { get; set; }
    }

}
