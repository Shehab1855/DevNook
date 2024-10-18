namespace WebApplication1.models
{
    public class RequestsSent
    {

        public string SenderId { get; set; }
        public string ReceiverId { get; set; }

        public ApplicationUser user { get; set; }


    }
}
