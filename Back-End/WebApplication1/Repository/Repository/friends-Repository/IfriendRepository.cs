

using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using WebApplication1.models;
using WebApplication1.models.dto;

namespace WebApplication1.Repository.Repository
{
    public interface IfriendRepository : IRepository<Friendship>
    {
        
        Task SendFriendRequest(ApplicationUser userId1, ApplicationUser userId2);

        Task<IActionResult> unblock(ApplicationUser user, ApplicationUser friend);
         Task blockuser(ApplicationUser userId1, ApplicationUser userId2);

            Task Addfriend(ApplicationUser userId1, ApplicationUser userId2);

        Task<IActionResult> DeleteFriend(ApplicationUser user, ApplicationUser friend);

    }
}
