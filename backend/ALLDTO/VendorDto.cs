namespace WorkOderManagementSystem.ALLDTO
{
    public class VendorDto
    {
        public int VendorId { get; set; }        // Used for Update/Delete/Get 
        public string VendorName { get; set; } = null!;
        public string? Address { get; set; }
        public string? ContactPersonName { get; set; }
        public string? ContactPersonNo { get; set; }
        public string UserName { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
