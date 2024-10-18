
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using WebApplication1.Controllers;

using WebApplication1.models;
using WebApplication1.models.dto;

namespace WebApplication1.Repository.Repository
{


    public class friendRepository : Repositoryg<Friendship>, IfriendRepository
    {
        private readonly appDbcontext1 _db;
        private readonly UserManager<WebApplication1.models.ApplicationUser> _userManager;
        public friendRepository(appDbcontext1 db, UserManager<ApplicationUser> userManager) : base(db)
        {
            _db = db;
            _userManager = userManager;
        }




        public async Task SendFriendRequest(ApplicationUser userId1, ApplicationUser userId2)
        {
            userId1.RequestsSent ??= new List<RequestsSent>();

            userId1.RequestsSent.Add(new RequestsSent { SenderId = userId1.Id, ReceiverId = userId2.Id });
            await save();

        }


        public async Task<IActionResult> DeleteFriend(ApplicationUser user, ApplicationUser friend)
        {

            // Find the friendship to delete
            var friendshipToDelete1 = _db.Friendships.FirstOrDefault(f => f.ApplicationUser1Id == friend.Id || f.ApplicationUser2Id == friend.Id);
            var friendshipToDelete2 = _db.Friendships.FirstOrDefault(f => f.ApplicationUser1Id == user.Id || f.ApplicationUser2Id == user.Id);

            if (friendshipToDelete1 == null || friendshipToDelete2 == null)
            {
                return null;
            }


            _db.Friendships.Remove(friendshipToDelete1);
            _db.Friendships.Remove(friendshipToDelete2);

            await save();

            return new OkResult(); ;
        }
       
        public async Task<IActionResult> unblock(ApplicationUser user, ApplicationUser friend)
        {
            // Ensure user.blockusers is initialized
            user.blockusers ??= new List<blockuser>();
            
            var Userblock =  _db.blockusers.FirstOrDefault(f => (f.ApplicationUser1Id == user.Id && f.ApplicationUser2Id == friend.Id));

            //// Find the friendship to delete
            //var friendshipToDelete1 = user.blockusers.FirstOrDefault(f => f.ApplicationUser1Id == friend.Id);

            if (Userblock == null)
            {
                return null;
            }

            _db.blockusers.Remove(Userblock);

            await save();

            return new OkResult();
        }

        public async Task Addfriend(ApplicationUser userId1, ApplicationUser userId2)
        {
            userId1.Friendships ??= new List<Friendship>();
            userId2.Friendships ??= new List<Friendship>();

            userId1.Friendships.Add(new Friendship { ApplicationUser1Id = userId1.Id, ApplicationUser2Id = userId2.Id });
            userId2.Friendships.Add(new Friendship { ApplicationUser1Id = userId2.Id, ApplicationUser2Id = userId1.Id });

            await save();

        }

        public async Task blockuser(ApplicationUser userId1, ApplicationUser userId2)
        {
            userId1.blockusers ??= new List<blockuser>();


            userId1.blockusers.Add(new blockuser { ApplicationUser1Id = userId1.Id, ApplicationUser2Id = userId2.Id });
            

            await save();

        }


        
    }
}


