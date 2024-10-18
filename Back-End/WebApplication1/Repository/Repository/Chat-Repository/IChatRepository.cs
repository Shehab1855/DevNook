

using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using WebApplication1.models;
using WebApplication1.models.dto;
using WebApplication1.Models;

namespace WebApplication1.Repository.Repository
{
    public interface IChatRepository : IRepository<Messages>
    {

        Task SendMessage(messageDTO messageDTO);
        Task Delete(int messageId);
        Task Update(int messageId, string Messages);
    }
}

       
