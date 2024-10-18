namespace WebApplication1.models.dto
{
    public class QuestionEventDto
    {
        public int QuestionId { get; set; }
        public string userid { get; set; }
        public DateTime eventDate { get; set; }
        public string? text { get; set; }
    }
}
