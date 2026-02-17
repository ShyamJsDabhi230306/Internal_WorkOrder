namespace WorkOderManagementSystem.ALLDTO
{
    public class DispatchWorkOrderDto
    {
        public string TransportBy { get; set; }

        public List<DispatchProductDto> Products { get; set; } = new();
        
    }
}
