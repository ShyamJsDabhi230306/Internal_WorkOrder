namespace WorkOderManagementSystem.Models
{
    public class Menu
    {
        public int MenuId { get; set; }
        public string MenuKey { get; set; }
        public string MenuName { get; set; }

        public ICollection<UserMenuPermission> UserMenuPermissions { get; set; }
    }
}
