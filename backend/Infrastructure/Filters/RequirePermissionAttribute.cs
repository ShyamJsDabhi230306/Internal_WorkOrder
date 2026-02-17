namespace WorkOderManagementSystem.Infrastructure.Filters
{
    [AttributeUsage(AttributeTargets.Class)]
    public class RequirePermissionAttribute : Attribute
    {
        public string MenuKey { get; }

        public RequirePermissionAttribute(string menuKey)
        {
            MenuKey = menuKey;
        }
    }

}
