namespace WebApplication1.models.dto
{
    public class POSTDTOR
    {


        public int Id { get; set; }
        public string userid { get; set; }
        public string username { get; set; }
        public string fname { get; set; }
        public string lname { get; set; }
         public string postimage { get; set; }
         public string userimage { get; set; }

        public string contant { get; set; }

        public string CreatedDate { get; set; }

        public long totallike { get; set; }
        public long totaldislike { get; set; }
        public long totalcomment { get; set; }
        public long totalshare { get; set; }
        public Boolean share { get; set; } = false;
        public Boolean? isfrind { get; set; } = true;
        public Boolean? like { get; set; } = false;
        public Boolean? dislike { get; set; } = false;
        public Boolean? bookmark { get; set; } = false;
        public long OraginalPostId { get; set; }
        public POSTDTOR OraginalPost { get; set; }
    }
}
