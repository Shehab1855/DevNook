namespace WebApplication1.models.dto
{
    public class messageDTO
    {
        public string? MessageText { get; set; }
        public string? file { get; set; }

        public ApplicationUser Sender { get; set; }
        public ApplicationUser Receiver { get; set; }
        public string Senderid { get; set; }

        public string Receiverid { get; set; }

    }
}
