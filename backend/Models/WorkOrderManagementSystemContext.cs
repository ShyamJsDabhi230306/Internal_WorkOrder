using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WorkOderManagementSystem.Models;

public partial class WorkOrderManagementSystemContext : DbContext
{
    public WorkOrderManagementSystemContext(DbContextOptions<WorkOrderManagementSystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Division> Divisions { get; set; }

    public virtual DbSet<OrderType> OrderTypes { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserType> UserTypes { get; set; }

    public virtual DbSet<Vendor> Vendors { get; set; }

    public virtual DbSet<WoPriorityType> WoPriorityTypes { get; set; }

    public virtual DbSet<WorkOrder> WorkOrders { get; set; }

    public virtual DbSet<WorkOrderProduct> WorkOrderProducts { get; set; }
    
    public DbSet<Menu> Menus { get; set; }
    public DbSet<UserMenuPermission> UserMenuPermissions { get; set; }
    public DbSet<Location> Locations { get; set; }

    //public DbSet<PageMaster> PageMasters { get; set; }
    //public DbSet<UserPageRight> UserPageRights { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {  }
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    //=> optionsBuilder.UseSqlServer("Server=103.212.120.184,1433;Database=WorkOrderManagementSystem;User Id=sa;Password=India@143;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;");
    //=> optionsBuilder.UseSqlServer(default);

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A0B41EEB181");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryName).HasMaxLength(200);
            entity.Property(e => e.CategoryRemark).HasMaxLength(200);
        });

        modelBuilder.Entity<UserMenuPermission>()
    .HasOne(p => p.Menu)
    .WithMany(m => m.UserMenuPermissions)
    .HasForeignKey(p => p.MenuId); modelBuilder.Entity<UserMenuPermission>()
    .HasOne(p => p.Menu)
    .WithMany(m => m.UserMenuPermissions)
    .HasForeignKey(p => p.MenuId);

        // ===============================
        // Menu
        // ===============================
        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.MenuId);

            entity.Property(e => e.MenuKey)
                  .HasMaxLength(50)
                  .IsRequired();

            entity.Property(e => e.MenuName)
                  .HasMaxLength(100)
                  .IsRequired();
        });

        // ===============================
        // UserMenuPermission (COMPOSITE KEY)
        // ===============================
        



        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK__Company__2D971CACD35D16EA");

            entity.ToTable("Company");

            entity.Property(e => e.CompanyCity).HasMaxLength(200);
            entity.Property(e => e.CompanyCode).HasMaxLength(50);
            entity.Property(e => e.CompanyName).HasMaxLength(200);
        });


        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(e => e.LocationId);

            entity.ToTable("Location");

            entity.Property(e => e.LocationName)
                  .HasMaxLength(200)
                  .IsRequired();

            entity.Property(e => e.LocationCode)
                  .HasMaxLength(50);

            entity.Property(e => e.IsActive)
                  .HasDefaultValue(true);

            entity.Property(e => e.IsDeleted)
                  .HasDefaultValue(false);

            entity.Property(e => e.CreatedAt)
                  .HasColumnType("datetime");

            entity.Property(e => e.UpdatedAt)
                  .HasColumnType("datetime");

            entity.HasOne(d => d.Company)
                  .WithMany(p => p.Locations)
                  .HasForeignKey(d => d.CompanyId)
                  .OnDelete(DeleteBehavior.ClientSetNull)
                  .HasConstraintName("FK_Location_Company");
        });


        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D82465AB51");

            entity.Property(e => e.CustomerName).HasMaxLength(200);
            entity.Property(e => e.CustomerRemark).HasMaxLength(200);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Division>(entity =>
        {
            entity.HasKey(e => e.DivisionId).HasName("PK__Division__20EFC6A896EF5EFA");

            entity.ToTable("Division");

            entity.Property(e => e.DivisionCode).HasMaxLength(20);
            entity.Property(e => e.DivisionName).HasMaxLength(200);

            //entity.HasOne(d => d.Company).WithMany(p => p.Divisions)
            //    .HasForeignKey(d => d.CompanyId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK_Division_Company");
        });

        modelBuilder.Entity<OrderType>(entity =>
        {
            entity.HasKey(e => e.OrderTypeId).HasName("PK__OrderTyp__23AC266C7C41AB75");

            entity.ToTable("OrderType");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.OrderTypeName).HasMaxLength(200);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6CD61775862");

            entity.ToTable("Product");

            entity.Property(e => e.IsDeleted).HasMaxLength(200);
            entity.Property(e => e.ProductName).HasMaxLength(200);
            entity.Property(e => e.ProductRemark).HasMaxLength(200);

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Product_Category");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C277979CD");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.UserFullName).HasMaxLength(200);
            entity.Property(e => e.UserName).HasMaxLength(50);
            entity.Property(e => e.UserRemark).HasMaxLength(200);

            entity.HasOne(d => d.Division).WithMany(p => p.Users)
                .HasForeignKey(d => d.DivisionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Division");

            entity.HasOne(d => d.Vendor).WithMany(p => p.Users)
                .HasForeignKey(d => d.VendorId)
                .HasConstraintName("FK_Users_Vendors");
        });

        modelBuilder.Entity<UserType>(entity =>
        {
            entity.HasKey(e => e.UserTypeId).HasName("PK__UserType__40D2D816DE1E17B3");

            entity.ToTable("UserType");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.UserTypeName).HasMaxLength(200);
            entity.Property(e => e.UserTypeRemark).HasMaxLength(200);
        });

        modelBuilder.Entity<Vendor>(entity =>
        {
            entity.HasKey(e => e.VendorId).HasName("PK__Vendors__FC8618F3E907FA1F");

            entity.HasIndex(e => e.UserName, "UQ__Vendors__C9F2845693981EA7").IsUnique();

            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.ContactPersonName).HasMaxLength(150);
            entity.Property(e => e.ContactPersonNo).HasMaxLength(20);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.UserName).HasMaxLength(100);
            entity.Property(e => e.VendorName).HasMaxLength(255);
        });

        modelBuilder.Entity<WoPriorityType>(entity =>
        {
            entity.HasKey(e => e.WoPriorityId).HasName("PK__WoPriori__33C5AF60E31376C2");

            entity.ToTable("WoPriorityType");

            entity.Property(e => e.WoPriorityType1)
                .HasMaxLength(200)
                .HasColumnName("WoPriorityType");
        });

        modelBuilder.Entity<WorkOrder>(entity =>
        {
            entity.HasKey(e => e.WorkOrderId).HasName("PK__WorkOrde__AE7551155EA64560");

            entity.ToTable("WorkOrder");

            entity.Property(e => e.AcceptDate).HasColumnType("datetime");
            entity.Property(e => e.AcceptDeliveryDate).HasColumnType("datetime");
            entity.Property(e => e.Address)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.AuthorizedPerson)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.DeliveryDate).HasColumnType("datetime");
            entity.Property(e => e.DispatchDate).HasColumnType("datetime");
            entity.Property(e => e.DivisionId).HasDefaultValue(1);
            entity.Property(e => e.Podate)
                .HasColumnType("datetime")
                .HasColumnName("PODate");
            entity.Property(e => e.Pono)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PONo");
            entity.Property(e => e.PreparedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ReceiveDate).HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.WorkOrderDate).HasColumnType("datetime");
            entity.Property(e => e.WorkOrderNo)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.OrderType).WithMany(p => p.WorkOrders)
                .HasForeignKey(d => d.OrderTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WorkOrder_OrderType");

            entity.HasOne(d => d.Vendor).WithMany(p => p.WorkOrders)
               .HasForeignKey(d => d.VendorId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FK_WorkOrder_Vendors");

            entity.HasOne(w => w.VendorUser)
                 .WithMany()
                 .HasForeignKey(w => w.VendorId)
                 .IsRequired(false)
                 .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.WoPriority).WithMany(p => p.WorkOrders)
                .HasForeignKey(d => d.WoPriorityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WorkOrder_WoPriorityType");

            entity.HasOne(d => d.Division).WithMany(p => p.WorkOrders)
                .HasForeignKey(d => d.DivisionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WorkOrder_Division");
        });

        modelBuilder.Entity<WorkOrderProduct>(entity =>
        {
            entity.HasKey(e => e.WorkOrderProductId).HasName("PK__WorkOrde__DB587AA3913A11B2");

            entity.ToTable("WorkOrderProduct");

            entity.Property(e => e.DispatchedQuantity).HasDefaultValue(0);
            entity.Property(e => e.LastDispatchQty).HasDefaultValue(0);

            entity.HasOne(d => d.Category).WithMany(p => p.WorkOrderProducts)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WorkOrderProduct_Category");

            entity.HasOne(d => d.Product).WithMany(p => p.WorkOrderProducts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_WorkOrderProduct_Product");

            entity.HasOne(d => d.WorkOrder).WithMany(p => p.WorkOrderProducts)
                .HasForeignKey(d => d.WorkOrderId)
                .HasConstraintName("FK_WorkOrderProduct_WorkOrder");
        });
        
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
