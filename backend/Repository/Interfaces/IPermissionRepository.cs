namespace WorkOderManagementSystem.Repository.Interfaces
{
    public interface IPermissionRepository
    {
        Task<bool> HasPermissionAsync(int userId, string menuKey, string action);
    }
}
