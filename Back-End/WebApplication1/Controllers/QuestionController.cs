using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WebApplication1.models;
using WebApplication1.models.dto;
using WebApplication1.Repository.Repository.QuestionRepository;

namespace WebApplication1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;
        private readonly appDbcontext1 _appDbcontext1;
        public QuestionController(IQuestionRepository questionRepository, appDbcontext1 appDbcontext1)
        {
            _questionRepository = questionRepository;
            _appDbcontext1 = appDbcontext1;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<QuestionDTO>> GetAll()
        {
            var opject = await _questionRepository.GetAllQuestion();
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            return Ok(opject);
        }

        //[HttpGet("GetAllQuestion")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status400BadRequest)]
        //public async Task<ActionResult<List<QuestionDTO>>> GetAllQuestion() 
        //{
        //    var opject = await _questionRepository.GetAllQuestion();
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);
        //    return Ok(opject);

        //}


        [HttpGet("id:string")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<QuestionDTO>> Get(int id)
        {
            if (id == null)
                return BadRequest();

            var opject = await _questionRepository.Get(e => e.Id == id);

            if (opject == null)
                return NotFound();
            return Ok(opject);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<QuestionDTO>> CreatQuestion([FromBody] QuestionDTO2 questionDTO)
        {
            if (questionDTO == null)
                return BadRequest();

            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;


            var usernameClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "username");
            var username = usernameClaim?.Value;


            Question model = new()
            {
                question = questionDTO.question,
                UserId = userId,
                UserName = username
            };

            //await _appDbcontext1.questions.AddAsync(model);

            //await _appDbcontext1.SaveChangesAsync();

            await _questionRepository.Create(model);
            return Ok(model);
        }

        [HttpPut("id:int ")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> update(int id, [FromBody] QuestionDTO questionDto)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            //  var opject = await _appDbcontext1.questions.AnyAsync(i => i.Id == id);
            var opject = await _questionRepository.Get(i => i.Id == id);

            //if (!opject)
            //    return BadRequest();

            if (opject == null)
                return BadRequest();
            if (questionDto == null)
                return BadRequest();
            _questionRepository.Detach(opject); // Detach the entity
            Question model = new()
            {
                Id = id,
                question = questionDto.question,
                UserId = userId,
            };
            await _questionRepository.UpdateQuestion(model);
            return NoContent();
        }

        [HttpDelete("DeleteQuestion/id:int")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            if (id == 0)
                return BadRequest();

            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var opject = await _questionRepository.Get(e => e.Id == id);
            if (opject == null)
                return NotFound();

            if (userId != opject.UserId)
                return BadRequest();


            await _questionRepository.Remove(opject);
            return NoContent();
        }


        [HttpPost("LikeQuestion/id:int")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> LikeQuestion(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var question = await _questionRepository.Get(e => e.Id == id);
            if (question == null)
                return NotFound();

            var NewOpject = await _appDbcontext1.questionEvents.FirstOrDefaultAsync(e => e.QuestionId == id &&
            e.userid == userId && e.typeEvent == "like");
            if (NewOpject != null)
            {
                DeleteLike(id);
                return NoContent();
            }
            QuestionEvent questionEvent = new()
            {
                QuestionId = question.Id,
                typeEvent = "like",
                userid = userIdClaim.Value,
                eventDate = DateTime.UtcNow,
                text = null,
            };
            var opject = await _questionRepository.AddQuestionEvent(questionEvent);
            if (opject == null)
                return NotFound();
            question.TotalLike++;
            await _questionRepository.save();
            var entyty = await _questionRepository.GetSpecialEntity<Question>(e => e.Id == id);
            var user = await _questionRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);

            var notification = new notification
            {
                userid = entyty.UserId,
                AnotheruserID = userId,
                username = user.UserName,
                imgeurl = user.imgeurl,
                notificationsrelatedID = id,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "Question",
                eventType = "like"

            };
            await _questionRepository.Addnotification(notification);
            return Ok();
        }

        [HttpPost("comment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<QuestionDTO>> comment(int id, string Comment)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var usernameClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "username");
            var username = usernameClaim?.Value;

            var question = await _questionRepository.Get(e => e.Id == id);

            if (question == null)
                return NoContent();

            QuestionEvent questionEvent = new()
            {
                QuestionId = question.Id,
                UserName = username,
                typeEvent = "Comment",
                userid = userIdClaim.Value,
                eventDate = DateTime.UtcNow,
                text = Comment
            };

            var opject = await _questionRepository.AddQuestionEvent(questionEvent);
            if (opject == null)
                return NotFound();
            question.TotalComment++;
            await _questionRepository.save();
            var entyty = await _questionRepository.GetSpecialEntity<Question>(e => e.Id == id);
            var user = await _questionRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);

            var notification = new notification
            {
                userid = entyty.UserId,
                AnotheruserID = userId,
                username = user.UserName,
                imgeurl = user.imgeurl,
                notificationsrelatedID = id,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "Question",
                eventType = "answer"

            };
            await _questionRepository.Addnotification(notification);
            return NoContent();

        }

        [HttpDelete("DeleteLike/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<QuestionDTO>> DeleteLike(int questionid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            //  var Like = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.QuestionId == questionid && e.userid == userId);
            var Like = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.QuestionId == questionid && e.userid == userId && e.typeEvent == "like");
            var question = await _questionRepository.Get(e => e.Id == questionid);
            if (questionid == 0 || userId == null)
                return BadRequest();

            if (Like == null)
                return NotFound();

            await _questionRepository.RemoveQuestionEvent(Like);
            question.TotalLike--;
            await _questionRepository.save();
            return NoContent();
        }

        [HttpGet("Getlikes/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Getlikes(int id)
        {
            if (id == null)
                return BadRequest();

            var opject = await _questionRepository.GetAllTEntity<QuestionEvent>(e => e.typeEvent == "like" && e.QuestionId == id);

            if (opject == null)
                return NotFound();

            return Ok(opject);
        }

        [HttpDelete("comment/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteComment(int questionId)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var Comment = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.QuestionId == questionId && e.userid == userId);

            if (questionId == 0 || userId == null)
                return BadRequest();

            if (Comment == null)
                return NotFound();

            await _questionRepository.RemoveQuestionEvent(Comment);
            await _questionRepository.save();
            return NoContent();

        }

        [HttpGet("GetComment/id:int ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetComment(int id)

        {
            if (id == null)
                return BadRequest();

            var Event = await _questionRepository.GetAllTEntity<QuestionEvent>(e => e.typeEvent == "comment" && e.QuestionId == id);

            if (Event == null)
                return NotFound();

            return Ok(Event);
        }

        [HttpGet("GetAllComment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<QuestionEvent>> GetAllComment()

        {
            var Event = await _questionRepository.GetAllComment();
            if (Event == null)
                return NotFound();
            return Ok(Event);
        }





        [HttpGet("GetQuestionByUserId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> GetQuestionByUserId()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;
            // var questions = await _appDbcontext1.questions.Where(p => p.User == userId).ToListAsync();
            var questions = await _questionRepository.GetAllTEntity<Question>(p => p.UserId == userId);

            if (questions == null)
                return NotFound();
            return Ok(questions);
        }

        [HttpPost("LikeComment", Name = "LikeComment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> LikeComment(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var questionEvent = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.Id == id);

            if (questionEvent == null)
                return NotFound();

            if (questionEvent.typeEvent != "Comment")
                return BadRequest();

            if (questionEvent.typeEvent == "Comment")
                questionEvent.RateComment++;

            await _questionRepository.UpdateQuestionEvent(questionEvent);
            var entyty = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.Id == id);
            var user = await _questionRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);

            var notification = new notification
            {
                userid = entyty.userid,
                AnotheruserID = userId,
                username = user.UserName,
                imgeurl = user.imgeurl,
                notificationsrelatedID = id,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "answer",
                eventType = "like"

            };
            await _questionRepository.Addnotification(notification);


            return Ok(questionEvent);
        }

        [HttpPost("DisLikeComment", Name = "DisLikeComment")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DisLikeComment(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var questionEvent = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.Id == id);

            if (questionEvent == null)
                return NotFound();

            if (questionEvent.typeEvent != "Comment")
                return BadRequest();

            if (questionEvent.typeEvent == "Comment")
                questionEvent.RateComment--;

            await _questionRepository.UpdateQuestionEvent(questionEvent);
            var entyty = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.Id == id);
            var user = await _questionRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);

            var notification = new notification
            {
                userid = entyty.userid,
                AnotheruserID = userId,
                username = user.UserName,
                imgeurl = user.imgeurl,
                notificationsrelatedID = id,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "answer",
                eventType = "like"

            };
            await _questionRepository.Addnotification(notification);

            return Ok(questionEvent);
        }

        [HttpPost("Bookmark/id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Question>> Bookmark(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var question = await _questionRepository.Get(e => e.Id == id);
            if (question == null)
                return NotFound();

            var NewOpject = await _appDbcontext1.questionEvents.FirstOrDefaultAsync(e => e.QuestionId == id &&
            e.userid == userId && e.typeEvent == "Bookmark");
            if (NewOpject != null)
            {
                DeleteLike(id);
                return NoContent();
            }
            QuestionEvent questionEvent = new()
            {
                QuestionId = question.Id,
                typeEvent = "Bookmark",
                userid = userIdClaim.Value,
                eventDate = DateTime.UtcNow,
                text = null,
            };
            var opject = await _questionRepository.AddQuestionEvent(questionEvent);
            if (opject == null)
                return NotFound();
            var entyty = await _questionRepository.GetSpecialEntity<Question>(e => e.Id == id);
            var user = await _questionRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == userId);

            var notification = new notification
            {
                userid = entyty.UserId,
                AnotheruserID = userId,
                username = user.UserName,
                imgeurl = user.imgeurl,
                notificationsrelatedID = id,
                notificationdate = DateTime.UtcNow.ToString(),
                notificationdType = "Question",
                eventType = "Bookmark"

            };
            await _questionRepository.Addnotification(notification);
            return Ok();
        }




        [HttpPut("unBookmark/questionid")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<evnet>> unBookmark(int questionid)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            //  var Like = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.QuestionId == questionid && e.userid == userId);
            var Like = await _questionRepository.GetSpecialEntity<QuestionEvent>(e => e.QuestionId == questionid && e.userid == userId && e.typeEvent == "Bookmark");
            var question = await _questionRepository.Get(e => e.Id == questionid);
            if (questionid == 0 || userId == null)
                return BadRequest();

            if (Like == null)
                return NotFound();

            await _questionRepository.RemoveQuestionEvent(Like);
            
            return NoContent();
        }



        [HttpGet("GetBookmark")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> GetBookmark()

        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;



            var ProjectEvent = await _questionRepository.GetAllTEntity<QuestionEvent>(e => e.typeEvent == "Bookmark" && e.userid == id);



            List<Question> projects = new List<Question>();

            foreach (var p in ProjectEvent)
            {
                var opject = await _questionRepository.GetSpecialEntity<Question>(e => e.Id == p.QuestionId);
                projects.Add(opject);
            }


            return Ok(projects);


        }
        [HttpPost("report/id ")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<post>> report(int id)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var userId = userIdClaim.Value;

            var question = await _questionRepository.Get(e => e.Id == id);
            if (question == null)
                return NotFound();

            var NewOpject = await _appDbcontext1.questionEvents.FirstOrDefaultAsync(e => e.QuestionId == id &&
            e.userid == userId && e.typeEvent == "report");
            if (NewOpject != null)
            {
                DeleteLike(id);
                return NoContent();
            }
            QuestionEvent questionEvent = new()
            {
                QuestionId = question.Id,
                typeEvent = "Bookmark",
                userid = userIdClaim.Value,
                eventDate = DateTime.UtcNow,
                text = null,
            };
            var opject = await _questionRepository.AddQuestionEvent(questionEvent);
            if (opject == null)
                return NotFound();



            var totallreport = await _questionRepository.GetAllTEntity<QuestionEvent>(e => e.QuestionId == question.Id && e.typeEvent == "report");
            var totallike = await _questionRepository.GetAllTEntity<QuestionEvent>(e => e.QuestionId == question.Id && e.typeEvent == "like");

            if ((totallreport.Count >= (totallike.Count) * 2) && totallreport.Count >= 10) { await _questionRepository.Remove<Question>(question); }

            return Ok("this report has been added ");
            
        }




        [HttpGet("GetLOGINQuestion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetLOGINQuestion()
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var id = userIdClaim.Value;
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var opject = await _questionRepository.GetAllTEntity<Question>(e => e.UserId == id );
            if (opject == null)
                return NotFound();
            return Ok(opject);
        }




        [HttpGet("GetANTHERQuestion/string:id")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> GetANTHERQuestion(string id)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var opject = await _questionRepository.GetAllTEntity<Question>(e => e.UserId == id);
            if (opject == null)
                return NotFound();
            return Ok(opject);
        }











    }
}
