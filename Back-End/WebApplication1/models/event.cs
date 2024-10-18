using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebApplication1.models
{
    public class evnet 
    {
        
        public int Id { get; set; }

        public int PostId { get; set; }
        public string typeEvent { get; set; }
        public string userid { get; set; }
        public string eventDate { get; set; }
        public string? taxt  { get; set; }

        [JsonIgnore] 
        public ApplicationUser user { get; set; }
        //public post post { get; set; }


    }
}
