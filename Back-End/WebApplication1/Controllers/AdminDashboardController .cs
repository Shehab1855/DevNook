
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Xml.Linq;
using WebApplication1.models;
using WebApplication1.models.dto;
using WebApplication1.Repository.Repository;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.Mime.MediaTypeNames;

namespace WebApplication1.Controllers
{
    //[Authorize(Roles="Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IpostRepository _postRepository;


        public AdminDashboardController(IpostRepository postRepository)
        {

            _postRepository = postRepository;


        }



        private async Task<Profiledto> GetuserResponse(ApplicationUser user)
        {
            
            var response = new Profiledto
                {
                    udi = user.Id, // No need to access Result as we await the task
                    fname = user.fname,
                    lname = user.lname,
                    UserName = user.UserName,
                      Email = user.Email,
                    imgeurl = user.imgeurl,
                     Birthdate=user.Birthdate ,
                    phone = user.PhoneNumber,
                     ginder = user.ginder,
                      BIO = user.BIO,
                 
                }; return response;
        }



        private async Task<POSTDTOR> MapToDTO(post post)
        {
            var postEvents = await _postRepository.GetAllTEntity<evnet>(e => e.PostId == post.Id);

            var user = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == post.userid);

            POSTDTOR dto = new POSTDTOR
            {
                Id = post.Id,
                username = user.UserName,
                fname = user.fname,
                lname = user.lname,
                contant = post.contant,
                userimage = user.imgeurl,
                postimage = post.url,
                CreatedDate = post.CreatedDate,
                totalcomment = postEvents.Count(e => e.typeEvent == "comment"),
                totaldislike = postEvents.Count(e => e.typeEvent == "dislike"),
                totalshare = postEvents.Count(e => e.typeEvent == "share"),
                totallike = postEvents.Count(e => e.typeEvent == "like"),
               
                share = post.share,
                userid = post.userid,
                OraginalPost = null
            };

            if (post.share)
            {
                var originalPost = await _postRepository.GetSpecialEntity<post>(e => e.Id == post.OraginalPostId);

                if (originalPost != null)
                {
                    var originalPostEvents = await _postRepository.GetAllTEntity<evnet>(e => e.PostId == originalPost.Id);

                    var originalUser = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == originalPost.userid);

                    POSTDTOR originalPostDTO = new POSTDTOR
                    {
                        Id = originalPost.Id,
                        username = originalUser.UserName,
                        fname = originalUser.fname,
                        lname = originalUser.lname,
                        userimage = originalUser.imgeurl,
                        postimage = originalPost.url,
                        contant = originalPost.contant,
                        CreatedDate = originalPost.CreatedDate,
                        totalcomment = originalPostEvents.Count(e => e.typeEvent == "comment"),
                        totaldislike = originalPostEvents.Count(e => e.typeEvent == "dislike"),
                        totalshare = originalPostEvents.Count(e => e.typeEvent == "share"),
                        totallike = originalPostEvents.Count(e => e.typeEvent == "like"),
                        share = originalPost.share,
                        userid = originalPost.userid,
                       
                        OraginalPost = null
                    };

                    dto.OraginalPost = originalPostDTO;
                }
            }

            return dto;
        }




        [HttpGet("GetTotal")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetTotal()
        {
            var totalUserTask = await _postRepository.GetAllTEntity<ApplicationUser>();

            var totalpostTask = await _postRepository.GetAllTEntity<post>();
            var totalpostEventTask = await _postRepository.GetAllTEntity<evnet>();

            var totalRecipeTask = await _postRepository.GetAllTEntity<Question>();
            var totalQuestionEvent = await _postRepository.GetAllTEntity<QuestionEvent>();
            
            var totalProjectEvent = await _postRepository.GetAllTEntity<ProjectEvent>();
            var totalProjects = await _postRepository.GetAllTEntity<Projects>();
            var totalpendingProjects = await _postRepository.GetAllTEntity<Projects>(e => e.Status == "pending");
            var totalapprovedProjects = await _postRepository.GetAllTEntity<Projects>(e => e.Status == "approved");


            var models = new
            {
                totalUser = totalUserTask != null ? totalUserTask.Count() : 0,
                totalPosts = totalpostTask != null ? totalpostTask.Count() : 0,
                totalEvents = totalpostEventTask != null ? totalpostEventTask.Count() : 0,
                totalRecipes = totalRecipeTask != null ? totalRecipeTask.Count() : 0,
                totalQuestionEvents = totalQuestionEvent != null ? totalQuestionEvent.Count() : 0,
                totalProjectEvents = totalProjectEvent != null ? totalProjectEvent.Count() : 0,
                totalProjects = totalProjects != null ? totalProjects.Count() : 0,
                totalPendingProjects = totalpendingProjects != null ? totalpendingProjects.Count() : 0,
                totalApprovedProjects = totalapprovedProjects != null ? totalapprovedProjects.Count() : 0
            };
            return Ok(models);
        }






        /****************************************************************/

        [HttpGet("GetAllpost")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<post>>> GetAllpost()
        {
            var posts = await _postRepository.GetAllTEntity<post>();


            var filteredPosts = new List<POSTDTOR>();

            foreach (var post in posts)
            {
                var dto = await MapToDTO(post);
                filteredPosts.Add(dto);
            }
            return Ok(filteredPosts);
        }



        [HttpGet("GetAllpostbyusername")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<post>>> GetAllpostbyusername( string username)
        {
            var user = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.UserName == username);
            if (user == null) NotFound("username not found");

            var posts = await _postRepository.GetAllTEntity<post>(e => e.userid == user.Id);

            if (posts == null) NotFound("no post for this username");
            var filteredPosts = new List<POSTDTOR>();

            foreach (var post in posts)
            {
                var dto = await MapToDTO(post);
                filteredPosts.Add(dto);
            }
            return Ok(filteredPosts);
        }
      
      


        [HttpGet("searchpost/string:contant ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> searchpost([FromQuery] string? contant = null)

        {

            var allposts = await _postRepository.GetAllTEntity<post>();
            if (allposts == null || allposts.Count == 0)
                return NotFound();

            var filterpost = allposts.Where(e =>
            (contant == null || e.contant?.Contains(contant, StringComparison.OrdinalIgnoreCase) == true)).ToList();
            
            if (filterpost.Count == 0)
                return NotFound();

            var filteredPosts = new List<POSTDTOR>();

            foreach (var post in filterpost)
            {
                var dto = await MapToDTO(post);
                filteredPosts.Add(dto);
            }
            return Ok(filteredPosts);


        }

        [HttpGet("GetSpecialpost/id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Get(int id)

        {
            if (id == null)
                return BadRequest();
            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null) return NotFound();
            var dto = await MapToDTO(post);
            return Ok(dto);


        }


        [HttpDelete("Deletepost/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(int id)


        {
            var post = await _postRepository.Get(e => e.Id == id);

          
            if (id == 0)
                return BadRequest();
            else
            {
                if (post == null) return NotFound();
                else await _postRepository.Remove(post);
            }
            await _postRepository.save();
            return Ok("post Deleted successfully");

        }

        /****************************************************************/



        /****************************************************************/

        [HttpGet("GetAlluser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<post>>> GetAlluser()
        {
            var users = await _postRepository.GetAllTEntity<ApplicationUser>();

            var userslist = new List<Profiledto>();

            foreach (var user in users)
            {
                var dto = await GetuserResponse(user);
                userslist.Add(dto);
            }

            return Ok(userslist);
        }


        [HttpGet("GetSpecialuser/string:id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> GetSpecialuser(string id)

        {
            var users = await _postRepository.GetAllTEntity<ApplicationUser>(e => e.Id == id);

            var userslist = new List<Profiledto>();

            foreach (var user in users)
            {
                var dto = await GetuserResponse(user);
                userslist.Add(dto);
            }
            return Ok(userslist);


        }

        
        [HttpDelete("Deleteuser/string id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Deleteuser(string id)

        {
            
            var User = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == id);

            if (id == null)
                return BadRequest();
            else
            {
                if (User == null) return NotFound();
                else await _postRepository.Remove<ApplicationUser>(User);
            }
            
            return Ok("user Deleted successfully");



        }

        /****************************************************************/

        [HttpGet("GetAllQuestion")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<Question>>> GetAllQuestion()
        {
            var Questions = await _postRepository.GetAllTEntity<Question>();

            return Ok(Questions);
        }


        [HttpGet("searchQuestion/string:contant ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Question>> searchQuestion([FromQuery] string? question = null)

        {

            var allQuestion = await _postRepository.GetAllTEntity<Question>();
            if (allQuestion == null || allQuestion.Count == 0)
                return NotFound();

            var filterQuestion = allQuestion.Where(e =>
            (question == null || e.question?.Contains(question, StringComparison.OrdinalIgnoreCase) == true)).ToList();

            if (filterQuestion.Count == 0)
                return NotFound();

           
            return Ok(filterQuestion);


        }

        [HttpGet("GetSpecialQuestion/id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> GetSpecialQuestion(int id)

        {
            if (id == null)
                return BadRequest();
            var Question = await _postRepository.GetAllTEntity<Question>(e => e.Id == id);

            if (Question == null) return NotFound();
           
            return Ok(Question);


        }


        [HttpDelete("DeleteQuestion/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteQuestion(int id)

            
        {
            
            var Question = await _postRepository.GetSpecialEntity<Question>(e => e.Id == id);

            
            if (id == 0)
                return BadRequest();
            else
            {
                if (Question == null) return NotFound();
                else await _postRepository.Remove<Question>(Question);
            }
            await _postRepository.save();
            return Ok("Question is deleted");

        }

        /****************************************************************/


        //[HttpGet("GetAllApprovedProjects")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //public async Task<ActionResult<List<Question>>> GetAllApprovedProjects()
        //{
        //    var Projects = await _postRepository.GetAllTEntity<Projects>(e=>e.status== "approved");
        //    if (Projects == null) NotFound("Projects not found ");
        //    return Ok(Projects);
        //}

        //[HttpGet("GetAllpendingProjects")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //public async Task<ActionResult<List<Question>>> GetAllpendingProjects()
        //{
        //    var Projects = await _postRepository.GetAllTEntity<Projects>(e => e.status == "pending");
        //    if (Projects == null) NotFound("Projects not found ");
        //    return Ok(Projects);
        //}
        
        
        
        
        [HttpDelete("DeleteProjects/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteProjects(int id)


        {

            var Projects = await _postRepository.GetSpecialEntity<Projects>(e => e.Id == id);


            if (id == 0)
                return BadRequest();
            else
            {
                if (Projects == null) return NotFound();
                else await _postRepository.Remove<Projects>(Projects);
            }
            await _postRepository.save();
            return Ok("Projects is deleted");

        }


        [HttpPut("AcceptProject/id:string ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> AcceptProject(int id)
        {

            var Projects = await _postRepository.GetSpecialEntity<Projects>((r => r.Id == id));
            if (Projects == null) return NotFound("Projects id NotFound");
            Projects.Status = "approved";
            await _postRepository.save();



            
            var user = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == Projects.UserId);

            var notification = new notification
            {
                userid = Projects.UserId,
                AnotheruserID = Projects.UserId,
                username = "",
                imgeurl = "",
                notificationsrelatedID = id,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "project",
                eventType = "approved"

            };
            await _postRepository.Addnotification(notification);
            return Ok("The project has  uploaded.");


        }




        [HttpDelete("RefuseProjects/int:id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> RefuseProjects(int  id)
        {


            var Projects = await _postRepository.GetSpecialEntity<Projects>((r => r.Id == id));
            if (Projects == null) return NotFound("Projects id NotFound");
            await _postRepository.Remove<Projects>(Projects);
            var user = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == Projects.UserId);

            var notification = new notification
            {
                userid = Projects.UserId,
                AnotheruserID = Projects.UserId,
                username = "",
                imgeurl = "",
                notificationsrelatedID = id,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "project",
                eventType = "Rejected"

            };
            await _postRepository.Addnotification(notification);
            return Ok("The project has  Rejected.");

        }




        [HttpGet("GetPendingProject")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetPendingProjects()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var opject = await _postRepository.GetAllTEntity<Projects>(e => e.Status == "Pending");

            if (opject == null)
                return NotFound();
            return Ok(opject);
        }

        [HttpGet("GetApprovedProjects")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetApprovedProjects()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var opject = await _postRepository.GetAllTEntity<Projects>(e=>e.Status== "Approved");
            if (opject == null)
                return NotFound();
            return Ok(opject);
        }


        [HttpGet("GetRejectedProjects")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetRejectedProjects()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var opject = await _postRepository.GetAllTEntity<Projects>(e => e.Status == "Rejected");

            if (opject == null)
                return NotFound();
            return Ok(opject);
        }








        /****************************************************************/

    }
}

