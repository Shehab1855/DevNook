
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.models
{
    public class post
    {
        public int Id { get; set; }
        public string contant { get; set; }
        public string CreatedDate { get; set; }
        public string userid { get; set; }
        public string? url { get; set; }
      
        public Boolean share { get; set; } = false;
        public long OraginalPostId  { get; set; }
        public ApplicationUser user { get; set; }
        

      // public ICollection<evnet> Evnets { get; set; }


    }


}
