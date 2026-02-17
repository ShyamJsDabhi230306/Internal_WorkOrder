using Microsoft.EntityFrameworkCore;
using WorkOderManagementSystem.Infrastructure.Filters;
using WorkOderManagementSystem.Models;
using WorkOderManagementSystem.Repository.Interfaces;
using WorkOderManagementSystem.Repository.Repositories;

namespace WorkOderManagementSystem.Infrastructure
{
    public static class WorkOrderDependency
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<WorkOrderManagementSystemContext>(option =>
            option.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));


            services.AddScoped<ICompanyRepository, CompanyRepository>();
            services.AddScoped<IDivisionRepository, DivisionRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IVendorRepository, VendorRepository>();
            services.AddScoped<IUserTypeRepository, UserTypeRepository>();
            services.AddScoped<IWorkOrderRepository, WorkOrderRepository>();
            services.AddScoped<IOrderTypeRepository, OrderTypeRepository>();
            services.AddScoped<IPriorityRepository, PriorityRepository>();

            // ===============================
            // Permission Repositories
            // ===============================
            services.AddScoped<IPermissionRepository, PermissionRepository>();
            services.AddScoped<IUserPermissionRepository, UserPermissionRepository>();

            // ===============================
            // Permission Filter
            // ===============================
            services.AddScoped<PermissionFilter>();
            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IUserMenuPermissionRepository, UserMenuPermissionRepository>();



            return services;
        }
    }
}
