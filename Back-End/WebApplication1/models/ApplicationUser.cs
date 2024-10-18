using Microsoft.AspNetCore.Identity;
using WebApplication1.Models;

namespace WebApplication1.models
{
    public class ApplicationUser : IdentityUser

    {
        public string fname { get; set; }
        public string lname { get; set; }
        public bool IsPrivate { get; set; } = false;

        public string? imgeurl { get; set; } = "OIP.jpeg";
        public string? CV { get; set; }

        public DateTime Birthdate { get; set; }

        public string? BIO { get; set; }
        
        public string? ginder { get; set; }
        public ICollection<Question> Questions { get; set; }
        public ICollection<Projects> Projects { get; set; }
        public ICollection<Friendship> Friendships { get; set; }
        public ICollection<blockuser> blockusers { get; set; }
        public ICollection<RequestsSent> RequestsSent { get; set; }
        public ICollection<post> posts { get; set; }
        public ICollection<evnet> Evnets { get; set; }
        public ICollection<Messages> messageSender { get; set; }
        public ICollection<Messages> messageReceiver { get; set; }
        public ICollection<notification> notifications { get; set; }
    }
}
        