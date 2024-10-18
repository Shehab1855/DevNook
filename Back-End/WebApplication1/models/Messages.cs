using WebApplication1.models;

namespace WebApplication1.Models
{
    public class Messages
    {
        public int Id { get; set; }
        public string? MessageText { get; set; }
        public string? File { get; set; }
        public DateTime SentAt { get; set; }

        public bool isupdate { get; set; } = false;
        public string SenderId { get; set; }
        public ApplicationUser Sender { get; set; }

        public string ReceiverId { get; set; }
        public ApplicationUser Receiver { get; set; }
    }
}
