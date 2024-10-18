namespace WebApplication1.models.dto
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Brief { get; set; }
        public string FilePath { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? UserId { get; set; }
        public long totallike { get; set; }
        public string? userurl { get; set; }
        public long totaldislike { get; set; }
        public long totalcomment { get; set; }
        public string? UserName { get; set; }
        public Boolean? isfrind { get; set; } = true;
    }
}

