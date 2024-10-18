namespace WebApplication1.models
{
    public class Question
    {
        public int Id { get; set; }
        public string question { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UserId { get; set; }
        public ApplicationUser appUser { get; set; }
        public int TotalLike { get; set; }
        public int TotalComment { get; set; }
        public string? UserName { get; set; }
    }
}
