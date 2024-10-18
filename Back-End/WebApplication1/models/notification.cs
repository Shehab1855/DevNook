namespace WebApplication1.models
{
    public class notification
    {
        public int Id { get; set; }
        public string userid { get; set; }
        public string AnotheruserID { get; set; }
        public string username { get; set; }
        public string? imgeurl { get; set; }
        public int notificationsrelatedID { get; set; }
        public string notificationdate { get; set; }
        public string notificationdType { get; set; }
        public string eventType { get; set; }

        public ApplicationUser user { get; set; }


    }
}
