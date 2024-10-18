namespace WebApplication1.models
{
    public class Projects
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string? Brief { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? UserId { get; set; }
        public ApplicationUser AppUser { get; set; }
        public long totallike { get; set; }
        public long totaldislike { get; set; }
        public long totalcomment { get; set; }
        public string? UserName { get; set; }
        public string? Status { get; set; }

    }
}
