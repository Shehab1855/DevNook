namespace WebApplication1.models
{
    public class blockuser
    {

        // Foreign keys
        public string ApplicationUser1Id { get; set; }
        public string ApplicationUser2Id { get; set; }

        // Navigation properties
        public ApplicationUser ApplicationUser { get; set; }

    }
}
