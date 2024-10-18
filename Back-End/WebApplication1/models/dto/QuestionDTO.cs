namespace WebApplication1.models.dto
{
    public class QuestionDTO
    {
        public int Id { get; set; }
        public string question { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UserId { get; set; }
        public ApplicationUser appUser { get; set; }
        public int TotalLike { get; set; }
        public int TotalComment { get; set; }
        public string? UserName { get; set; }
        public Boolean? isfrind { get; set; } = true;

    }
}
