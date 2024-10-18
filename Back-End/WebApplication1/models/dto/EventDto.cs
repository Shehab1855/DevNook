using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.models.dto
{
    public class EventDto
    {
        public int postid { get; set; }
        public int projectid { get; set; }
        public string userid { get; set; }
        public int eventid { get; set; }
        public string typeEvent { get; set; }
        public string eventDate { get; set; }
        public string? taxt { get; set; }
        public string username { get; set; }
        public string fname { get; set; }
        public string lname { get; set; }
        public string imgeurl { get; set; }

    }
}
