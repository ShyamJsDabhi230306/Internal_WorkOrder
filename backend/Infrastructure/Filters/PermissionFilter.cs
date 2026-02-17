namespace WorkOderManagementSystem.Infrastructure.Filters
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using WorkOderManagementSystem.Repository.Interfaces;

    public class PermissionFilter : IAsyncActionFilter
    {
        private readonly IPermissionRepository _permissionRepo;

        public PermissionFilter(IPermissionRepository permissionRepo)
        {
            _permissionRepo = permissionRepo;
        }

        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            // 0️⃣ Skip validation for [AllowAnonymous]
            var endpoint = context.HttpContext.GetEndpoint();
            if (endpoint?.Metadata.GetMetadata<Microsoft.AspNetCore.Authorization.IAllowAnonymous>() != null)
            {
                await next();
                return;
            }

            // 1️⃣ Read attribute from Action or Controller
            var attr = endpoint?.Metadata.GetMetadata<RequirePermissionAttribute>()
                ?? context.Controller.GetType()
                    .GetCustomAttributes(typeof(RequirePermissionAttribute), true)
                    .FirstOrDefault() as RequirePermissionAttribute;

            // If no permission attribute → allow
            if (attr == null)
            {
                await next();
                return;
            }

            // 2️⃣ Get UserId from JWT / Claims
            var userIdClaim = context.HttpContext.User.FindFirst("UserId");

            if (userIdClaim == null)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            int userId = int.Parse(userIdClaim.Value);

            // 3️⃣ Detect CRUD action automatically
            var httpMethod = context.HttpContext.Request.Method;

            string action = httpMethod switch
            {
                "GET" => "View",
                "POST" => "Create",
                "PUT" => "Edit",
                "PATCH" => "Edit",
                "DELETE" => "Delete",
                _ => null
            };

            if (action == null)
            {
                await next();
                return;
            }

            // 4️⃣ Permission check
            bool allowed = await _permissionRepo
                .HasPermissionAsync(userId, attr.MenuKey, action);

            if (!allowed)
            {
                context.Result = new ForbidResult();
                return;
            }

            await next();
        }
    }

}
