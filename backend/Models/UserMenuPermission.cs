namespace WorkOderManagementSystem.Models
{
    public class UserMenuPermission
    {
        public int UserMenuPermissionId { get; set; }

        public int UserId { get; set; }
        public int MenuId { get; set; }

        public bool CanView { get; set; }
        public bool CanCreate { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }

        public Menu Menu { get; set; }
    }
}
