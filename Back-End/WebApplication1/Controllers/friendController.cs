using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Text.Json;
using WebApplication1.models;
using WebApplication1.models.dto;
using WebApplication1.Repository.Repository;
using System.Runtime.Intrinsics.X86;


namespace WebApplication1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class friendController : ControllerBase
    {
        private readonly IfriendRepository _friendRepository;

        public friendController(IfriendRepository friendRepository)
        {
            _friendRepository = friendRepository;
        }














        private async Task<List<info>> GetFriendsResponse(HashSet<string> friendsID, string userid)
        {
            List<info> friendsinfo = new List<info>();
            foreach (var uid in friendsID)
            {
                var friendinfo = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == uid);

                var mutualFriendsCount = await MutualFriends(uid, userid); // Call method properly with parameters

                var response = new info
                {
                    udi = friendinfo.Id, // No need to access Result as we await the task
                    fname = friendinfo.fname,
                    imgeurl = friendinfo.imgeurl,
                    lname = friendinfo.lname,
                    username = friendinfo.UserName,
                    MutualFriends = mutualFriendsCount.Count
                };

                friendsinfo.Add(response);
            }
            return friendsinfo;
        }

        private async Task<HashSet<string>> MutualFriends(string person1id, string person2id)
        {
            var friend1 = await _friendRepository.GetUserFriends(await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == person1id));
            var friend2 = await _friendRepository.GetUserFriends(await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == person2id));

            return friend1.Intersect(friend2).ToHashSet();
        }


        [HttpGet("check-status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> CheckStatus(string user2Id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var user1Id = userIdClaim?.Value;

            if (user2Id == user1Id)
                return BadRequest("Two user IDs are the same.");

            var user1 = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == user1Id);
            var user2 = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == user2Id);

            var user1FriendList = await _friendRepository.GetUserFriends(user1);
            var user2FriendList = await _friendRepository.GetUserFriends(user2);

            var user1BlockList = await _friendRepository.GetUserblock(user1);
            var user2BlockList = await _friendRepository.GetUserblock(user2);

            string statusMessage;

            switch (true)
            {


                case bool _ when user1BlockList.Contains(user2Id):
                    statusMessage = "You blocked this user.";
                    break;

                case bool _ when user2BlockList.Contains(user1Id):
                    statusMessage = "This user blocked you.";
                    break;


                case bool _ when (await _friendRepository.GetAllTEntity<RequestsSent>(e => e.SenderId == user1Id && e.ReceiverId == user2Id))?.Any() == true:
                    statusMessage = user2.IsPrivate ? "You sent a request to this user, and their account is private." : "You sent a request to this user, and their account is public.";
                    break;

                case bool _ when (await _friendRepository.GetAllTEntity<RequestsSent>(e => e.SenderId == user2Id && e.ReceiverId == user1Id))?.Any() == true:
                    statusMessage = user2.IsPrivate ? "You received a request from this user, and their account is private." : "You received a request from this user, and their account is public.";
                    break;
                case bool _ when user1FriendList.Contains(user2Id) || user2FriendList.Contains(user1Id):
                    statusMessage = "Friends.";
                    break;

                default:
                    statusMessage = user2.IsPrivate ? "This user's account is private." : "This user's account is public.";
                    break;
            }

            return Ok(statusMessage);
        }

        










        [HttpPost("sendRequest/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> SendRequest(string receiverID)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var SenderID = userIdClaim.Value;

            if (SenderID == receiverID)
            {
                return BadRequest("SenderID and receiverID are same  ");
            }


            var Sender = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == SenderID);
            var receiver = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == receiverID);
            if (Sender == null || receiver == null) return NotFound();


            var existingRequest = await _friendRepository.GetSpecialEntity<RequestsSent>((r => (r.SenderId == SenderID && r.ReceiverId == receiverID) || (r.SenderId == receiverID && r.ReceiverId == SenderID)));
            if (existingRequest != null) return BadRequest("Friend request already sent");



            await _friendRepository.SendFriendRequest(Sender, receiver);


            

            var notification = new notification
            {
                userid = receiver.Id,
                AnotheruserID = Sender.Id,
                username = Sender.UserName,
                imgeurl = Sender.imgeurl,
                notificationsrelatedID = 0,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "Request",
                eventType = "received"

            };
            await _friendRepository.Addnotification(notification);

            return Ok("ok");

        }




        [HttpPut("AcceptRequest/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> AcceptRequest(string SenderID)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var receiverID = userIdClaim.Value;



            var Request = await _friendRepository.GetSpecialEntity<RequestsSent>((r => (r.SenderId == SenderID && r.ReceiverId == receiverID) || (r.SenderId == receiverID && r.ReceiverId == SenderID)));
            if (Request == null) return NotFound("Request id NotFound");
            await _friendRepository.Remove<RequestsSent>(Request);

            var Sender = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == SenderID);
            var receiver = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == receiverID);
            if (Sender == null || receiver == null) return NotFound("Sender id NotFound");

            await _friendRepository.Addfriend(Sender, receiver);
            
            var notification = new notification
            {
                userid = Sender.Id,
                AnotheruserID = receiver.Id,
                username = receiver.UserName,
                imgeurl = receiver.imgeurl,
                notificationsrelatedID = 0,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "Request",
                eventType = " Accept"

            };
            await _friendRepository.Addnotification(notification);

            return Ok();

        }




        [HttpDelete("RefuseRequest/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> RefuseRequest(string SenderID)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var receiverID = userIdClaim.Value;
            var receiver = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == receiverID);

            var Request = await _friendRepository.GetSpecialEntity<RequestsSent>((r => (r.SenderId == SenderID && r.ReceiverId == receiverID) || (r.SenderId == receiverID && r.ReceiverId == SenderID)));
            if (Request == null) return NotFound("Request id NotFound");
            await _friendRepository.Remove<RequestsSent>(Request);
            var notification = new notification
            {
                userid = SenderID,
                AnotheruserID = receiverID,
                username = receiver.UserName,
                imgeurl = receiver.imgeurl,
                notificationsrelatedID = 0,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "Request",
                eventType = " Refuse"

            };
            await _friendRepository.Addnotification(notification);
            return Ok();

        }






        [HttpDelete("unfriend/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> unfriend(string SenderID)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var receiverID = userIdClaim.Value;

            var friendshipToDelete1 = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => (e.Id == SenderID));
            var friendshipToDelete2 = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => (e.Id == receiverID));


            await _friendRepository.DeleteFriend(friendshipToDelete1, friendshipToDelete2);
            return Ok();

        }






        [HttpDelete("unRequest/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> unRequest(string SenderID)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var receiverID = userIdClaim.Value;

            var Request = await _friendRepository.GetSpecialEntity<RequestsSent>((r => (r.SenderId == SenderID && r.ReceiverId == receiverID) || (r.SenderId == receiverID && r.ReceiverId == SenderID)));
            if (Request == null) return NotFound("Request id NotFound");
            await _friendRepository.Remove<RequestsSent>(Request);

            return Ok();

        }





        [HttpGet("GetAllRequestAreSend")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<info>> GetAllRequestSend()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userid = userIdClaim?.Value;

            var Requests = await _friendRepository.GetAllTEntity<RequestsSent>(e => e.SenderId == userid);


            if (Request == null)
            {
                return NotFound("No request");
            }

            HashSet<string> uniqueSenderIDs = new HashSet<string>();

            foreach (var request in Requests)
            {
                uniqueSenderIDs.Add(request.ReceiverId);
            }

            return Ok(await GetFriendsResponse(uniqueSenderIDs, userid));
        }











        [HttpGet("GetAllRequestAreReceive")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<info>> GetAllRequestReceived()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userid = userIdClaim?.Value;

            var Requests = await _friendRepository.GetAllTEntity<RequestsSent>(e => e.ReceiverId == userid);


            if (Request == null)
            {
                return NotFound("No request");
            }

            HashSet<string> uniqueSenderIDs = new HashSet<string>();

            foreach (var request in Requests)
            {
                uniqueSenderIDs.Add(request.SenderId);
            }

            return Ok(await GetFriendsResponse(uniqueSenderIDs, userid));

        }






        [HttpGet("GetAllFriends")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<info>> GetAllFriends()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userid = userIdClaim?.Value;

            var user = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userid);

            var friends = await _friendRepository.GetUserFriends(user);



            return Ok(await GetFriendsResponse(friends, userid));


        }


        [HttpGet("GetAllFriends /string:id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<info>> GetAllFriendsforanyuser(string userid)
        {

            var user = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userid);

            var friends = await _friendRepository.GetUserFriends(user);



            return Ok(await GetFriendsResponse(friends, userid));


        }


        [HttpGet("GetMutualFriends/id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<info>> GetAllMutualFriends(string id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userid = userIdClaim?.Value;
            return Ok(await GetFriendsResponse(await MutualFriends(id, userid), userid));


        }






        [HttpGet("GetNumberMutualFriends/id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<int>> GetNumberMutualFriends(string id)

        {

            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userid = userIdClaim?.Value;


            var num = await MutualFriends(id, userid);

            return Ok(num.Count);
        }








        [HttpPut("blockuser/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> blockuser(string yourid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var myid = userIdClaim.Value;




            var my = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == myid);
            var you = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == yourid);


            var user1FriendList = await _friendRepository.GetUserFriends(my);
            var user2FriendList = await _friendRepository.GetUserFriends(you);
            if (user1FriendList.Contains(yourid) || user2FriendList.Contains(myid))
                await _friendRepository.DeleteFriend(my, you);



            var Request = await _friendRepository.GetSpecialEntity<RequestsSent>((r => (r.SenderId == myid && r.ReceiverId == yourid) || (r.SenderId == yourid && r.ReceiverId == myid)));
            if (Request != null)
                await _friendRepository.Remove<RequestsSent>(Request);


            var friend1 = await _friendRepository.GetUserblock(my);

            var friend2 = await _friendRepository.GetUserblock(you);

            if (friend1.Contains(yourid) || friend2.Contains(myid)) return Ok("Already blocked. ");

            if (my == null || you == null) return NotFound("user id NotFound");

            await _friendRepository.blockuser(my, you);

            return Ok();

        }



        [HttpDelete("unblock/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> unblock(string yourid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var myid = userIdClaim.Value;


            var my = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == myid);
            var you = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == yourid);

            if (my == null || you == null) return NotFound("user id NotFound");

            var block = await _friendRepository.unblock(my, you);
            if (block == null) return NotFound();
            return Ok();

        }


        [HttpGet("GetAllblock")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<info>> GetAllblock()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userid = userIdClaim?.Value;

            var user = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userid);

            var friends = await _friendRepository.GetUserblock(user);



            return Ok(await GetFriendsResponse(friends, userid));


        }

    }
}
