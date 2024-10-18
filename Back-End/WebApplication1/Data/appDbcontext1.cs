
using WebApplication1.models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using WebApplication1.Models;
using System;


namespace WebApplication1.Controllers
{
    public class appDbcontext1 : IdentityDbContext<ApplicationUser>
    {
        public appDbcontext1(DbContextOptions<appDbcontext1> options) : base(options)
        {

        }

        public DbSet<post> posts { get; set; }
       
        public DbSet<evnet> evnets { get; set; }
       
       
        public DbSet<Question> questions { get; set; }
        public DbSet<QuestionEvent> questionEvents { get; set; }
        public DbSet<Projects> projects { get; set; }
        public DbSet<ProjectEvent> projectEvents { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<blockuser> blockusers { get; set; }
        public DbSet<RequestsSent> RequestsSent { get; set; }
        public DbSet<notification> notifications { get; set; }
        public DbSet<Messages> Message { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Question>()
                .HasOne(e => e.appUser)
                .WithMany(d => d.Questions)
                .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Projects>()
                 .HasOne(e => e.AppUser)
                 .WithMany(d => d.Projects)
                 .HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<post>()
            .HasOne(p => p.user)
             .WithMany(u => u.posts)
             .HasForeignKey(p => p.userid)
             .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<evnet>()
                .HasOne(e => e.user)
                .WithMany(u => u.Evnets)
                .HasForeignKey(e => e.userid)
                .OnDelete(DeleteBehavior.Cascade);




            modelBuilder.Entity<Messages>()
                .HasOne(p => p.Sender)
                .WithMany(u => u.messageSender)
                .HasForeignKey(p => p.SenderId)
                .OnDelete(DeleteBehavior.Restrict); 
            modelBuilder.Entity<Messages>()
             .HasOne(p => p.Receiver)
             .WithMany(u => u.messageReceiver)
             .HasForeignKey(p => p.ReceiverId)
             .OnDelete(DeleteBehavior.Restrict);
           

            modelBuilder.Entity<blockuser>()
                .HasKey(r => new { r.ApplicationUser1Id, r.ApplicationUser2Id });
            modelBuilder.Entity<blockuser>()
                .HasOne(f => f.ApplicationUser)
                .WithMany(u => u.blockusers)
                .HasForeignKey(f => f.ApplicationUser1Id)
                .IsRequired();

            modelBuilder.Entity<Friendship>()
                .HasKey(r => new { r.ApplicationUser1Id, r.ApplicationUser2Id });
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.ApplicationUser)
                .WithMany(u => u.Friendships)
                .HasForeignKey(f => f.ApplicationUser1Id)
                .IsRequired();

            modelBuilder.Entity<RequestsSent>()
                .HasKey(r => new { r.SenderId, r.ReceiverId });
            modelBuilder.Entity<RequestsSent>()
                .HasOne(f => f.user)
                .WithMany(u => u.RequestsSent)
                .HasForeignKey(f => f.SenderId)
                .IsRequired();

            // Notification relationships
            modelBuilder.Entity<notification>()
                .HasOne(n => n.user)
                .WithMany(u => u.notifications)
                .HasForeignKey(n => n.userid)
                .OnDelete(DeleteBehavior.Cascade);

            



            // Change table names for Identity framework entities
            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        }
    }


}