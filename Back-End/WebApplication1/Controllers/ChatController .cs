
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Plugins;
using System.Security.Claims;
using System.Xml.Linq;
using WebApplication1.models;
using WebApplication1.models.dto;
using WebApplication1.Models;
using WebApplication1.Repository.Repository;



namespace WebApplication1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;


        public ChatController(IChatRepository chatRepository)
        {

            _chatRepository = chatRepository;


        }

        private async Task<string> WriteFile(IFormFile file)
        {
            string filename = "";
            var extension = "." + file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
            filename = DateTime.Now.Ticks.ToString() + extension;
            
            // Define your desired path
            var filepath = @"C:\Users\aminm\OneDrive\Desktop\project\New folder\FinalONEfromMaiiii\public\ChatImgs";

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



       

        [HttpPost("send")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SendMessage(string Receiverid ,string? text, IFormFile? file)
        {
            var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
            var Senderid = userIdClaim.Value;

            ApplicationUser Sender = await _chatRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == Senderid);
            ApplicationUser Receiver = await _chatRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == Receiverid);
            if (Sender == null || Receiver == null)
                return BadRequest();


            try
            {
                string result = null;

                if (file != null)
                {
                    result = await WriteFile(file);
                }

                messageDTO messageDTO = new()
                {
                    MessageText = text,
                    file=result,
                    Receiver=Receiver,
                    Sender=Sender,
                    Senderid=Senderid,
                    Receiverid= Receiverid,

                };

                await _chatRepository.SendMessage(messageDTO);

                return Ok("Message sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        [HttpPut("{messageId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateMessage(int messageId,string Messages )
        {
            try
            {
                await _chatRepository.Update(messageId, Messages);
                return Ok("Message updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{messageId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            try
            {
                await _chatRepository.Delete(messageId);
                return Ok("Message deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("get")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMessages(string receiverId)
        {
            try
            {
                var userIdClaim = (HttpContext.User.Identity as ClaimsIdentity)?.Claims.FirstOrDefault(c => c.Type == "uid");
                if (userIdClaim == null)
                    return BadRequest("User ID not found in claims.");

                var senderId = userIdClaim.Value;

                ApplicationUser sender = await _chatRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == senderId);
                if (sender == null)
                    return NotFound("Sender not found.");

                ApplicationUser receiver = await _chatRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == receiverId);
                if (receiver == null)
                    return NotFound("Receiver not found.");

                var messages = await _chatRepository.GetAllTEntity<Messages>(e => (e.SenderId == senderId && e.ReceiverId == receiverId)|| (e.SenderId == receiverId && e.ReceiverId == senderId));

              
                
                
                List<messageDTOResponses> messageDTOResponses = new List<messageDTOResponses>();

                foreach (var message in messages)
                {
                    messageDTOResponses.Add(new messageDTOResponses
                    {   id= message.Id,
                        MessageText = message.MessageText,
                        sendat = message.SentAt.ToString("yyyy-MM-dd hh:mm tt"),
                        username = message.Sender.UserName,
                        file = message.File,
                        urlimge = message.Sender.imgeurl
                        
                    });
                }

                return Ok(messageDTOResponses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Isnternal server error: {ex.Message}");
            }
        }



        public class messageDTOHistory
        {
            public string userid { get; set; }
            public string username { get; set; }
            public string imgeurl { get; set; }
            public string messagetime { get; set; }
            public string lastmessage { get; set; }


        };

        [HttpGet("Historymessages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GitHistorymessages()
        {
            try
            {
                // Retrieve user ID from claims
                var userIdClaim = HttpContext.User.Identity is ClaimsIdentity identity ?
                    identity.Claims.FirstOrDefault(c => c.Type == "uid") : null;

                if (userIdClaim == null)
                    return BadRequest("User ID not found in claims.");

                var userId = userIdClaim.Value;

                // Retrieve messages sent and received by the user
                var messagesSend = await _chatRepository.GetAllTEntity<Messages>(e => e.SenderId == userId);
                var messagesReceive = await _chatRepository.GetAllTEntity<Messages>(e => e.ReceiverId == userId);

                // Dictionary to store the latest message for each user
                var latestMessages = new Dictionary<string, messageDTOHistory>();

                // Add messages sent by the user
                foreach (var message in messagesSend.Concat(messagesReceive))
                {
                    var otherUserId = message.SenderId == userId ? message.ReceiverId : message.SenderId;

                    if (!latestMessages.TryGetValue(otherUserId, out var existingMessage) ||
                        DateTime.Parse(message.SentAt.ToString("yyyy-MM-dd hh:mm tt")) > DateTime.Parse(existingMessage.messagetime))
                    {
                        var otherUser = await _chatRepository.GetSpecialEntity<ApplicationUser>(e => e.Id == otherUserId);
                        var messageDTO = new messageDTOHistory
                        {
                            messagetime = message.SentAt.ToString("yyyy-MM-dd hh:mm tt"),
                            lastmessage = message.MessageText,
                            userid = otherUser.Id,
                            username = otherUser.UserName,
                            imgeurl = otherUser.imgeurl
                        };

                        latestMessages[otherUserId] = messageDTO;
                    }
                }

                // Sort the latestMessages dictionary by messagetime in descending order (newest first)
                var sortedMessages = latestMessages.Values.OrderByDescending(m => DateTime.Parse(m.messagetime)).ToList();

                return Ok(sortedMessages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



    }



}

