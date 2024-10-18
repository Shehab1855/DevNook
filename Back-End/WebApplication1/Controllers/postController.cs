
using Azure;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;

using System.Security.Claims;

using WebApplication1.models;
using WebApplication1.models.dto;
using WebApplication1.Repository.Repository;

namespace WebApplication1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class postController : ControllerBase
    {
        private readonly IpostRepository _postRepository;


        public postController(IpostRepository postRepository)
        {

            _postRepository = postRepository;


        }

        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "";
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            filename = DateTime.Now.Ticks.ToString() + extension;

            // Define your desired path
            var filepath = @"C:\Users\aminm\OneDrive\Desktop\project\New folder\FinalONEfromMaiiii\public\Postimages";

            // Create the directory if it doesn't exist
            if (!Directory.Exists(filepath))
            {
                Directory.CreateDirectory(filepath);
            }

            // Combine the path with the filename
            var exactpath = Path.Combine(filepath, filename);

            // Save the file to the specified path
            using (var stream = new FileStream(exactpath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }


            return filename;
        }

        private async Task<evnet> AddEvents(int postid, string userid, string TypeEvent, string taxt)
        {
            if (TypeEvent != "comment")
            {
                var existingEvent = await _postRepository.GetSpecialEntity<evnet>(e => e.PostId == postid && e.typeEvent == TypeEvent && e.userid== userid);

                if (existingEvent != null)
                {
                    return null;
                }
            }


            var user = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userid);

            if (user == null)
            {
                return null;
            }
            var evnet = new evnet
            {
                PostId = postid,
                userid = userid,
                eventDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm tt"),
                taxt = taxt,
                typeEvent = TypeEvent
            };
            var post = await _postRepository.GetSpecialEntity<post>(e => e.Id == postid);
            var notification = new notification
            {
                userid = post.userid,
                AnotheruserID = userid,
                username = user.UserName,
                imgeurl = user.imgeurl,
                notificationsrelatedID = postid,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "post",
                eventType = TypeEvent

            };
            await _postRepository.Addnotification(notification);
            return evnet;
        }





        private async Task<POSTDTOR> MapToDTO(post post, string userIdToEvent)
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
                like = postEvents.Any(e => e.typeEvent == "like" && e.userid == userIdToEvent),
                dislike = postEvents.Any(e => e.typeEvent == "dislike" && e.userid == userIdToEvent),
                bookmark = postEvents.Any(e => e.typeEvent == "Bookmark" && e.userid == userIdToEvent),
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



       
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<post>>> Get()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            
            var posts = await _postRepository.GetAllTEntity<post>();


            var filteredPosts = new List<POSTDTOR>();

            foreach (var post in posts)
            {
                var dto = await MapToDTO(post, userIdClaim.Value);
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
                var dto = await MapToDTO(post, (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid").Value);
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
            var dto = await MapToDTO(post, (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid").Value);
            return Ok(dto);


        }
        [HttpGet("GetAllPostForAnotherUser /string:id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<post>>> GetpostforanutherUser(string id)
        {


            if (id == null)
            {
                return BadRequest("User ID is missing");
            }

            var posts = await _postRepository.GetAllTEntity<post>(e => e.userid == id);

            if (posts == null || !posts.Any())
            {
                return NotFound("No posts found for the user");
            }
            var filteredPosts = new List<POSTDTOR>();

            foreach (var post in posts)
            {
                var dto = await MapToDTO(post, (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid").Value);
                filteredPosts.Add(dto);
            }
            return Ok(filteredPosts);
        }




      
        [HttpGet("GetAllPostsForSameUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<POSTDTOR>>> GetAllPostsForSameUser()
        {

            var userIdClaim = HttpContext.User.Identity as ClaimsIdentity;
            var userId = userIdClaim?.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;


            var posts = await _postRepository.GetAllTEntity<post>(e => e.userid == userId);


            if (posts == null || !posts.Any())
            {
                return NotFound("No posts found for the user");
            }


            var filteredPosts = new List<POSTDTOR>();

            foreach (var post in posts)
            {
                var dto = await MapToDTO(post, (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid").Value);
                filteredPosts.Add(dto);
            }


            return Ok(filteredPosts);
        }




        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Creatpost(string contant, IFormFile? file)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            string result = null;
            if (file != null)
            {
                result = await WriteFile(file);
            }

            post model = new()
            {
                contant = contant,
                CreatedDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm tt"),
                userid = userId,

                url = result
            };


            await _postRepository.Create(model);
            await _postRepository.save();

            return Ok(model);
        }




        [HttpDelete("id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Delete(int id)


        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var post = await _postRepository.Get(e => e.Id == id);

            if (post.userid != userId) { return BadRequest(); }
            if (id == 0)
                return BadRequest();
            else
            {
                if (post == null) return NotFound();
                else await _postRepository.Remove(post);
            }
            await _postRepository.save();
            return NoContent();

        }


        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Update(int id, string post1, IFormFile? file)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim?.Value; // Note the null-conditional operator here

            if (string.IsNullOrEmpty(userId) || post1 == null)
            {
                return BadRequest();
            }

            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null || post.userid != userId)
            {
                return NotFound();
            }

            _postRepository.Detach(post); // Detach the entity

            string url2 = post.url;

            if (file != null)
            {
                url2 = await WriteFile(file);
                if (url2 == null)
                {
                    url2 = post.url;
                }
            }

            var model = new post
            {
                Id = post.Id,
                contant = post1,
                userid = userId,
                CreatedDate = post.CreatedDate,
                OraginalPostId = post.OraginalPostId,
                share = post.share,
                url = url2
            };

            await _postRepository.update(model);

            return Ok(model);
        }


        [HttpPost("like/id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> like(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null)
            {
                return NotFound();
            }
            var Event = await AddEvents(id, userId, "like", null);
            if (Event == null) { return BadRequest("this like has been added beforw"); }

            await _postRepository.AddEvent(Event);

            return Ok(Event);

        }




        [HttpPut("unlike/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<evnet>> unlike(int postid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var post = await _postRepository.Get(e => e.Id == postid);
            var existingLike = await _postRepository.GetSpecialEntity<evnet>(e => e.PostId == postid && e.userid == userId && e.typeEvent == "like");

            if (postid == 0 || userId == null)
                return BadRequest();
            else
            {
                if (existingLike == null) return NotFound();
                else
                    await _postRepository.Remove<evnet>(existingLike);
            }

            return NoContent();

        }


        [HttpGet("Getlikes/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Getliskss(int id)

        {
            if (id == null) return BadRequest();

            var likes = await _postRepository.GetAllTEntity<evnet>(e => e.typeEvent == "like" && e.PostId == id);
            if (likes == null) return NotFound();
            List<EventDto> EventDtolist = new List<EventDto>();
            foreach (var like in likes)
            {

                var respoens = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == like.userid);
                var model = new EventDto
                {
                    userid = respoens.Id,
                    postid = like.PostId,
                    eventid = like.Id,
                    typeEvent = "like",
                    eventDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm tt"),
                    fname = respoens.fname,
                    lname = respoens.lname,
                    imgeurl = respoens.imgeurl,
                    username = respoens.UserName

                };
                EventDtolist.Add(model);
            }

            return Ok(EventDtolist);


        }

        [HttpPost("dislike/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> dislike(int id)

        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null)
            {
                return NotFound(); // Post with the given id not found
            }
            var Event = await AddEvents(id, userId, "dislike", null);


            if (Event == null) { return BadRequest("this dislike has been added beforw"); }
            await _postRepository.AddEvent(Event);
            //post.totaldislike++;
            //await _postRepository.save();
            return Ok(Event);

        }




        [HttpPut("undislike/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> undislike(int postid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var post = await _postRepository.Get(e => e.Id == postid);
            var existingLike = await _postRepository.GetSpecialEntity<evnet>(e => e.PostId == postid && e.userid == userId && e.typeEvent == "DisLike");

            if (postid == 0 || userId == null)
                return BadRequest();
            else
            {
                if (existingLike == null) return NotFound();
                else
                    await _postRepository.Remove<evnet>(existingLike);
            }
            //post.totaldislike--;
            //await _postRepository.save();
            return Ok();

        }




        [HttpGet("Getdislikes/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<evnet>> Getdislikes(int id)

        {
            if (id == null) return BadRequest();

            var dislikes = await _postRepository.GetAllTEntity<evnet>(e => e.typeEvent == "dislike" && e.PostId == id);
            if (dislikes == null) return NotFound();
            List<EventDto> EventDtolist = new List<EventDto>();
            foreach (var dislike in dislikes)
            {

                var respoens = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == dislike.userid);
                var model = new EventDto
                {
                    eventid = dislike.Id,
                    userid = respoens.Id,
                    postid = dislike.PostId,

                    typeEvent = "dislike",
                    eventDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm tt"),
                    fname = respoens.fname,
                    lname = respoens.lname,
                    imgeurl = respoens.imgeurl,
                    username = respoens.UserName


                };
                EventDtolist.Add(model);
            }

            return Ok(EventDtolist);


        }




        [HttpPost("comment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> comment(int id, [FromBody] CommentDto CommentDto)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null)
            {
                return NoContent(); // Post with the given id not found
            }

            var Event = await AddEvents(id, userId, "comment", CommentDto.taxt);
            await _postRepository.AddEvent(Event);



            return Ok(Event);

        }




        [HttpDelete("comment/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<ActionResult<post>> Deletecomment(int eventid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var existingcomment = await _postRepository.GetSpecialEntity<evnet>(e => e.Id == eventid && e.userid == userId && e.typeEvent == "comment");

            if (eventid == 0)
                return BadRequest();
            else
            {
                if (existingcomment == null) return NotFound();
                else
                    await _postRepository.Remove<evnet>(existingcomment);
            }

            return Ok();

        }




        [HttpGet("Getcomment/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Getcomment(int id)
        {
            if (id == null) return BadRequest();

            var comments = await _postRepository.GetAllTEntity<evnet>(e => e.typeEvent == "comment" && e.PostId == id);
            if (comments == null) return NotFound();
            List<EventDto> EventDtolist = new List<EventDto>();
            foreach (var comment in comments)
            {

                var respoens = await _postRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == comment.userid);
                var model = new EventDto
                {
                    typeEvent = "comment",
                    postid = comment.PostId,
                    userid = respoens.Id,
                    eventid = comment.Id,
                    eventDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm tt"),
                    fname = respoens.fname,
                    lname = respoens.lname,
                    imgeurl = respoens.imgeurl,
                    username = respoens.UserName,
                    taxt = comment.taxt

                };
                EventDtolist.Add(model);
            }

            return Ok(EventDtolist);


        }




        [HttpPut("shere/id:int/post id  ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]


        public async Task<ActionResult<post>> shere(int id, [FromBody] postdto post1)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null)
            {
                return NotFound(); // Post with the given id not found
            }


            var Event = await AddEvents(id, userId, "share", null);
            await _postRepository.AddEvent(Event);



            if (Event == null) { return NotFound(); }



            post model = new()
            {
                contant = post1.contant,
                CreatedDate = DateTime.UtcNow.ToString("yyyy-MM-dd hh:mm tt"),
                userid = userId,

                OraginalPostId = id,
                share = true,


            };

            await _postRepository.Create(model);



            return NoContent();

        }



        [HttpPost("UploadFile")]

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            var result = await WriteFile(file);

            return Ok(result);
        }









        [HttpPost("Bookmark/id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Bookmark(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null)
            {
                return NotFound();
            }
            var Event = await AddEvents(id, userId, "Bookmark", null);
            if (Event == null) { return BadRequest("this Bookmark has been added beforw"); }

            await _postRepository.AddEvent(Event);

            return Ok(Event);

        }




        [HttpPut("unBookmark/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<evnet>> unBookmark(int postid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var post = await _postRepository.Get(e => e.Id == postid);
            var existingLike = await _postRepository.GetSpecialEntity<evnet>(e => e.PostId == postid && e.userid == userId && e.typeEvent == "Bookmark");

            if (postid == 0 || userId == null)
                return BadRequest();
            else
            {
                if (existingLike == null) return NotFound();
                else
                    await _postRepository.Remove<evnet>(existingLike);
            }

            return Ok();

        }


        [HttpGet("GetBookmark")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> GetBookmark()

        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;


            var Bookmarkposts = await _postRepository.GetAllTEntity<evnet>(e => e.typeEvent == "Bookmark" && e.userid == userId);
            if (Bookmarkposts == null) return NotFound();



            var filteredPosts = new List<POSTDTOR>();
            foreach (var Bookmark in Bookmarkposts)
            {

                var respoens = await _postRepository.GetSpecialEntity<post>(e => e.Id == Bookmark.PostId);
                var dto = await MapToDTO(respoens, (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid").Value);
                filteredPosts.Add(dto);
            }

            return Ok(filteredPosts);


        }




        [HttpPost("report/id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> report(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var post = await _postRepository.Get(e => e.Id == id);

            if (post == null)
            {
                return NotFound();
            }
            var Event = await AddEvents(id, userId, "report", null);

            if (Event == null) { return BadRequest("this report has been added beforw"); }

            await _postRepository.AddEvent(Event);

            var totallreport = await _postRepository.GetAllTEntity<evnet>(e => e.PostId == post.Id && e.typeEvent == "report");
            var totallike = await _postRepository.GetAllTEntity<evnet>(e => e.PostId == post.Id && e.typeEvent == "like");
            if ((totallreport.Count >= (totallike.Count) * 2) && totallreport.Count >= 10) { await _postRepository.Remove(post); }

            return Ok("this report has been added ");


        }














    }



}

