namespace WorkOderManagementSystem.ALLDTO
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? UserRemark { get; set; }
        public int DivisionId { get; set; }
        public int UserTypeId { get; set; }
        public int? VendorId { get; set; }   // only when usertype=3 vendor
    }
}
