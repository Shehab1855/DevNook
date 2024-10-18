namespace WebApplication1.models.dto
{
    public class ProjectEventDto
    {
        public int ProjectId { get; set; }
        public string userid { get; set; }
        public DateTime eventDate { get; set; }
        public string? text { get; set; }

    }
}
