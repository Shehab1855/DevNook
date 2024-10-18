
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System.Runtime.Intrinsics.X86;
using System.Security.Claims;
using WebApplication1.models;
using WebApplication1.models.dto;
using WebApplication1.Repository.Repository;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class profileController : ControllerBase
    {


        private readonly ImangeprofileRepository _profileRepository;
        private readonly IfriendRepository _friendRepository;
        public profileController(ImangeprofileRepository profileRepository, IfriendRepository friendRepository)
        {

            _profileRepository = profileRepository;

            _friendRepository = friendRepository;
        }

        private async Task<Profiledto> GetuserResponse(ApplicationUser user)
        {

            var response = new Profiledto
            {
                udi = user.Id,
                fname = user.fname,
                lname = user.lname,
                UserName = user.UserName,
                Email = user.Email,
                imgeurl = user.imgeurl,
                Birthdate = user.Birthdate,
                phone = user.PhoneNumber,
                ginder = user.ginder,
                BIO = user.BIO,

            }; return response;
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


        private async Task<Question> GetQuestion(Question Question)
        {

            var response = new Question
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






        private async Task<POSTDTOR> MapToDTO(post post)
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
                     
                        OraginalPost = null
                    };

                    dto.OraginalPost = originalPostDTO;
                }
            }

            return dto;
        }




        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "";
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            filename = DateTime.Now.Ticks.ToString() + extension;

            // Define your desired path
            var filepath = @"C:\Users\aminm\OneDrive\Desktop\project\New folder\FinalONEfromMaiiii\public\imgs";


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

        private async Task<string> cv(IFormFile file)
        {
            string filename = "";
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            filename = DateTime.Now.Ticks.ToString() + extension;

            // Define your desired path
            var filepath = @"C:\Users\aminm\OneDrive\Desktop\project\New folder\FinalONEfromMaiiii\public\cv";


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




        [HttpGet("search/string:text ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> searchuser([FromQuery] string? text = null)

        {
            List<ApplicationUser> allusers = await _profileRepository.GetAllTEntity<ApplicationUser>();
            List<post> allpost = await _profileRepository.GetAllTEntity<post>();
            List<Question> allQuestion = await _profileRepository.GetAllTEntity<Question>();
            List<Projects> allProjects = await _profileRepository.GetAllTEntity<Projects>(e => e.Status == "Approved");



            if ((allusers.Count == 0 && allpost.Count == 0 && allQuestion.Count == 0 && allProjects.Count == 0))
                return NotFound();

            var filteruser = allusers.Where(e =>
            (text == null || e.UserName?.Contains(text, StringComparison.OrdinalIgnoreCase) == true)).ToList();

            var filterpost = allpost.Where(e =>
           (text == null || e.contant?.Contains(text, StringComparison.OrdinalIgnoreCase) == true)).ToList();

            var filterQuestion = allQuestion.Where(e =>
           (text == null || e.question?.Contains(text, StringComparison.OrdinalIgnoreCase) == true)).ToList();

            var filterProjects = allProjects.Where(e =>
           (text == null || e.Brief?.Contains(text, StringComparison.OrdinalIgnoreCase) == true)).ToList();




            if ((filteruser.Count == 0 && filterpost.Count == 0 && filterQuestion.Count == 0 && filterProjects.Count == 0))
                return NotFound();



            var filteredPosts = new List<POSTDTOR>();

            foreach (var post in filterpost)
            {
                var dto = await MapToDTO(post);
                filteredPosts.Add(dto);
            }
            var userslist = new List<Profiledto>();

            foreach (var user in filteruser)
            {
                var dto = await GetuserResponse(user);
                userslist.Add(dto);
            }
            var projectlist = new List<ProjectDto>();

            foreach (var Project in filterProjects)
            {
                var dto = await GetProjects(Project);
                projectlist.Add(dto);
            }
            var Questionlist = new List<Question>();

            foreach (var Question in filterQuestion)
            {
                var dto = await GetQuestion(Question);
                Questionlist.Add(dto);
            }


            var model = new
            {
                filteredPost = filteredPosts,
                filtereduser = userslist,
                filterQuestion = Questionlist,
                filterProject = projectlist,

            };

            return Ok(model);


        }


        [HttpGet("getUser/string:userId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]


        public async Task<ActionResult<ApplicationUser>> getUser(string userId)

        {

            if (userId == null)
                return BadRequest();
            var User = await _profileRepository.Get(e => e.Id == userId);



            {
                if (User == null) return NotFound();

                else
                {
                    return Ok(User);
                }
            }

        }















        [HttpGet("getUserLogin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]


        public async Task<ActionResult<ApplicationUser>> Getuserlogin()

        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            if (userId == null)
                return BadRequest();
            var User = await _profileRepository.Get(e => e.Id == userId);



            {
                if (User == null) return NotFound();

                else
                {
                    return Ok(User);
                }
            }

        }


        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> Delete()

        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            var User = await _profileRepository.Get(e => e.Id == id);

            if (id == null)
                return BadRequest();
            else
            {
                if (User == null) return NotFound();
                else await _profileRepository.Remove(User);
            }
            await _profileRepository.save();
            return NoContent();



        }





        [HttpPut("updatedProfile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApplicationUser>> UpdateUserProfile(UpdateProfileDto updatedProfile)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            var existingUser = await _profileRepository.Get(e => e.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }

            var existingUsername = await _profileRepository.Get(e => e.UserName == updatedProfile.UserName);
            if (existingUsername != null && existingUsername.Id != existingUser.Id)
            {

                return BadRequest("Username is already taken");
            }

            var existingEmail = await _profileRepository.Get(e => e.Email == updatedProfile.Email);
            if (existingEmail != null && existingEmail.Id != existingUser.Id)
            {

                return BadRequest("Email is already taken");
            }
            // Check if any field is updated
            if (existingUser.fname == updatedProfile.fname &&
                 existingUser.lname == updatedProfile.lname &&
                 existingUser.UserName == updatedProfile.UserName &&
                 existingUser.Email == updatedProfile.Email &&
                 existingUser.BIO == updatedProfile.BIO &&
                 existingUser.PhoneNumber == updatedProfile.phone &&
                 existingUser.Birthdate == updatedProfile.Birthdate &&
                 existingUser.Birthdate == updatedProfile.Birthdate &&
                 existingUser.ginder == updatedProfile.ginder)
            {
                return BadRequest("No changes detected. Please provide updated information.");
            }

            // Update the user profile
            existingUser.fname = updatedProfile.fname ?? existingUser.fname;
            existingUser.lname = updatedProfile.lname ?? existingUser.lname;
            existingUser.UserName = updatedProfile.UserName ?? existingUser.UserName;
            existingUser.Email = updatedProfile.Email ?? existingUser.Email;
            existingUser.NormalizedUserName = (updatedProfile.UserName ?? existingUser.UserName).ToUpper();
            existingUser.NormalizedEmail = (updatedProfile.Email ?? existingUser.Email).ToUpper();

            existingUser.BIO = updatedProfile.BIO;
            existingUser.PhoneNumber = updatedProfile.phone;
            existingUser.Birthdate = updatedProfile.Birthdate != DateTime.MinValue ? updatedProfile.Birthdate : existingUser.Birthdate;
            existingUser.ginder = updatedProfile.ginder;
            await _profileRepository.Update(existingUser);

            return Ok("The data has been updated successfully");
        }



        [HttpPost("createdata")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApplicationUser>> createdata(createdatadto createdatadto)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            var existingUser = await _profileRepository.Get(e => e.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }
            // Check if any field is updated
            if (
                existingUser.BIO == createdatadto.bio &&

                existingUser.ginder == createdatadto.ginder)
            {
                return BadRequest("No changes detected. Please provide updated information.");
            }
            existingUser.BIO = createdatadto.bio;
            existingUser.ginder = createdatadto.ginder;

            await _profileRepository.Update(existingUser);

            return Ok(createdatadto);
        }




        [HttpPut("profile/changepassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePassword changePassword)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            var user = await _profileRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);

            if (user == null)
            { return NotFound("User not found"); }

            var errors = new List<string>();
            // Check if any required fields are null
            if (changePassword.NewPassword == null || changePassword.ConfirmPassword == null || changePassword.CurrentPassword == null)
            {
                errors.Add("New Password, Confirm Password, and Current Password are required");
            }

            // Check if New Password matches Confirm Password
            if (changePassword.NewPassword != changePassword.ConfirmPassword)
            {
                errors.Add("New Password and Confirm Password do not match");
            }

            // Check if New Password is the same as Current Password
            if (changePassword.NewPassword == changePassword.CurrentPassword)
            {
                errors.Add("New Password and Current Password are the same");
            }
            // If there are any errors, return them
            if (errors.Any())
            {
                return BadRequest(errors);
            }
            var result = await _profileRepository.ChangePassword(user, changePassword);


            if (result is not ApplicationUser)
                return BadRequest(result);
            return Ok(result);
        }
        [HttpPost("uploadProfilePicture")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApplicationUser>> uploadProfilePicture(IFormFile file)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            var existingUser = await _profileRepository.Get(e => e.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }
            var result = await WriteFile(file);
            existingUser.imgeurl = result;


            await _profileRepository.Update(existingUser);

            return Ok(existingUser);
        }



        [HttpPut("Private")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApplicationUser>> Private()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            var existingUser = await _profileRepository.Get(e => e.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }



            existingUser.IsPrivate = true;

            await _profileRepository.Update(existingUser);

            return Ok("Your account is private..");
        }


        [HttpPut("public")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApplicationUser>> publicAccount()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            var existingUser = await _profileRepository.Get(e => e.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.IsPrivate = false;

            await _profileRepository.Update(existingUser);

            return Ok("Your account is public..");
        }
        [HttpPost("uploadCV")]
        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<ActionResult<ApplicationUser>> uploadCV(IFormFile file)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            var existingUser = await _profileRepository.Get(e => e.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }
            var result = await cv(file);
            existingUser.CV = result;


            await _profileRepository.Update(existingUser);

            return Ok(existingUser);
        }



        [HttpGet("Getcv/string:id")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]


        public async Task<ActionResult<ApplicationUser>> Getcv(string userId)

        {
            if (userId == null)
                return BadRequest();
            var User = await _profileRepository.Get(e => e.Id == userId);



            {
                if (User == null) return NotFound();

                else
                {
                    return Ok(User.CV);
                }
            }

        }
        [HttpGet("downloadCV")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadCV(string userId)
        {
            if (userId == null)
                return BadRequest();

            var user = await _profileRepository.Get(e => e.Id == userId);

            if (user == null)
                return NotFound();

            // Check if the CV filename is not null or empty
            if (string.IsNullOrEmpty(user.CV))
                return NotFound("CV not found for the user.");

            var filePath = Path.Combine(@"C:\Users\aminm\OneDrive\Desktop\project\New folder\FinalONEfromMaiiii\public\cv", user.CV);

            // Check if the file exists
            if (!System.IO.File.Exists(filePath))
                return NotFound("CV file not found on the server.");

            // Construct the new filename using the username
            var newFileName = $"{user.UserName}_CV{Path.GetExtension(filePath)}";

            // Return the file with the new filename
            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                stream.CopyTo(memory);
            }
            memory.Position = 0;

            // Determine the content type
            var contentType = "application/octet-stream";

            // Return the file as a stream with the new filename
            return File(memory, contentType, newFileName);
        }



        [HttpGet("notifications")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<notification>>> notifications()

        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            return (await _profileRepository.GetAllTEntity<notification>(e => e.userid == id));

        }
    }
}
