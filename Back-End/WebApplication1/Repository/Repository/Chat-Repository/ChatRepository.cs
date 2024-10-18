using WebApplication1.Controllers;
using WebApplication1.models.dto;
using WebApplication1.Models;

namespace WebApplication1.Repository.Repository
{


    public class ChatRepository : Repositoryg<Messages>, IChatRepository
    {
        private readonly appDbcontext1 _db;
        public ChatRepository(appDbcontext1 db) : base(db)
        {
            _db = db;
            
        }

        public async Task SendMessage(messageDTO messageDTO)
        {
            var newChat = new Messages
            {
                MessageText = messageDTO.MessageText,
                SentAt = DateTime.Now,
                SenderId = messageDTO.Sender.Id ,
                ReceiverId = messageDTO.Receiver.Id,
                Sender = messageDTO.Sender,
                Receiver= messageDTO.Receiver,
                File= messageDTO.file,
            };
            _db.Message.Add(newChat);
            await save();

       }

        public async Task Delete(int messageId)
        {
            var chatToDelete = await _db.Message.FindAsync(messageId);
            if (chatToDelete != null)
            {
                _db.Message.Remove(chatToDelete);
                await save();
            }
        }

        public async Task Update(int messageId, string Messages)
        {
            var chatToUpdate = await _db.Message.FindAsync(messageId);
            if (chatToUpdate != null)
            {
                chatToUpdate.MessageText = Messages;
                chatToUpdate.isupdate = true;
                await save();
            }
        }



    }
}


