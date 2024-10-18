
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.models
{
    public class ProjectEvent
    {
        [Key]
        public int Id { get; set; }  
        public int projectId { get; set; }
        public string typeEvent { get; set; }
        public string userid { get; set; }
        public DateTime eventDate { get; set; }
        public string? text { get; set; }

    }
}
