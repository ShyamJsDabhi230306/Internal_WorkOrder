namespace WorkOderManagementSystem.Models
{
    public class Location
    {
        public int LocationId { get; set; }
        public int CompanyId { get; set; }

        public string? LocationName { get; set; }
        public string? LocationCode { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }

        public Company Company { get; set; }

        public virtual ICollection<Division> Divisions { get; set; }
        = new List<Division>();
    }
}
