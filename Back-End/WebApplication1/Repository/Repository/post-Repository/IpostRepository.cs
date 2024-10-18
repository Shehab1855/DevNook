

using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;
using WebApplication1.models;

namespace WebApplication1.Repository.Repository
{
    public interface IpostRepository : IRepository<post>
    {


      
        Task<post> update(post entity);



        Task AddEvent(evnet evnet);




    }
}
