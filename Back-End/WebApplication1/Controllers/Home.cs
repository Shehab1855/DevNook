using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using WebApplication1.models.dto;
using WebApplication1.models;
using WebApplication1.Repository.Repository;


namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class HomeController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ImangeprofileRepository _profileRepository;
        private readonly IfriendRepository _friendRepository;
        public HomeController(ImangeprofileRepository profileRepository, IfriendRepository friendRepository)
        {
            _friendRepository = friendRepository;
            _profileRepository = profileRepository;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new System.Uri("http://localhost:5000/");
            _friendRepository = friendRepository;
        }


        private async Task<POSTDTOR> MapToDTO(post post, string userIdToEvent)
        {
            var postEvents = await _profileRepository.GetAllTEntity<evnet>(e => e.PostId == post.Id);

            var user = await _profileRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == post.userid);

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
                like = postEvents.Any(e => e.typeEvent == "like" && e.userid == userIdToEvent),
                dislike = postEvents.Any(e => e.typeEvent == "dislike" && e.userid == userIdToEvent),
                bookmark = postEvents.Any(e => e.typeEvent == "Bookmark" && e.userid == userIdToEvent),
                share = post.share,
                userid = post.userid,
                OraginalPost = null
            };

            if (post.share)
            {
                var originalPost = await _profileRepository.GetSpecialEntity<post>(e => e.Id == post.OraginalPostId);

                if (originalPost != null)
                {
                    var originalPostEvents = await _profileRepository.GetAllTEntity<evnet>(e => e.PostId == originalPost.Id);

                    var originalUser = await _profileRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == originalPost.userid);

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
                        like = postEvents.Any(e => e.typeEvent == "like" && e.userid == userIdToEvent),
                        dislike = postEvents.Any(e => e.typeEvent == "dislike" && e.userid == userIdToEvent),
                        bookmark = postEvents.Any(e => e.typeEvent == "Bookmark" && e.userid == userIdToEvent),
                        OraginalPost = null
                    };

                    dto.OraginalPost = originalPostDTO;
                }
            }

            return dto;
        }


        private async Task<ProjectDto> GetProjects(Projects Project)
        {

            var response = new ProjectDto
            {
                Id = Project.Id,
                FilePath = Project.FileName,
                Brief = Project.Brief,
                CreatedDate = Project.CreatedDate,
                FileName = Project.FileName,
                totallike = Project.totallike,
                totaldislike = Project.totaldislike,
                totalcomment = Project.totaldislike,
                UserId = Project.UserId,
                UserName = Project.UserName


            };
            return response;
        }


        private async Task<QuestionDTO> GetQuestion(Question Question)
        {

            var response = new QuestionDTO
            {

                Id = Question.Id,
                question = Question.question,
                CreatedDate = Question.CreatedDate,
                TotalLike = Question.TotalLike,
                TotalComment = Question.TotalComment,
                UserName = Question.UserName,
                UserId = Question.UserId,


            };
            return response;
        }





        [HttpGet("recommendationsPost")]
        public async Task<ActionResult<IEnumerable<string>>> recommendationsPost()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim?.Value;
            HashSet<int> PostIDs = new HashSet<int>();

            HttpResponseMessage response = await _httpClient.GetAsync($"/recommend/post?user_id={userId}");

            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                var numbers = JArray.Parse(responseBody).Select(token => (int)token).ToList();
                foreach (var number in numbers)
                {
                    PostIDs.Add(number);
                }
            }

            var user = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);
            var friends = await _friendRepository.GetUserFriends(user);
            var userblock = await _friendRepository.GetUserblock(user);
            if (friends != null)
            {
                foreach (var friend in friends)
                {
                    var postsFriend = await _friendRepository.GetAllTEntity<post>(e => e.userid == friend);
                    foreach (var post in postsFriend)
                    {
                        PostIDs.Add(post.Id);
                    }
                }
            }

            var filteredPosts = new List<POSTDTOR>();

            foreach (var PostID in PostIDs)
            {
                var posts = await _friendRepository.GetAllTEntity<post>(e => e.Id == PostID);
                foreach (var post in posts)
                {
                    var dto = await MapToDTO(post, (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid").Value);

                    if (!friends.Contains(post.userid))
                    {
                        dto.isfrind = false;
                    }

                    if (!userblock.Contains(post.userid) && post.userid != userId)
                    {
                        filteredPosts.Add(dto);
                    }
                }
            }

            // Sort the filteredPosts by date
            filteredPosts = filteredPosts.OrderBy(p => p.CreatedDate).ToList();
            if (filteredPosts.Count < 20)
            {

                var newestPost = await _friendRepository.GetAllTEntity<post>();
               var newestPosts = newestPost.OrderByDescending(p => p.CreatedDate).Take(20 - filteredPosts.Count).ToList();

                foreach (var randomPost in newestPosts)
                {
                    var dto = await MapToDTO(randomPost, (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid").Value);
                    if (!friends.Contains(randomPost.userid))
                    {
                        dto.isfrind = false;
                    }
                    if (!userblock.Contains(randomPost.userid) && randomPost.userid != userId)
                    {
                        filteredPosts.Add(dto);
                    }

                   
                }
            }
            return Ok(filteredPosts);
        }









        [HttpGet("recommendationsProjects")]
        public async Task<ActionResult<IEnumerable<string>>> recommendationsProjects()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim?.Value;
            HashSet<int> PostIDs = new HashSet<int>();

            HttpResponseMessage response = await _httpClient.GetAsync($"/recommend/PROJECT?user_id={userId}");

            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                var numbers = JArray.Parse(responseBody).Select(token => (int)token).ToList();
                foreach (var number in numbers)
                {
                    PostIDs.Add(number);
                }
            }

            var user = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);
            var friends = await _friendRepository.GetUserFriends(user);
            var userblock = await _friendRepository.GetUserblock(user);
            if (friends != null)
            {
                foreach (var friend in friends)
                {
                    var postsFriend = await _friendRepository.GetAllTEntity<Projects>(e => e.UserId == friend);
                    foreach (var post in postsFriend)
                    {
                        PostIDs.Add(post.Id);
                    }
                }
            }

            var filteredPosts = new List<ProjectDto>();

            foreach (var PostID in PostIDs)
            {
                var posts = await _friendRepository.GetAllTEntity<Projects>(e => e.Id == PostID);
                foreach (var post in posts)
                {
                    var dto = await GetProjects(post);

                    if (!friends.Contains(post.UserId))
                    {
                        dto.isfrind = false;
                    }

                    if (!userblock.Contains(post.UserId)&& post.UserId != userId)
                    {
                        filteredPosts.Add(dto);
                    }
                }
            }

            // Sort the filteredPosts by date
            filteredPosts = filteredPosts.OrderBy(p => p.CreatedDate).ToList();
            if (filteredPosts.Count < 20)
            {

                var newestPost = await _friendRepository.GetAllTEntity<Projects>();
                var newestPosts = newestPost.OrderByDescending(p => p.CreatedDate).Take(20 - filteredPosts.Count).ToList();

                foreach (var randomPost in newestPosts)
                {
                    var dto = await GetProjects(randomPost);


                    if (!friends.Contains(randomPost.UserId))
                    {
                        dto.isfrind = false;
                    }
                    if (!userblock.Contains(randomPost.UserId) && randomPost.UserId != userId)
                    {
                        filteredPosts.Add(dto);
                    }

                   
                }
            }

            return Ok(filteredPosts);
        }




        [HttpGet("recommendationsQuestion")]
        public async Task<ActionResult<IEnumerable<string>>> recommendationsQuestion()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim?.Value;
            HashSet<int> PostIDs = new HashSet<int>();

            HttpResponseMessage response = await _httpClient.GetAsync($"/recommend/QUESTION?user_id={userId}");

            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();
                var numbers = JArray.Parse(responseBody).Select(token => (int)token).ToList();
                foreach (var number in numbers)
                {
                    PostIDs.Add(number);
                }
            }

            var user = await _friendRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);
            var friends = await _friendRepository.GetUserFriends(user);
            var userblock = await _friendRepository.GetUserblock(user);
            if (friends != null)
            {
                foreach (var friend in friends)
                {
                    var postsFriend = await _friendRepository.GetAllTEntity<Question>(e => e.UserId == friend);
                    foreach (var post in postsFriend)
                    {
                        PostIDs.Add(post.Id);
                    }
                }
            }

            var filteredPosts = new List<QuestionDTO>();

            foreach (var PostID in PostIDs)
            {
                var posts = await _friendRepository.GetAllTEntity<Question>(e => e.Id == PostID);
                foreach (var post in posts)
                {
                    var dto = await GetQuestion(post);

                    if (!friends.Contains(post.UserId))
                    {
                        dto.isfrind = false;
                    }

                    if (!userblock.Contains(post.UserId) && post.UserId != userId)
                    {
                        filteredPosts.Add(dto);
                    }
                }
            }

            // Sort the filteredPosts by date
            filteredPosts = filteredPosts.OrderBy(p => p.CreatedDate).ToList();
            if (filteredPosts.Count < 20)
            {

                var newestPost = await _friendRepository.GetAllTEntity<Question>();
                var newestPosts = newestPost.OrderByDescending(p => p.CreatedDate).Take(20 - filteredPosts.Count).ToList();

                foreach (var randomPost in newestPosts)
                {
                    var dto = await GetQuestion(randomPost);
                    if (!friends.Contains(randomPost.UserId))
                    {
                        dto.isfrind = false;
                    }
                    if (!userblock.Contains(randomPost.UserId) && randomPost.UserId != userId)
                    {
                        filteredPosts.Add(dto);
                    }
                }
            }

            return Ok(filteredPosts);
        }









    }
}